# Weekly research routine

A Claude Code routine runs this every Friday at about 07:00 Vienna time. It
uses the Claude plan's usage, not API credits. Follow these steps exactly.

## 1. Set up

- Work in a clone of `daniel-shecco/vienna-weekend` on `main`.
- Run `npm run --silent weekend`. It prints the Saturday, Sunday and an
  `updated` timestamp to use below.

## 2. Show the "searching" page

Write `data/events.json`:

```json
{ "weekend": { "saturday": "…", "sunday": "…" }, "status": "searching", "updated": "…", "events": [] }
```

Commit ("Searching events for <saturday>–<sunday>") and push to `main`. The
publish workflow turns it into the searching page.

## 3. Research

Find events in Vienna on that Saturday and Sunday of two kinds:

1. **Family-oriented**: things parents can do with children (kids' theatre and
   puppet shows, museum family programmes and workshops, zoo/aquarium
   activities, markets, festivals, outdoor activities, children's concerts,
   seasonal events).
2. **Daytime electronic**: techno or electronic music parties that start
   before about 18:00 (day raves, open-air afternoon sessions, family raves).
   Skip night-only club events.

Use WebSearch to find candidates and WebFetch to read the listing pages and
confirm details. Good sources:

- wien.gv.at/veranstaltungen/kinder, wien.info, falter.at/events (Kinder),
  kinderkalender.at, wienxtra.at
- dschungelwien.at, kindermuseum.at (ZOOM), zoovienna.at, haus-des-meeres.at,
  nhm.at, technischesmuseum.at, wienmuseum.at, mqw.at
- ra.co (Vienna listings) for daytime electronic events

Rules:

- Only include events you confirmed on a web page for those exact dates.
- Don't guess times, prices or URLs. Use `null` for anything you couldn't
  confirm. Ongoing exhibitions without a specific programme that weekend
  don't count.
- `url` must be the event's own listing page, not a search page.
- Aim for 15–30 events. Spend at most about 30 minutes.

## 4. Publish

Write `data/events.json` with `"status": "done"`, the same `weekend` and
`updated`, and the events in this shape (see `src/events.mjs`):

```json
{
  "title": "Kids' flea market",
  "date": "2026-10-03",
  "start_time": "09:00",
  "end_time": "14:00",
  "venue": "Karmelitermarkt",
  "district": "2nd district, Leopoldstadt",
  "description": "One or two plain sentences in English.",
  "category": "family",
  "age_range": "All ages",
  "price": "Free",
  "is_free": true,
  "url": "https://…"
}
```

`category` is `family`, `daytime_electronic` or `both`. Prices are written
like `€12 adults · €6 kids`.

Then check it locally before pushing:

```sh
npm test
node src/build.mjs data/events.json --out /tmp/site   # prints "Kept N of M events"
```

If fewer events are kept than you wrote, fix the dropped ones (date outside
the weekend, bad time format, bad URL or category). Commit ("Events for
<saturday>–<sunday>") and push to `main`.

## If something goes wrong

If research can't be completed, write `data/events.json` with
`"status": "failed"` (same `weekend` and `updated`, empty `events`) and push,
so the page doesn't stay on "searching".
