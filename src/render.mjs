// Renders the event list into a standalone HTML page.
import { readFileSync } from 'node:fs';
import { dayLabels, weekendRangeLabel } from './weekend.mjs';

const CSS = readFileSync(new URL('./page.css', import.meta.url), 'utf8');
const JS = readFileSync(new URL('./page.js', import.meta.url), 'utf8');

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function cats(ev) {
  const c = [];
  if (ev.category === 'family' || ev.category === 'both') c.push('family');
  if (ev.category === 'daytime_electronic' || ev.category === 'both') c.push('beats');
  if (ev.is_free) c.push('free');
  return c;
}

function eventHtml(ev) {
  const c = cats(ev);
  const tags = [
    c.includes('beats') ? '<span class="tag beats">Daytime electronic</span>' : '',
    c.includes('family') ? '<span class="tag family">Family</span>' : '',
    ev.age_range ? `<span class="tag age">${esc(ev.age_range)}</span>` : '',
    ev.is_free
      ? '<span class="price free">Free</span>'
      : ev.price
        ? `<span class="price">${esc(ev.price)}</span>`
        : '',
  ].join('');
  const where = [ev.venue, ev.district].filter(Boolean).map(esc).join(' · ');
  return `        <li class="event" data-cats="${c.join(' ')}">
          <div class="time"><div class="start">${esc(ev.start_time)}</div>${ev.end_time ? `<div class="end">until ${esc(ev.end_time)}</div>` : ''}</div>
          <div>
            <h3>${esc(ev.title)}</h3>
            <p class="venue">${where}</p>
            <p class="desc">${esc(ev.description)}</p>
            <div class="row">${tags}<a class="link" href="${esc(ev.url)}" target="_blank" rel="noopener">Event page →</a></div>
          </div>
        </li>`;
}

function daySection(isoDate, events) {
  const { weekday, date } = dayLabels(isoDate);
  const id = weekday.toLowerCase();
  const body = events.length
    ? `      <ol class="events">\n${events.map(eventHtml).join('\n')}\n      </ol>`
    : '      <p class="empty">No events found for this day.</p>';
  return `    <section class="day" aria-labelledby="${id}">
      <div class="day-head">
        <h2 id="${id}">${weekday}</h2><span class="date">${date}</span><span class="count">${plural(events.length, 'event')}</span>
      </div>
${body}
    </section>`;
}

function sourceDomains(events) {
  const hosts = new Set(events.map((ev) => new URL(ev.url).hostname.replace(/^www\./, '')));
  return [...hosts].sort();
}

export function renderPage({ weekend, events, updated }) {
  const count = (cat) => events.filter((ev) => cats(ev).includes(cat)).length;
  const chip = (filter, label, n, pressed = false) =>
    `<button class="chip" data-filter="${filter}" aria-pressed="${pressed}">${label} <span class="n">${n}</span></button>`;
  const range = weekendRangeLabel(weekend);
  const sources = sourceDomains(events);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vienna Weekend Guide</title>
<meta name="description" content="Family-friendly events and daytime electronic parties in Vienna, ${esc(range)}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${CSS}</style>
</head>
<body>

<header class="hero">
  <div class="wrap">
    <span class="kicker">Vienna Weekend Guide</span>
    <h1>This weekend in Vienna</h1>
    <p class="sub">Family-friendly things to do, plus daytime techno and electronic parties. Sorted by day and start time.</p>
    <div class="meta">
      <span><strong>${esc(range)}</strong></span>
      <span>${plural(events.length, 'event')}</span>
      <span>Updated ${esc(updated)}</span>
    </div>
  </div>
</header>

<div class="wrap">
  <nav class="filters" aria-label="Filter events">
    ${chip('all', 'All', events.length, true)}
    ${chip('family', 'Family', count('family'))}
    ${chip('beats', 'Daytime electronic', count('beats'))}
    ${chip('free', 'Free', count('free'))}
  </nav>

  <main>
${daySection(weekend.saturday, events.filter((ev) => ev.date === weekend.saturday))}

${daySection(weekend.sunday, events.filter((ev) => ev.date === weekend.sunday))}
  </main>

  <footer>
    <p>Generated automatically every Friday morning (Vienna time) by researching event listings on the web. Prices and times can change, so check the event page before you go.</p>
${sources.length ? `    <p>Sources: ${sources.map(esc).join(' · ')}</p>\n` : ''}  </footer>
</div>

<script>
${JS}</script>
</body>
</html>
`;
}
