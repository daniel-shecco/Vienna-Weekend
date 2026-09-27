# Vienna Weekend Guide

A weekly page of family-friendly events and daytime techno/electronic parties
in Vienna, for the coming Saturday and Sunday. Events are sorted by date and
start time and show the venue, price and a link to the original listing.

Page: https://daniel-shecco.github.io/Vienna-Weekend/

## How it works

1. Every Friday at about 07:00 Vienna time, a **Claude Code routine** follows
   [ROUTINE.md](ROUTINE.md): it researches the weekend's events on the web and
   pushes them to `data/events.json`. This uses the Claude plan's usage, not
   API credits.
2. The push triggers `.github/workflows/weekend.yml`, which renders the page
   (`src/render.mjs`) and publishes it to GitHub Pages. No API keys or paid
   calls are involved.

While the routine is researching, the page shows a "searching" message.

## Local development

```sh
npm test
npm run build:sample        # renders fixtures/sample-events.json to site/
npm run build               # renders data/events.json to site/
```
