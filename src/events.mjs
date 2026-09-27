// Checks and ordering applied to the event list before rendering.
//
// Each event in data/events.json looks like:
//   {
//     "title": "Kids' flea market",
//     "date": "2026-10-03",              // YYYY-MM-DD
//     "start_time": "09:00",             // HH:MM, 24-hour, Vienna time
//     "end_time": "14:00",               // or null
//     "venue": "Karmelitermarkt",
//     "district": "2nd district, Leopoldstadt",   // or null
//     "description": "One or two plain sentences.",
//     "category": "family",              // "family" | "daytime_electronic" | "both"
//     "age_range": "All ages",           // or null
//     "price": "Free",                   // e.g. "€12 adults · €6 kids", or null
//     "is_free": true,
//     "url": "https://…"                 // the event's own listing
//   }

const CATEGORIES = new Set(['family', 'daytime_electronic', 'both']);
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
    if (!CATEGORIES.has(ev.category) || !ev.title || !ev.venue) continue;
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
