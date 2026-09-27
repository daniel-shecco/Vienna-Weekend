// Asks Claude to research the weekend's events on the web, then turns the
// findings into structured data. Every call is costed, and the run stops
// searching before it could go over MAX_COST_USD.
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { EventListSchema } from './events.mjs';
import { dayLabels } from './weekend.mjs';

const MODEL = 'claude-sonnet-5';

// Claude Sonnet 5 list prices, in USD.
const PRICE = {
  input: 2 / 1e6,
  output: 10 / 1e6,
  cacheWrite: 2.5 / 1e6,
  cacheRead: 0.2 / 1e6,
  search: 10 / 1000,
};

const BUDGET_USD = Number(process.env.MAX_COST_USD || 0.35);
// Upper estimates used to decide whether another call still fits the budget.
// The per-query estimate is raised to the most expensive query seen so far.
const QUERY_ESTIMATE_USD = 0.12;
const EXTRACT_RESERVE_USD = 0.06;

// Per query: up to 2 searches and 1 page read, with the page trimmed to 6k tokens.
const SEARCHES_PER_QUERY = 2;
const FETCHES_PER_QUERY = 1;
const FETCH_MAX_TOKENS = 6000;

function queries({ saturday, sunday }) {
  const sat = dayLabels(saturday);
  const sun = dayLabels(sunday);
  const de = (iso) => {
    const d = new Date(`${iso}T12:00:00Z`);
    return `${d.getUTCDate()}. ${d.toLocaleDateString('de-AT', { month: 'long', timeZone: 'UTC' })}`;
  };
  const year = saturday.slice(0, 4);
  const family = 'family-oriented events: things parents can do with children';
  const beats = 'techno or electronic music parties that start before about 18:00 (day raves, open-air afternoon sessions, family raves)';
  // Ordered by value: if the budget runs out, the later ones are skipped.
  return [
    { kind: family, q: `Wien Kinder Veranstaltungen Wochenende ${de(saturday)} ${de(sunday)} ${year}` },
    { kind: beats, q: `Day Rave Techno tagsüber Wien ${de(saturday)} ${de(sunday)} ${year}` },
    { kind: family, q: `Kindertheater Familienprogramm Museum Wien ${de(saturday)} ${year}` },
    { kind: family, q: `Vienna family events weekend ${sat.date} ${sun.date} ${year}` },
  ];
}

function searchPrompt({ saturday, sunday }, { kind, q }) {
  return `Use web search to find ${kind} in Vienna, Austria on Saturday ${saturday} or Sunday ${sunday}.

Start with this search: ${q}
You may do one more search, and read one listing page (for example an event calendar) to confirm dates, times and prices.

List every matching event you found. For each, give: title, date, start time (and end time if listed), venue and district, one sentence on what it is, age range if stated, ticket prices (adult and child if they differ) or that it's free, and the URL of the event's own listing.

Only include events the search results show taking place on ${saturday} or ${sunday}. Don't guess times, prices or URLs; leave out details you couldn't find. If you found nothing, reply "none".`;
}

function costOf(usage) {
  return (
    usage.input_tokens * PRICE.input +
    usage.output_tokens * PRICE.output +
    (usage.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite +
    (usage.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
    (usage.server_tool_use?.web_search_requests ?? 0) * PRICE.search
  );
}

function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

function assertNotRefused(message, step) {
  if (message.stop_reason === 'refusal') {
    const cat = message.stop_details?.category ?? 'unknown';
    throw new Error(`${step}: the model declined the request (category: ${cat})`);
  }
}

/** Runs the searches one by one while they fit the budget; returns the notes. */
async function research(client, weekend, ledger) {
  const notes = [];
  let queryEstimate = QUERY_ESTIMATE_USD;
  for (const query of queries(weekend)) {
    if (ledger.spent + queryEstimate + EXTRACT_RESERVE_USD > BUDGET_USD) {
      console.log(`Stopping searches at $${ledger.spent.toFixed(3)} to stay under $${BUDGET_USD}.`);
      break;
    }
    // max_tokens bounds output (incl. thinking); a paused turn is not resumed,
    // so each query's cost stays bounded.
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      output_config: { effort: 'low' },
      tools: [
        {
          type: 'web_search_20260209',
          name: 'web_search',
          max_uses: SEARCHES_PER_QUERY,
          user_location: { type: 'approximate', city: 'Vienna', country: 'AT', timezone: 'Europe/Vienna' },
        },
        { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: FETCHES_PER_QUERY, max_content_tokens: FETCH_MAX_TOKENS },
      ],
      messages: [{ role: 'user', content: searchPrompt(weekend, query) }],
    });
    const cost = costOf(message.usage);
    ledger.add(`search: ${query.q}`, cost);
    queryEstimate = Math.max(queryEstimate, cost);
    assertNotRefused(message, 'Search');
    const text = textOf(message);
    if (text && text.toLowerCase() !== 'none') notes.push(`## ${query.q}\n\n${text}`);
  }
  return notes.join('\n\n');
}

/** Turns the research notes into the event list schema. */
async function extract(client, notes, { saturday, sunday }, ledger) {
  const message = await client.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: 'low', format: zodOutputFormat(EventListSchema) },
    messages: [
      {
        role: 'user',
        content: `Convert these research notes about Vienna events into the requested JSON structure.

Rules:
- Only include events dated ${saturday} or ${sunday}.
- The same event may appear in several sections; include it once.
- Times are 24-hour HH:MM in Vienna time. If an event runs all day, use its opening time.
- Keep prices as written, formatted like "€12 adults · €6 kids". Use "Free" for free events and set is_free accordingly. Use null if the notes give no price.
- Use the event's own listing URL from the notes. Leave out any event that has no URL.
- Don't invent details that aren't in the notes.

<notes>
${notes}
</notes>`,
      },
    ],
  });
  ledger.add('extract', costOf(message.usage));
  assertNotRefused(message, 'Extraction');
  if (!message.parsed_output) throw new Error(`Extraction returned no parseable output (stop_reason: ${message.stop_reason})`);
  return message.parsed_output.events;
}

export async function findEvents(weekend) {
  // Keys that aren't scoped to a workspace need the workspace named on each request.
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic(workspace ? { defaultHeaders: { 'anthropic-workspace-id': workspace } } : {});

  const ledger = {
    spent: 0,
    lines: [],
    add(label, usd) {
      this.spent += usd;
      this.lines.push({ label, usd });
      console.log(`$${usd.toFixed(4)}  ${label}  (total $${this.spent.toFixed(4)})`);
    },
  };

  const notes = await research(client, weekend, ledger);
  if (!notes) return { notes: '', events: [], cost: ledger };
  const events = await extract(client, notes, weekend, ledger);
  return { notes, events, cost: ledger };
}
