---
layout: page
title: Cheatsheets
icon: bi bi-journal-code
order: 1
permalink: /cheatsheets/
---

Quick-reference notes for pentest techniques.

{% assign groups = site.cheatsheets | group_by: "group" | sort: "name" %}
{% for grp in groups %}

### {{ grp.name }}

{% assign top_items = grp.items | where_exp: "item", "item.parent == nil or item.parent == ''" | sort: "nav_order" %}
{% for item in top_items %}
- [{{ item.title }}]({{ item.url | relative_url }}){% assign children = grp.items | where: "parent", item.title | sort: "nav_order" %}{% if children.size > 0 %}: {% for child in children %}[{{ child.title }}]({{ child.url | relative_url }}){% unless forloop.last %}, {% endunless %}{% endfor %}{% endif %}

{% endfor %}
{% endfor %}
