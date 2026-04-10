/**
 * Daily Prep Generator
 * Generates fresh SME leads, LinkedIn prospects, and content ideas
 * then commits and pushes to GitHub so the dashboard can fetch them.
 *
 * Usage:  node scripts/generate-daily-prep.mjs
 * Env:    ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const OUT_PATH  = join(ROOT, 'public', 'daily-prep.json')

const TODAY   = new Date().toISOString().split('T')[0]
const NOW_HR  = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

const client = new Anthropic()

// ── Prompt ────────────────────────────────────────────────────────────────────

const SYSTEM = `You are a research and sales-prep assistant for Dowayne, who runs three ventures:

1. GIMedia — web design for local SMEs in Southampton (£500–£1,000 sites, primary pitch: "no website = missed Google traffic")
2. CloseCoach — AI sales roleplay SaaS for B2B sales teams (targets: sales directors/managers at SMEs with 3–15 reps; key verticals: estate agency, car dealerships, recruitment, insurance)
3. DTS — Driving Test Swap UK platform (learner driver audience, content/community play)

Your job is to generate a structured daily prep object in JSON with:
- 5 real Southampton-area SME leads for GIMedia cold calling (businesses with no website or a poor one)
- 3 real UK LinkedIn prospects for CloseCoach outreach (sales directors/managers at relevant SMEs)
- 2 content ideas each for DTS, Athletics brand, and AIMyBiz/CloseCoach

All data must be plausible and specific. Use real business names and real LinkedIn profile URLs where you can. For SMEs, focus on trades, salons, restaurants, local services — any category that benefits from local Google traffic.`

const USER = `Generate today's prep data as a valid JSON object. Today is ${TODAY}.

Return ONLY valid JSON — no markdown, no explanation, no code blocks. The JSON must match this exact schema:

{
  "date": "${TODAY}",
  "generated_at": "${NOW_HR}",
  "source": "scheduled_agent",
  "sme_leads": [
    {
      "id": "lead_${TODAY.replace(/-/g, '')}_1",
      "company": "string",
      "industry": "string",
      "website": "string or null",
      "phone": "string",
      "location": "area, Southampton",
      "notes": "string — 1–2 sentences explaining the web gap and opportunity"
    }
    // repeat for leads 2–5
  ],
  "linkedin_prospects": [
    {
      "id": "prospect_${TODAY.replace(/-/g, '')}_1",
      "name": "string",
      "title": "string",
      "company": "string",
      "url": "https://linkedin.com/in/...",
      "reason": "string — 1–2 sentences on why they fit CloseCoach and what triggered the outreach"
    }
    // repeat for prospects 2–3
  ],
  "content_ideas": {
    "dts": [
      {
        "platform": "string (e.g. TikTok / Instagram Reels)",
        "title": "string — hook-first content title",
        "format": "string — 1 sentence describing the format and execution"
      },
      { /* idea 2 */ }
    ],
    "athletics": [ /* 2 ideas, same structure */ ],
    "aimybiz": [ /* 2 ideas, same structure */ ]
  }
}`

// ── Main ──────────────────────────────────────────────────────────────────────

async function generate() {
  console.log(`[daily-prep] Generating for ${TODAY}…`)

  const msg = await client.messages.create({
    model:      'claude-opus-4-6',
    max_tokens: 2048,
    system:     SYSTEM,
    messages:   [{ role: 'user', content: USER }],
  })

  const raw = msg.content[0].text.trim()

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

  let data
  try {
    data = JSON.parse(cleaned)
  } catch (err) {
    console.error('[daily-prep] JSON parse failed:', err.message)
    console.error('[daily-prep] Raw output:', raw.slice(0, 500))
    process.exit(1)
  }

  writeFileSync(OUT_PATH, JSON.stringify(data, null, 2))
  console.log(`[daily-prep] Written to ${OUT_PATH}`)

  // Git commit + push
  try {
    execSync('git add public/daily-prep.json', { cwd: ROOT, stdio: 'inherit' })
    execSync(`git commit -m "chore: daily prep update ${TODAY}"`, { cwd: ROOT, stdio: 'inherit' })
    execSync('git push', { cwd: ROOT, stdio: 'inherit' })
    console.log('[daily-prep] Pushed to GitHub')
  } catch (err) {
    console.error('[daily-prep] Git push failed:', err.message)
    process.exit(1)
  }
}

generate().catch(err => {
  console.error('[daily-prep] Fatal:', err.message)
  process.exit(1)
})
