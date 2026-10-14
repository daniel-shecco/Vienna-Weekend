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
   seasonal events), including **street festivals and flea markets**
   (Straßenfeste, Grätzlfeste, Bezirksfeste, Kirtage, Flohmärkte).
2. **Daytime electronic**: techno or electronic music parties that start
   before about 18:00 (day raves, open-air afternoon sessions, family raves,
   festivals with DJs). Skip night-only club events.

Use WebSearch to find candidates and WebFetch to read the listing pages and
confirm details. Many listings are only filled in towards the weekend, which
is why this runs on Friday morning. Check these sources:

Family / kids
- wien.gv.at/veranstaltungen/kinder (city calendar, free events)
- kinderkalender.at/wien.html (open each event's page for venue and details)
- wienxtra.at, falter.at/events (category Kinder & Jugend)
- dschungelwien.at/spielplan, lilarum.at (puppet theatre)
- zoovienna.at, haus-des-meeres.at, mqw.at
- langenacht.orf.at and similar one-off city events when they fall on the
  weekend

Kids' theatre (Kindertheater, Puppentheater, Kasperl, Märchen; search
"Kindertheater Wien <date>" too)
- dschungelwien.at/spielplan, tdj.at (Theater der Jugend: Renaissancetheater
  and Theater im Zentrum), lilarum.at
- maerchenbuehne.at/spielplan.html (Märchenbühne Der Apfelbaum)
- kasperlundpezi.at (Urania Puppentheater), Puppenbühne der Wiener
  Kinderfreunde, Brailli Bär Kindertheater
- theaterspielplan.at, kinder-kalender.at/kinderkalender-wien-buehne1.html
  (overviews of children's stages)

Family music events (kids' concerts, family concerts, sing-alongs, baby
concerts, children's operas and musicals; search "Kinderkonzert Wien <date>",
"Familienkonzert Wien <date>", "Babykonzert Wien <date>" too)
- hdm.at/en/concerts (Haus der Musik, "Classic Cool!" series)
- konzerthaus.at and musikverein.at (concerts for young audiences)
- muth.at (Wiener Sängerknaben hall), jeunesse.at (kids' series)
- wiener-staatsoper.at and volksoper.at (children's operas, family shows)
- kinderkonzerte.wien (kids' and baby concerts)
- daytime open-air or park concerts aimed at families
- Mark these `family`. Concerts for adults only are still skipped.

Gaming (video games, e-sports, board games, comic/pop-culture cons)
- search "Gaming Event Wien <date>", "Brettspiel Wien <date>",
  "Spielefest", "Esports Festival", "Vienna Comic Con", "FROG Gaming"
- videospielen.at/events, dailygame.at, viecc.com
- Game City (normally October at the Rathaus) is paused in 2026 according
  to meinbezirk.at and heute.at; only list it if its own site confirms a date.
- Include gaming events that families or kids/teens can attend; mark them
  `family`. Skip 18+ events.

City of Vienna events (Stadt Wien) at the Rathaus, Rathausplatz or anywhere
in the city
- wien.gv.at/veranstaltungen (all highlights), wien.gv.at/veranstaltungen/herbst
  (and /fruehling, /sommer, /winter by season), wien.gv.at/veranstaltungen/kinder
- Rathausplatz and Rathaus events: 1000thingsmagazine.com (Rathausplatz
  overview), ganz-wien.at/veranstaltungen/rathausplatz.html,
  falter.at/location/13/rathausplatz
- wienxtra.at (the city's youth and kids' programme)
- Include free city festivals, Rathaus open days, markets and similar
  events that suit families.
- wien.gv.at often times out on WebFetch; if it does, use WebSearch for
  "wien.gv.at Veranstaltungen <date>" and confirm on another listing.

Museum events for families and children (check each museum's family /
kids' programme for workshops, family tours, kids' tours and special
weekend events; ordinary opening hours and permanent exhibitions don't count)
- wienmuseum.at/programme_kinder_und_familien
- nhm.at (Naturhistorisches Museum), technischesmuseum.at
- khm.at (Kunsthistorisches Museum, incl. Schatzkammer and Weltmuseum)
- kindermuseum.at (ZOOM), kindermuseum.at Schloss Schönbrunn
  (kaiserkinder.at), hdm.at (Haus der Musik)
- albertina.at, belvedere.at, mak.at, mumok.at, leopoldmuseum.org,
  kunsthallewien.at, jmw.at (Jüdisches Museum)
- search "Familienführung Wien" / "Kinderführung Museum Wien" + the date
- **Planetarium Wien** (vhs.at/de/e/planetarium, programme at
  vhs.at/de/e/planetarium/veranstaltungen): add its kids' and family shows
  (e.g. "Elsa und der große Bär", "Polaris", "Die Sternenmachmaschine",
  "Mission Weltall", "Space4Kids"); skip the evening shows for adults.
  vhs.at blocks WebFetch (Cloudflare, 403), so read the schedule with
  WebSearch, e.g. "Planetarium Wien Programm <Samstag-Datum>" and
  "... <Sonntag-Datum>", and only use show times that come from the vhs.at
  listing. Link each show to https://www.vhs.at/de/e/planetarium/veranstaltungen
  (or the show's own vhs.at page if the search gives one). Venue: Planetarium
  Wien, Oswald-Thomas-Platz 1, 2nd district, Leopoldstadt (Prater).

Street festivals and flea markets (search in German: Straßenfest,
Grätzlfest, Bezirksfest, Kirtag, Flohmarkt, Kinderflohmarkt + the date)
- wien.gv.at/freizeit/privatmaerkte (city list of Kirtage, festivals and
  occasional markets)
- flohmarkt.at/flohmaerkte/wien, flohmarkt-kalender.at/wien
- goodnight.at/magazin/freizeit/strassenfeste-wien,
  1000thingsmagazine.com (Grätzl- und Straßenfeste),
  ganz-wien.at (Straßenmärkte, Grätzl- und Straßenfeste)
- Only flea markets inside Vienna; skip regular antique/trade markets aimed
  at dealers. Give the opening hours as start and end time.

Music and electronic
- goodnight.at/events: go through **all** categories (Alle, Party, Kultur,
  Freizeit), not only raves. Pick up daytime techno/electronic parties,
  other daytime music events (concerts, festivals, open airs) and anything
  aimed at children or families.
- goodnight.at/magazin (party and open-air round-ups)
- warda.at/genre/techno/ (open each event for its start time)
- 1000thingsmagazine.com (monthly "what's on in Vienna" overview)
- ra.co blocks automated access; use WebSearch for its listings instead

Classify each event as `family` (suitable for parents with children,
including family-friendly daytime concerts), `daytime_electronic` (techno or
electronic music starting before about 18:00) or `both`. Skip night-only
club events, and skip concerts and other events that are neither
family-oriented nor electronic (e.g. a jazz matinee for adults).

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
