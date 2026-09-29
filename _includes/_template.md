---
title: "HTB: BoxName"
date: YYYY-MM-DD
tags:
  - HackTheBox
  - Linux         # или Windows / FreeBSD
  - technique1    # главная техника (ssrf, sqli, lfi, ...)
  - technique2
os: Linux         # Linux / Windows / FreeBSD
difficulty: Medium  # Easy / Medium / Hard / Insane
htb_ip: 10.10.11.XXX
htb_points: 30
htb_rating: 4.2
htb_retired: YYYY-MM-DD
htb_img: /assets/img/boxes/boxname.png  # опционально
summary: "Краткое описание — с чего стартуем, центральная техника, foothold и путь к root."
---

## Recon

### nmap

```console
$ nmap -sC -sV -oN nmap/initial 10.10.11.XXX
```

```
PORT   STATE SERVICE REASON  VERSION
...
```

### Web Enumeration

...

## Foothold

...

## User

...

## Root / Privilege Escalation

...

## Beyond Root

<!-- Необязательно: интересные детали, которые не вошли в основной writeup -->
