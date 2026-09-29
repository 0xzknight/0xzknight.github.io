---
layout: default
title: Cheatsheets
permalink: /cheatsheets/
---

# Cheatsheets

Справочные заметки по инструментам для пентеста.

{% assign all_cs = site.cheatsheets | where_exp: "cs", "cs.parent == nil and cs.grand_parent == nil" | sort: 'nav_order' %}

<ul class="tag-post-list">
{% for cs in all_cs %}
<li>
  <a href="{{ cs.url | relative_url }}">{{ cs.title }}</a>
</li>
{% endfor %}
</ul>
