// Works out which weekend a run is for, in Vienna time.

const TZ = 'Europe/Vienna';

/** Today's date in Vienna as YYYY-MM-DD. */
export function viennaToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now);
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * The Saturday and Sunday this run covers: the coming weekend, or the
 * current one when run on a Saturday or Sunday.
 */
export function upcomingWeekend(now = new Date()) {
  const today = viennaToday(now);
  const dow = new Date(`${today}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  const saturday = dow === 0 ? addDays(today, -1) : addDays(today, (6 - dow + 7) % 7);
  return { saturday, sunday: addDays(saturday, 1) };
}

/** e.g. "Saturday", "3 October" for an ISO date. */
export function dayLabels(isoDate) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return {
    weekday: d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }),
    date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }),
  };
}

/** e.g. "Sat 3 – Sun 4 October 2026" (month shown twice if the weekend spans two). */
export function weekendRangeLabel({ saturday, sunday }) {
  const parts = (iso) => {
    const d = new Date(`${iso}T12:00:00Z`);
    const get = (opts) => d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });
    return { wd: get({ weekday: 'short' }), day: get({ day: 'numeric' }), month: get({ month: 'long' }), year: get({ year: 'numeric' }) };
  };
  const a = parts(saturday);
  const b = parts(sunday);
  const start = a.month === b.month ? `${a.wd} ${a.day}` : `${a.wd} ${a.day} ${a.month}`;
  return `${start} – ${b.wd} ${b.day} ${b.month} ${b.year}`;
}

/** e.g. "Fri 2 Oct, 07:00" in Vienna time. */
export function viennaStamp(now = new Date()) {
  const date = now.toLocaleDateString('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time}`;
}
