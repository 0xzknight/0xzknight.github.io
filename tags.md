---
layout: default
title: Tags
nav_order: 3
---

# Tags

{% assign tags_list = "" | split: "" %}
{% for post in site.posts %}
  {% for tag in post.tags %}
    {% unless tags_list contains tag %}
      {% assign tags_list = tags_list | push: tag %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign tags_list = tags_list | sort %}

{% for tag in tags_list %}
## {{ tag }}

{% for post in site.posts %}
  {% if post.tags contains tag %}
- [{{ post.title }}]({{ post.url | relative_url }})
  {% endif %}
{% endfor %}

{% endfor %}
