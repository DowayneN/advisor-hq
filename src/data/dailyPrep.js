export const EMPTY_PREP = {
  date: null,
  generated_at: null,
  source: 'empty',
  sme_leads: [],
  linkedin_prospects: [],
  content_ideas: { dts: [], athletics: [], aimybiz: [] },
}

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/DowayneN/advisor-hq/main/public/daily-prep.json'

export async function fetchDailyPrep() {
  // Try GitHub first — written by the 7am scheduled agent
  try {
    const res = await fetch(GITHUB_RAW_URL + '?t=' + Date.now())
    if (res.ok) return await res.json()
  } catch {}
  // Fall back to local seed data during development
  try {
    const res = await fetch('/daily-prep.json?t=' + Date.now())
    if (res.ok) return await res.json()
  } catch {}
  return EMPTY_PREP
}

export const OUTCOME_CONFIG = {
  interested:  { label: 'Interested',  xp: 25, color: 'var(--color-success)',  dim: 'rgba(74,124,89,0.15)' },
  follow_up:   { label: 'Follow Up',   xp: 15, color: 'var(--color-accent)',   dim: 'var(--color-accent-dim)' },
  not_now:     { label: 'Not Now',     xp: 10, color: 'var(--color-text-muted)', dim: 'var(--color-surface-3)' },
  no_answer:   { label: 'No Answer',   xp: 5,  color: 'var(--color-text-faint)', dim: 'var(--color-surface-2)' },
}
