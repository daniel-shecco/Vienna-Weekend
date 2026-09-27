// Entry point: finds this weekend's events and writes site/index.html.
//   node src/build.mjs                         research with Claude (needs ANTHROPIC_API_KEY)
//   node src/build.mjs --fixture <file.json>   render saved events instead
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { cleanEvents } from './events.mjs';
import { renderPage } from './render.mjs';
import { upcomingWeekend, viennaStamp } from './weekend.mjs';

const { values: args } = parseArgs({ options: { fixture: { type: 'string' }, out: { type: 'string', default: 'site' } } });

const now = new Date();
let weekend = upcomingWeekend(now);
let raw;

if (args.fixture) {
  const fixture = JSON.parse(readFileSync(args.fixture, 'utf8'));
  weekend = fixture.weekend ?? weekend;
  raw = fixture.events;
} else {
  const { findEvents } = await import('./find-events.mjs');
  console.log(`Researching events for ${weekend.saturday} and ${weekend.sunday}…`);
  const result = await findEvents(weekend);
  raw = result.events;
  mkdirSync(args.out, { recursive: true });
  writeFileSync(`${args.out}/research-notes.md`, result.notes);
}

const events = cleanEvents(raw, weekend);
console.log(`Kept ${events.length} of ${raw.length} events.`);
if (!args.fixture && events.length === 0) {
  throw new Error('No usable events found; not publishing an empty page.');
}

mkdirSync(args.out, { recursive: true });
writeFileSync(`${args.out}/index.html`, renderPage({ weekend, events, updated: viennaStamp(now) }));
writeFileSync(`${args.out}/events.json`, JSON.stringify({ weekend, generated_at: now.toISOString(), events }, null, 2));
console.log(`Wrote ${args.out}/index.html`);
