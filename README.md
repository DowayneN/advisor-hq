# Advisor HQ

A personal operations dashboard I use to run my own ventures day to day: sales pipelines, call tracking, weekly timetable, goals and a daily prep sheet.

## How it works

The interesting part is that there's no backend.

1. `scripts/generate-daily-prep.mjs` runs once a day. It calls the Claude API and asks for fresh sales leads, prospects and content ideas, in a fixed JSON format.
2. The script parses the response, writes it to `public/daily-prep.json` and commits and pushes it to this repo.
3. The dashboard reads that file at runtime, so the data updates without a server or database to host.

A few details that keep it reliable:

- **Idempotent runs.** If today's file already exists, the script exits, so a re-run never doubles up.
- **No repeats.** Every business the model has suggested is stored in `public/seen-leads.json` and passed back as an exclusion list on the next run.
- **Local state.** Pipelines, metrics and progress are saved in the browser with a small `useLocalStorage` hook.

## Private data

Personal tabs (job shortlist, goals) and the content plan live in `src/private/`, which is gitignored here and kept in a separate private repo. `src/privateModules.js` loads whatever is in that folder at build time. In a fresh clone without it, those tabs show an empty state and everything else works.

## Site stats (Umami)

Mission Control shows 30-day traffic for drivingtestswap.uk from Umami Cloud. The browser never talks to Umami: it calls `/api/analytics/summary` and `/api/analytics/realtime` on the Vite server, and `server/analyticsProxy.js` reads the stats through the website's Umami share link (works on the free plan, no API key) and returns only the numbers the panel needs.

Turn on the share URL for the website in Umami, then set its id (the last part of the link) in `.env`. No `VITE_` prefix, so Vite keeps it out of the bundle.

```
UMAMI_SHARE_ID=...
```

The proxy runs under `npm run dev` and `npm run preview`. On a static host there's no server, so the stats panel shows an error instead.

## Stack

React 18, Vite, Tailwind CSS, Node.js, Anthropic SDK.

## Running it

```bash
npm install
npm run dev
```

To generate a daily prep sheet you need an Anthropic API key:

```bash
ANTHROPIC_API_KEY=your-key npm run daily-prep
```
