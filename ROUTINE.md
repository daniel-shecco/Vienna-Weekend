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
   before 19:00 (day raves, open-air afternoon sessions, family raves,
   festivals with DJs, daytime psytrance/goa parties). Skip night-only club
   events.

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

Family music events and **kids' concerts** (Kinderkonzerte, family concerts, sing-alongs, baby
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

Halloween for kids (the weekend around 31 October)
- Kids' Halloween parties, costume parades, pumpkin carving, trick-or-treat
  walks, spooky museum/zoo/aquarium programmes, Halloween kids' theatre and
  Kasperl shows, and family events at the Prater.
- Search "Halloween Kinder Wien <date>", "Halloween Familie Wien <date>",
  "Kürbisschnitzen Wien <date>", "Kinder Halloween Party Wien"; also check
  kinderkalender.at, wienxtra.at, goodnight.at (Halloween round-ups),
  1000thingsmagazine.com, zoovienna.at, haus-des-meeres.at, prater.at.
- Only include events meant for children or families (skip 18+ horror
  parties and club nights). Mark them `family`.

Christmas markets (Christkindlmärkte, Adventmärkte, Weihnachtsmärkte;
season roughly early November to 6 January)
- Include every Christmas market in Vienna that is open that weekend, e.g.
  Rathausplatz (Wiener Christkindlmarkt, incl. its kids' programme and
  Eistraum), Schönbrunn, Belvedere, Spittelberg, Freyung (Altwiener
  Christkindlmarkt), Am Hof, Karlsplatz (Art Advent), Stephansplatz,
  Maria-Theresien-Platz, Riesenradplatz (Prater), Türkenschanzpark,
  Campus Altes AKH and district markets.
- Sources: the markets' own sites (e.g. christkindlmarkt.at), wien.info
  (Christmas markets overview), wien.gv.at/freizeit/privatmaerkte
  (Weihnachtsmärkte list), plus WebSearch "Weihnachtsmarkt Wien <date>".
  Take opening hours from the market's own site; sources often disagree.
- These run for weeks, so list each market once per weekend: on Saturday
  with Saturday's opening hours, and say "also open Sunday <hours>" in the
  description (list it on Sunday instead only if it's closed on Saturday).
  Mention kids' activities (workshops, carousels, ice rinks, Christkind
  visits, Krampus runs) and any special programme that weekend. Mark them
  `family`; the market opening day itself is worth a mention in the title.

Ticket platforms (family/kids shows: circus, musicals, Disney, ice shows,
kids' theatre, magic shows, family concerts)
- wien-ticket.at (sections Freizeit, Musicals & Shows; readable directly),
  oeticket.com (often returns 503 to WebFetch: use WebSearch
  "oeticket Wien Familie <date>" / "oeticket Kinder Wien <date>"),
  eventim-light.com, jetticket.net shops, ticket.io, events.at, eventbrite
  (Vienna, family/kids), falter.at/events (Kinder & Jugend).
- Only include shows with a performance on that Saturday or Sunday, and
  confirm the date and time on the ticket page or the organiser's page.
  Mark them `family`.

Arena Wien Open Air and anything at the Rathaus (`highlight`)
- arena.co.at (Arena Wien programme; open-air season roughly May to
  September): include every Arena Wien open-air event that weekend, even
  adult concerts and evening shows.
- Rathaus / Rathausplatz: include **every** public event there that weekend
  (festivals, markets, concerts, film festival, ice rink, open days), using
  the City of Vienna sources above.
- Mark family-suitable ones `family`; everything else from these two venues
  `highlight` (shown under "Other highlights" on the page). This overrides
  the "skip non-family concerts" rule for these two venues only.

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
- Only include flea markets (Flohmärkte, kids' second-hand markets, antique
  and book markets) in the **5th, 6th, 7th and 15th districts** (Margareten,
  Mariahilf, Neubau, Rudolfsheim-Fünfhaus; postcodes 1050, 1060, 1070,
  1150). Within those districts, include every one that opens before 19:00,
  except the Naschmarkt flea market (always leave it out).
  Give the opening hours as start and end time.

Music and electronic
- goodnight.at/events: go through **all** categories (Alle, Party, Kultur,
  Freizeit), not only raves. Pick up daytime techno/electronic parties,
  other daytime music events (concerts, festivals, open airs) and anything
  aimed at children or families.
- goodnight.at/magazin (party and open-air round-ups)
- warda.at/genre/techno/ (open each event for its start time)
- 1000thingsmagazine.com (monthly "what's on in Vienna" overview)
- ra.co blocks automated access; use WebSearch for its listings instead
- Du Tanzt Mich Mal (Vienna house/techno collective, often afternoon
  open-airs): dutanztmichmal.at/events, warda.at (search "du tanzt mich mal"),
  their Instagram/Facebook via WebSearch. Include their parties that start
  before 19:00 as `daytime_electronic`.
- Psytrance / goa: goabase.net/party/?geoloc=Wien (open each party page for
  start time, venue and price; the list covers 100 km around Vienna, so keep
  only parties inside Vienna). Also search "Psytrance Wien <date>",
  "Goa Party Wien <date>", "Psy Open Air Wien <date>". goabase listings are
  entered by organisers, so prefer ones that also appear on the organiser's
  or venue's own page. Mark them `daytime_electronic` when they start before
  19:00.

Classify each event as `highlight` only for Arena Wien Open Air and
Rathaus events that aren't family-oriented (see above). Otherwise classify it
as `family` (suitable for parents with children,
including family-friendly daytime concerts), `daytime_electronic` (techno or
electronic music starting before 19:00) or `both`. Skip night-only
club events, and skip concerts and other events that are neither
family-oriented nor electronic (e.g. a jazz matinee for adults).

Rules:

- Only include events you confirmed on a web page for those exact dates.
- Don't guess times, prices or URLs. Use `null` for anything you couldn't
  confirm. Ongoing exhibitions without a specific programme that weekend
  don't count (Christmas markets are the exception, see above).
- `url` must be the event's own listing page, not a search page.
- **Don't trim the list.** Include every matching event that starts before
  19:00, however many there are (sold-out shows too, marked "Sold out" in
  the price). Events starting at 19:00 or later are left out, except
  daytime events that simply run past 19:00.
- Spend as long as the research needs; note any source that failed.

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

`category` is `family`, `daytime_electronic`, `both` or `highlight`. Prices are written
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
