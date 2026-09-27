// Writes a placeholder page: node src/status.mjs searching|failed [--out site]
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { renderStatusPage } from './render.mjs';
import { upcomingWeekend, viennaStamp } from './weekend.mjs';

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { out: { type: 'string', default: 'site' } },
});
const state = positionals[0];
if (state !== 'searching' && state !== 'failed') throw new Error('Usage: status.mjs searching|failed');

const now = new Date();
mkdirSync(args.out, { recursive: true });
writeFileSync(`${args.out}/index.html`, renderStatusPage({ weekend: upcomingWeekend(now), state, updated: viennaStamp(now) }));
console.log(`Wrote ${state} page to ${args.out}/index.html`);
