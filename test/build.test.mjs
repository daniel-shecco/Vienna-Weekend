import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cleanEvents } from '../src/events.mjs';
import { renderPage } from '../src/render.mjs';
import { upcomingWeekend } from '../src/weekend.mjs';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/sample-events.json', import.meta.url), 'utf8'));

test('upcomingWeekend picks the Saturday and Sunday after a Friday run', () => {
  // Friday 2 Oct 2026, 07:00 Vienna (05:00 UTC, summer time)
  assert.deepEqual(upcomingWeekend(new Date('2026-10-02T05:00:00Z')), { saturday: '2026-10-03', sunday: '2026-10-04' });
  // Friday 4 Dec 2026, 07:00 Vienna (06:00 UTC, winter time)
  assert.deepEqual(upcomingWeekend(new Date('2026-12-04T06:00:00Z')), { saturday: '2026-12-05', sunday: '2026-12-06' });
  // Late Friday UTC is already Saturday in Vienna
  assert.deepEqual(upcomingWeekend(new Date('2026-10-02T23:30:00Z')), { saturday: '2026-10-03', sunday: '2026-10-04' });
  // Run on a Saturday covers that weekend; run on a Sunday looks ahead to the next one
  assert.deepEqual(upcomingWeekend(new Date('2026-10-03T10:00:00Z')), { saturday: '2026-10-03', sunday: '2026-10-04' });
  assert.deepEqual(upcomingWeekend(new Date('2026-09-27T16:40:00Z')), { saturday: '2026-10-03', sunday: '2026-10-04' });
});

test('cleanEvents drops out-of-range, unlinked and duplicate events, and sorts by date and time', () => {
  const events = cleanEvents(structuredClone(fixture.events), fixture.weekend);
  assert.equal(events.length, 8);
  const order = events.map((e) => `${e.date} ${e.start_time}`);
  assert.deepEqual(order, [...order].sort());
  assert.ok(!events.some((e) => e.title === 'Monday event' || e.title === 'No link'));
});

test('renderPage escapes content and links each event', () => {
  const events = cleanEvents(structuredClone(fixture.events), fixture.weekend);
  events[0].title = '<script>alert(1)</script>';
  const html = renderPage({ weekend: fixture.weekend, events, updated: 'Fri 2 Oct, 07:00' });
  assert.ok(!html.includes('<script>alert(1)'));
  assert.equal((html.match(/class="link"/g) ?? []).length, events.length);
  assert.ok(html.includes('Sat 3 – Sun 4 October 2026'));
});

test('renderStatusPage shows a self-refreshing searching page and a static failure page', async () => {
  const { renderStatusPage } = await import('../src/render.mjs');
  const searching = renderStatusPage({ weekend: fixture.weekend, state: 'searching', updated: 'Fri 2 Oct, 07:00' });
  assert.ok(searching.includes('http-equiv="refresh"'));
  assert.ok(searching.includes('Searching for this weekend'));
  const failed = renderStatusPage({ weekend: fixture.weekend, state: 'failed', updated: 'Fri 2 Oct, 07:20' });
  assert.ok(!failed.includes('http-equiv="refresh"'));
  assert.ok(failed.includes('didn’t finish'));
});
