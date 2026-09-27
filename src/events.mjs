// Shape of an event, plus the checks and ordering applied before rendering.
import { z } from 'zod';

export const EventSchema = z.object({
  title: z.string(),
  date: z.string().describe('YYYY-MM-DD'),
  start_time: z.string().describe('HH:MM, 24-hour, Vienna time'),
  end_time: z.string().nullable().describe('HH:MM, 24-hour, or null if unknown'),
  venue: z.string(),
  district: z.string().nullable().describe('e.g. "2nd district, Leopoldstadt"'),
  description: z.string().describe('One or two plain sentences'),
  category: z.enum(['family', 'daytime_electronic', 'both']),
  age_range: z.string().nullable().describe('e.g. "Ages 4+", "All ages", "18+"'),
  price: z.string().nullable().describe('e.g. "€12 adults · €6 kids", "Free", or null if unknown'),
  is_free: z.boolean(),
  url: z.string().describe('Link to the original event listing'),
});

export const EventListSchema = z.object({ events: z.array(EventSchema) });

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Keeps only well-formed events inside the weekend, drops duplicates,
 * and sorts by date then start time.
 */
export function cleanEvents(events, { saturday, sunday }) {
  const seen = new Set();
  const kept = [];
  for (const ev of events) {
    if (ev.date !== saturday && ev.date !== sunday) continue;
    if (!TIME.test(ev.start_time)) continue;
    if (ev.end_time && !TIME.test(ev.end_time)) ev.end_time = null;
    let url;
    try {
      url = new URL(ev.url);
    } catch {
      continue;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
    const key = `${ev.date}|${ev.start_time}|${ev.title.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(ev);
  }
  return kept.sort(
    (a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time) || a.title.localeCompare(b.title),
  );
}
