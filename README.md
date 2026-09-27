# Vienna Weekend Guide

Every Friday at 07:00 (Vienna time) a GitHub Actions workflow researches
what's on in Vienna for the coming Saturday and Sunday and publishes a page to
GitHub Pages. The page covers:

- family-oriented events (kids' theatre, museum programmes, zoo, markets, festivals…)
- techno and electronic music parties that happen during the day

Events are sorted by date and start time and show the venue, price and a link
to the original listing.

## How it works

1. `src/find-events.mjs` runs a handful of short web searches with Claude
   Haiku 4.5 (family events, kids' theatre, museums, markets, day raves),
   then converts the findings into structured JSON.
2. `src/events.mjs` drops events outside the weekend, without a valid link,
   or duplicated, and sorts the rest.
3. `src/render.mjs` writes `site/index.html` (plus `site/events.json`).
4. `.github/workflows/weekend.yml` runs this on Fridays and deploys `site/`
   to GitHub Pages. The research notes are kept as a workflow artifact for 30 days.

## Cost

Each call is priced from its token and search usage, and the run stops
searching before it could go over **$0.30** (about €0.28). The
per-call breakdown appears in the workflow run summary and in
`events.json`. To change the cap, add a repository variable `MAX_COST_USD`
(Settings → Secrets and variables → Actions → Variables).

## Setup

1. **Settings → Secrets and variables → Actions**: add a secret named
   `ANTHROPIC_API_KEY`. If the key isn't scoped to a workspace, also add
   `ANTHROPIC_WORKSPACE_ID` with the ID of the workspace to bill.
2. **Settings → Pages → Build and deployment → Source**: choose
   **GitHub Actions**.
3. **Actions → Vienna weekend guide → Run workflow** to publish the first page
   without waiting for Friday.

## Local development

```sh
npm install
npm test
npm run build:sample                         # renders fixtures/sample-events.json to site/
ANTHROPIC_API_KEY=... npm run build          # real run
```
