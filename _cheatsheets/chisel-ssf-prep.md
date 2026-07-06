---
title: Prep
parent: SSF
grand_parent: Chisel
nav_order: 1
---

# Prep

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
