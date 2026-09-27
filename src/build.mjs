// Renders data/events.json into site/index.html (+ site/events.json).
//   node src/build.mjs [data/events.json] [--out site]
//
// The data file is written by the weekly Claude Code routine (see ROUTINE.md):
//   { "weekend": { "saturday": "YYYY-MM-DD", "sunday": "YYYY-MM-DD" },
//     "status": "searching" | "failed" | "done",
//     "updated": "Fri 2 Oct, 07:00",
//     "events": [ ... ] }
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { cleanEvents } from './events.mjs';
import { renderPage, renderStatusPage } from './render.mjs';
import { viennaStamp } from './weekend.mjs';

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { out: { type: 'string', default: 'site' } },
});
const file = positionals[0] ?? 'data/events.json';
const data = JSON.parse(readFileSync(file, 'utf8'));
const { weekend } = data;
const updated = data.updated ?? viennaStamp();

mkdirSync(args.out, { recursive: true });

if (data.status === 'searching' || data.status === 'failed') {
  writeFileSync(`${args.out}/index.html`, renderStatusPage({ weekend, state: data.status, updated }));
  console.log(`Wrote ${data.status} page to ${args.out}/index.html`);
} else {
  const events = cleanEvents(data.events ?? [], weekend);
  console.log(`Kept ${events.length} of ${(data.events ?? []).length} events.`);
  writeFileSync(`${args.out}/index.html`, renderPage({ weekend, events, updated }));
  writeFileSync(`${args.out}/events.json`, JSON.stringify({ weekend, updated, events }, null, 2));
  console.log(`Wrote ${args.out}/index.html`);
}
