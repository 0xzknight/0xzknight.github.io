---
layout: home
title: Home
nav_order: 1
---

# 0xzknight hacks stuff

Пентест, CTF write-up'ы (HackTheBox, TryHackMe), заметки по red team.

## Последние write-up'ы

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts limit:10 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — {{ post.date | date: "%Y-%m-%d" }}
  {% if post.tags %}
  <small>{{ post.tags | join: ", " }}</small>
  {% endif %}
{% endfor %}

[Все теги →](/tags/){: .btn }
[Cheatsheets →](/cheatsheets/){: .btn }
