---
title: "HTB: BoxName"
date: YYYY-MM-DD 12:00:00 +0500
categories: [HackTheBox, Medium]   # [HackTheBox, Easy/Medium/Hard/Insane]
tags: [hackthebox, linux, technique1, technique2]

# Box Info Card fields
os: Linux                          # Linux / Windows / FreeBSD
difficulty: Medium                 # Easy / Medium / Hard / Insane
htb_release: YYYY-MM-DD
htb_retire: YYYY-MM-DD
htb_creator: "creator_name"
---

## Recon

### nmap

```bash
nmap -sV -sC -p- --min-rate 5000 10.10.11.XXX -oN nmap/initial
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

<!-- Необязательно: интересные детали вне основного writeup -->
