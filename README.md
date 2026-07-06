# nick hacks stuff — блог на Jekyll (тема Just the Docs)

## Деплой на GitHub Pages

1. Переименуй/создай репозиторий `nick.github.io` (или обычный репозиторий +
   включи Pages в настройках).
2. Скопируй все файлы из этого архива в корень репозитория.
3. Зайди в Settings → Pages → Source → выбери **GitHub Actions**
   (обязательно, т.к. remote_theme не собирается штатным Pages-билдером).
4. Запушь в `main` — воркфлоу `.github/workflows/pages.yml` соберёт сайт
   и задеплоит.
5. Открой `https://<username>.github.io` (или свой custom domain, если
   пропишешь его в `CNAME`).

## Локальная разработка

```bash
bundle install
bundle exec jekyll serve --livereload
```

Открыть http://localhost:4000

## Структура

- `_posts/` — write-up'ы HTB/THM (аналог блога 0xdf), front matter: `title`,
  `date`, `tags`.
- `_cheatsheets/` — дерево справочников (то, что было на скриншоте: Chisel →
  SSF → Prep/Server/Client). Иерархия задаётся через `parent` /
  `grand_parent` / `has_children` в front matter.
- `tags.md` — авто-генерируемая страница со списком тегов и постов под
  каждым (аналог `/tags` у 0xdf).
- `index.md` — лента последних 10 постов.

## Миграция из Obsidian / Quartz

Так как у тебя уже есть структурированный vault (`03_Work/Reports`,
`04_Labs/HTB`, `04_Labs/THM`), удобнее всего:

1. Каждую заметку про пройденный box → копируешь в `_posts/YYYY-MM-DD-title.md`,
   добавляешь front matter (`title`, `date`, `tags`).
2. Wikilinks (`[[Заметка]]`) Jekyll **не понимает** из коробки — либо
   вручную меняешь на обычные markdown-ссылки, либо ставишь плагин
   `jekyll-wikilinks` (работает нестабильно с remote_theme на Pages Actions,
   надёжнее руками поправить при переносе, их не так много на пост).
3. Изображения из Obsidian (`99_System/Attachments`) → в `assets/images/`,
   ссылки поправить на `{{ site.baseurl }}/assets/images/...`.
4. Материалы из `03_Work` (реальная инфраструктура) — **не переносить**,
   они и так у тебя в отдельном несинхронизируемом vault.

## Что доделать под себя

- Заменить `nick` / `nick.github.io` в `_config.yml` на свои данные.
- Добавить свой `favicon.ico` и `assets/images/avatar.*`.
- Если захочешь RSS как у 0xdf — `jekyll-feed` уже подключен, фид будет на
  `/feed.xml` автоматически.
