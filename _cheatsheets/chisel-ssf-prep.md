---
title: "SSF: Prep"
group: "Tunneling"
parent: "Chisel"
nav_order: 2
---

Готовим клиентскую директорию с сертификатами:

```console
$ find .
.
./ssf
./certs
./certs/trusted
./certs/trusted/ca.crt
./certs/server.key
./certs/dh4096.pem
./certs/certificate.crt
./certs/private.key
./certs/server.crt
```

Конфиг `config.json` для включения shell (по умолчанию выключен):

```json
{
  "ssf": {
    "services": {
      "datagram_forwarder": { "enable": true },
      "stream_forwarder": { "enable": true },
      "shell": { "enable": true, "path": "/bin/bash", "args": "" },
      "socks": { "enable": true }
    }
  }
}
```
