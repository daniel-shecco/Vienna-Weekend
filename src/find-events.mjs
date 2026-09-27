// Asks Claude to research the weekend's events on the web, then turns the
// findings into structured data.
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { EventListSchema } from './events.mjs';
import { dayLabels } from './weekend.mjs';

const MODEL = 'claude-opus-5';
// On a policy decline, the API re-runs the request on Anthropic's recommended fallback model.
const FALLBACK = { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' };
const MAX_CONTINUATIONS = 8;

function researchPrompt({ saturday, sunday }) {
  const sat = dayLabels(saturday);
  const sun = dayLabels(sunday);
  return `Find events in Vienna, Austria for the weekend of Saturday ${sat.date} (${saturday}) and Sunday ${sun.date} (${sunday}).

I'm building a weekend guide for a family. Include two kinds of events:

1. Family-oriented events: things parents can do with children. For example kids' theatre and puppet shows, museum family programmes and workshops, zoo or aquarium activities, markets, festivals, outdoor activities, children's concerts, and seasonal events.
2. Techno or electronic music parties that happen during the daytime, meaning they start before about 18:00. Day raves, open-air afternoon sessions and family raves all count. Skip night-only club events.

Search widely. Good places to look include wien.info, events.wien.gv.at, the city's family pages, Falter, Resident Advisor, venue and museum websites (ZOOM Kindermuseum, Dschungel Wien, Tiergarten Schönbrunn, Haus des Meeres, Naturhistorisches Museum, Technisches Museum, MuseumsQuartier), and Viennese party listings. Search in both German and English.

For each event, record:
- title, date and start time (and end time if listed)
- venue and district
- a one or two sentence description
- which kind it is (family, daytime electronic, or both)
- age range if stated
- ticket prices (adult and child prices if they differ), or that it is free
- the URL of the event's own listing page, not a search results page

Only include events you actually found on a web page and that really take place on ${saturday} or ${sunday}. Don't guess times, prices or URLs; leave a detail out if you couldn't confirm it. Ongoing exhibitions without a specific programme that weekend don't count. Aim for about 15 to 30 events across both days.

Finish with the complete list of events and their details.`;
}

function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

function assertNotRefused(message, step) {
  if (message.stop_reason === 'refusal') {
    const cat = message.stop_details?.category ?? 'unknown';
    throw new Error(`${step}: the model declined the request (category: ${cat})`);
  }
}

/** Runs the web research and returns Claude's written findings. */
async function research(client, weekend) {
  const messages = [{ role: 'user', content: researchPrompt(weekend) }];
  const tools = [
    { type: 'web_search_20260209', name: 'web_search', max_uses: 30, user_location: { type: 'approximate', city: 'Vienna', country: 'AT', timezone: 'Europe/Vienna' } },
    { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 30 },
  ];

  for (let i = 0; ; i++) {
    const message = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 64000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        tools,
        messages,
        ...FALLBACK,
      })
      .finalMessage();

    assertNotRefused(message, 'Research');
    // The server pauses long web-tool loops; send the turn back to resume it.
    if (message.stop_reason === 'pause_turn' && i < MAX_CONTINUATIONS) {
      messages.push({ role: 'assistant', content: message.content });
      continue;
    }
    const text = textOf(message);
    if (!text) throw new Error(`Research returned no text (stop_reason: ${message.stop_reason})`);
    return text;
  }
}

/** Turns the research notes into the event list schema. */
async function extract(client, notes, { saturday, sunday }) {
  const message = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 32000,
    output_config: { effort: 'low', format: betaZodOutputFormat(EventListSchema) },
    messages: [
      {
        role: 'user',
        content: `Convert these research notes about Vienna events into the requested JSON structure.

Rules:
- Only include events dated ${saturday} or ${sunday}.
- Times are 24-hour HH:MM in Vienna time. If an event runs all day, use its opening time.
- Keep prices as written, formatted like "€12 adults · €6 kids". Use "Free" for free events and set is_free accordingly. Use null if the notes give no price.
- Use the event's own listing URL from the notes. Leave out any event that has no URL.
- Don't invent details that aren't in the notes.

<notes>
${notes}
</notes>`,
      },
    ],
    ...FALLBACK,
  });

  assertNotRefused(message, 'Extraction');
  if (!message.parsed_output) throw new Error(`Extraction returned no parseable output (stop_reason: ${message.stop_reason})`);
  return message.parsed_output.events;
}

export async function findEvents(weekend) {
  const client = new Anthropic();
  const notes = await research(client, weekend);
  const events = await extract(client, notes, weekend);
  return { notes, events };
}
