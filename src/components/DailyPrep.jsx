import { useState, useEffect } from 'react'
import {
  ChevronDown, ChevronUp,
  Phone, FileText, Globe,
  ThumbsUp, RotateCcw, XCircle, PhoneMissed,
  MessageSquare, Edit3, RotateCw,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchDailyPrep, OUTCOME_CONFIG } from '../data/dailyPrep'

const OUTCOME_ICONS = {
  interested: ThumbsUp,
  follow_up:  RotateCcw,
  not_now:    XCircle,
  no_answer:  PhoneMissed,
}

const VENTURE_LABELS = { dts: 'DTS', athletics: 'Athletics', aimybiz: 'AIMyBiz' }
const VENTURE_COLORS = {
  dts:       { color: 'var(--venture-dts)',      dim: 'var(--venture-dts-dim)' },
  athletics: { color: 'var(--venture-athletics)', dim: 'var(--venture-athletics-dim)' },
  aimybiz:   { color: 'var(--venture-aimybiz)',   dim: 'var(--venture-aimybiz-dim)' },
}

const noteInputStyle = {
  width: '100%',
  background: 'var(--layer-3)',
  border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-md)',
  padding: '6px 10px',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-xs)',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function generateCallScript(lead) {
  const hasFacebook = lead.notes?.toLowerCase().includes('facebook')
  const noWebsite   = !lead.website
  const industry    = lead.industry?.toLowerCase() || 'business'
  const company     = lead.company || 'your business'

  // How they're finding customers now — contextual opener
  const discoveryContext = hasFacebook
    ? `And how are most new customers finding you right now — is it mainly Facebook, word of mouth, walk-ins?`
    : `And how are most new customers finding you right now — is it mainly word of mouth, walk-ins, Google, social media?`

  // Seed if they go quiet on the magic wand question
  const seedLine = noWebsite
    ? `Some ${industry}s we have spoken to have mentioned things like wanting to show up when someone Googles "${industry} near me", or having somewhere to send people that looks professional when they ask for details. Does any of that sound like something useful?`
    : `Some ${industry}s we have spoken to have said they want their site to actually bring in new customers rather than just sit there, or they want online booking so the phone is not ringing all day. Does any of that sound familiar?`

  // Natural offer — flows from what they just said, no confession needed
  const offerLine = noWebsite
    ? `Based on what you have described — that is actually something I help with. I build websites for local ${industry}s in Southampton. Straightforward, affordable, and built around what the business actually needs rather than a generic template.`
    : `Based on what you have just said — that is something I help with. I build and refresh websites for local ${industry}s in Southampton. Built around getting you more of the right customers, not just a site that looks nice and does nothing.`

  return [
    '━━━ OPENING ━━━',
    '',
    'Hey, is that [Name]?',
    '',
    `Hi [Name] — my name is Dowayne, I run a small local business in Southampton called AIMyBiz. We are doing some quick research into how ${industry}s in the area are using digital tools — websites, online booking, that kind of thing. Have you got two minutes?`,
    '',
    '[ Wait for yes. Most people say yes — you are asking for their opinion, not their money. ]',
    '',
    '━━━ DISCOVER — let them talk ━━━',
    '',
    `Great, thank you. So to start — does ${company} have a website at the moment, or is it more social media and word of mouth?`,
    '',
    '[ Listen fully. Whatever they say, follow with: ]',
    '',
    discoveryContext,
    '',
    '[ Listen again — this is the most valuable part. The answer tells you exactly what to offer. ]',
    '',
    'And if you could add one thing online that would make the business easier to run, or bring in more customers — what would it be? Even if it sounds obvious.',
    '',
    '[ If they go quiet or say "not sure": ]',
    '',
    seedLine,
    '',
    '[ Wait. Let them respond. They will usually land on something. That is your cue. ]',
    '',
    '━━━ NATURAL PIVOT ━━━',
    '',
    'That is really useful, thank you — this is exactly what we are trying to understand.',
    '',
    offerLine,
    '',
    `Would it be useful if I put together a quick example of what that could look like for ${company}? Just so you have something concrete to look at — no commitment, you can tell me honestly if it is relevant.`,
    '',
    '[ If yes: ] "Brilliant — what is the best number or email to send that to?"',
    '[ If unsure: ] "What if I just sent one example — you can decide from there whether it is worth a chat or not."',
    '[ If not now: ] "No problem at all — can I ask, is it more the timing, or just not something that feels relevant right now?"',
    '',
    '━━━ CLOSE ━━━',
    '',
    `I will put something together for ${company} and get it over to you within 48 hours. If it is useful, we can have a proper conversation about it. If not, no problem at all.`,
    '',
    'What is the best way to reach you?',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '  OBJECTION HANDLERS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '❝ We\'re too busy right now ❞',
    '→ "Completely understand — that is actually a good sign. Would it be alright if I sent something over so you can look at it when things calm down? Takes two seconds to forward to the right person."',
    '',
    '❝ We get enough customers already ❞',
    '→ "That is great to hear — honestly. I am not trying to fix a problem if there is not one. I am just curious — is that mainly word of mouth, or are people finding you on Google too?"',
    '   [ If just word of mouth: ] "The only thing I would flag is what happens when those referrals slow down — a site means you are pulling in people who have never heard of you. Worth having as a safety net at least."',
    '',
    '❝ We already have someone doing our social media ❞',
    `→ "That is good — social is great for keeping existing customers warm. A website does something different though — it catches the people actively searching for a ${industry} right now, who have never come across ${company} before. Those two things work together rather than replacing each other."`,
    '',
    '❝ We had a website before and it didn\'t work ❞',
    '→ "Can I ask what happened with it? Most of the time when I hear that, it is because it was not set up to show up on Google — which means no one ever found it. That is fixable, and it is actually the main thing I focus on. Would it be worth seeing what that looks like?"',
    '',
    '❝ How much does it cost? ❞',
    '→ "Honestly I would rather show you what it could look like first — then we can talk about that. I do not want to give you a number before you have seen anything concrete. If it looks right for the business, the price conversation is usually pretty quick."',
    '',
    '❝ I\'m not the right person / you need to speak to my partner ❞',
    '→ "No problem at all — who would be the best person to send something to? I will put together a quick visual so they can see exactly what I am talking about rather than having to explain it second-hand."',
    '',
    '❝ Just send me a leaflet / email ❞',
    `→ "Of course — what is the best email? I will put together something specific to ${company} rather than a generic one, so it is actually worth looking at."`,
    '',
    '❝ I\'m not interested ❞',
    '→ "No worries at all — appreciate you taking the time. Can I just ask, is it more that the timing is not right, or is it genuinely just not something that feels relevant for the business?"',
    '   [ If timing: ] "Totally fine — would it be alright to try you again in a few weeks?"',
    '   [ If not relevant: ] "Fair enough — out of curiosity, how do most of your new customers find you at the moment?"',
    '   [ This keeps the conversation going and often reverses the objection naturally. ]',
  ].join('\n')
}

function generateLinkedInMessage(prospect) {
  const firstName = prospect.name?.split(' ')[0] || 'there'
  const company   = prospect.company || 'your team'
  const reason    = prospect.reason || ''

  const openLine = reason
    ? reason.split('.')[0] + '.'
    : 'I came across your profile and the work you are doing at ' + company + ' stood out.'

  return [
    'Hi ' + firstName + ',',
    '',
    openLine,
    '',
    'Quick question - when a new rep joins ' + company + ', how long before they are genuinely confident handling objections on their own?',
    '',
    'Most sales managers I speak to say 3-4 months. The ones using AI roleplay are cutting that in half - reps practice real conversations before they ever get on a live call.',
    '',
    "That is what I built CloseCoach to do. It is not a course or a script library - it simulates actual customer pushback so your team can fail safely, learn fast, and close better.",
    '',
    'Not sure if the timing is right for ' + company + ' - but if you are open to it, I would rather show you 15 minutes of it working than try to explain it.',
    '',
    'Worth a look?',
    '',
    'Dowayne',
  ].join('\n')
}

function CopyableScript({ text, isAgentGenerated, isCustom, onEditStart, editMode, draft, onDraftChange, onSave, onCancel, onReset }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(editMode ? draft : text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const label = isAgentGenerated ? '✦ Agent' : isCustom ? '✎ Custom' : '◇ Template'
  const labelColor = isCustom ? 'var(--accent-gold)' : 'var(--text-tertiary)'

  return (
    <div
      style={{
        marginTop: 'var(--space-2)',
        background: 'var(--layer-2)',
        border: `1px solid ${editMode ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
      className="animate-in"
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '6px 10px', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span style={{ fontSize: '10px', color: labelColor, fontWeight: isCustom ? 600 : 400 }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <button
                onClick={onReset}
                title="Reset to template"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontFamily: 'inherit' }}
              >
                <RotateCw size={10} strokeWidth={2} /> Reset
              </button>
              <button
                onClick={onCancel}
                style={{ background: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', fontSize: '10px', color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                style={{ background: 'var(--accent-gold)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '2px 8px', fontSize: '10px', color: 'var(--layer-0)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditStart}
                title="Edit script"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                <Edit3 size={12} strokeWidth={1.75} />
              </button>
              <button
                onClick={copy}
                style={{
                  background: copied ? 'rgba(52,211,153,0.12)' : 'transparent',
                  border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-sm)', padding: '2px 8px', fontSize: '10px',
                  color: copied ? 'var(--success)' : 'var(--text-tertiary)',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Script content or edit textarea */}
      {editMode ? (
        <textarea
          value={draft}
          onChange={e => onDraftChange(e.target.value)}
          style={{
            display: 'block', width: '100%', boxSizing: 'border-box',
            margin: 0, padding: '10px',
            fontSize: '11px', color: 'var(--text-primary)',
            lineHeight: 1.7, fontFamily: 'inherit',
            background: 'transparent', border: 'none', outline: 'none',
            resize: 'vertical', minHeight: '240px',
          }}
          autoFocus
        />
      ) : (
        <pre
          style={{
            margin: 0, padding: '10px', fontSize: '11px',
            color: 'var(--text-secondary)', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', fontFamily: 'inherit',
            maxHeight: '260px', overflowY: 'auto',
          }}
        >
          {text}
        </pre>
      )}
    </div>
  )
}

export default function DailyPrep({ onXpEarned, onCallLogged }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leads')
  const [smePipeline, setSmePipeline] = useLocalStorage('advisor_sme_pipeline', {})
  const [messaged, setMessaged]       = useLocalStorage(`advisor_messaged_${todayKey()}`, {})
  const [usedIdeas, setUsedIdeas]     = useLocalStorage(`advisor_ideas_${todayKey()}`, {})
  const [copiedId, setCopiedId]         = useState(null)
  const [collapsed, setCollapsed]       = useLocalStorage('advisor_prep_collapsed', false)
  const [openScript, setOpenScript]     = useState(null)
  const [pendingNote, setPendingNote]   = useState(null) // { leadId, outcomeKey }
  const [noteForm, setNoteForm]         = useState({ contactName: '', callNotes: '' })
  const [customScripts, setCustomScripts] = useLocalStorage('advisor_custom_scripts', {})
  const [editingScript, setEditingScript] = useState(null)   // leadId currently being edited
  const [scriptDraft, setScriptDraft]     = useState('')

  useEffect(() => {
    fetchDailyPrep().then(data => {
      setPrep(data)
      setLoading(false)
    })
  }, [])

  function copyPhone(lead) {
    navigator.clipboard.writeText(lead.phone).catch(() => {})
    setCopiedId(lead.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function startEditScript(lead) {
    const baseText = lead.call_script || generateCallScript(lead)
    setScriptDraft(customScripts[lead.id] ?? baseText)
    setEditingScript(lead.id)
  }

  function saveScript(lead) {
    setCustomScripts(prev => ({ ...prev, [lead.id]: scriptDraft }))
    setEditingScript(null)
  }

  function cancelEditScript() {
    setEditingScript(null)
    setScriptDraft('')
  }

  function resetScript(lead) {
    const baseText = lead.call_script || generateCallScript(lead)
    setScriptDraft(baseText)
    setCustomScripts(prev => { const next = { ...prev }; delete next[lead.id]; return next })
  }

  function startLogOutcome(lead, outcomeKey) {
    const existing = smePipeline[lead.id]
    setPendingNote({ leadId: lead.id, outcomeKey })
    setNoteForm({ contactName: existing?.contactName || '', callNotes: '' })
  }

  function confirmLogOutcome(lead) {
    const cfg = OUTCOME_CONFIG[pendingNote.outcomeKey]
    const now = new Date().toISOString()
    const initialNotes = noteForm.callNotes.trim()
      ? [{ id: `note_${Date.now()}`, text: noteForm.callNotes.trim(), createdAt: now, updatedAt: now }]
      : []
    const entry = {
      id: lead.id,
      company: lead.company,
      industry: lead.industry,
      phone: lead.phone,
      location: lead.location,
      outcome: pendingNote.outcomeKey,
      contactName: noteForm.contactName,
      createdAt: now,
      updatedAt: now,
      notes: initialNotes,
    }
    setSmePipeline(prev => ({ ...prev, [lead.id]: entry }))
    onCallLogged?.({ ...entry, xp: cfg.xp })
    onXpEarned?.(cfg.xp)
    setPendingNote(null)
    setNoteForm({ contactName: '', callNotes: '' })
  }

  function markMessaged(prospectId) {
    setMessaged(prev => ({ ...prev, [prospectId]: true }))
    onXpEarned?.(20)
  }

  function markIdeaUsed(key) {
    setUsedIdeas(prev => ({ ...prev, [key]: true }))
    onXpEarned?.(10)
  }

  if (loading) return null

  const allLeads    = prep?.sme_leads || []
  const newLeads    = allLeads.filter(l => !smePipeline[l.id])
  const activeLeads = newLeads
  const activeProspects = (prep?.linkedin_prospects || []).filter(p => !messaged[p.id])
  const allIdeas        = prep?.content_ideas || {}
  const ideaCount       = Object.values(allIdeas).flat().length

  const tabs = [
    { id: 'leads',     label: `SME Leads`,  count: activeLeads.length },
    { id: 'prospects', label: `Prospects`,  count: activeProspects.length },
    { id: 'ideas',     label: `Content`,    count: ideaCount },
  ]

  return (
    <div
      style={{
        background: 'var(--layer-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-8)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: collapsed ? 'none' : '1px solid var(--divider)',
          cursor: 'pointer',
          background: 'var(--layer-1)',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              background: prep?.source === 'scheduled_agent' ? 'var(--success-bg)' : 'var(--accent-gold-muted)',
              border: `1px solid ${prep?.source === 'scheduled_agent' ? 'rgba(52,211,153,0.2)' : 'rgba(232,196,104,0.2)'}`,
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              color: prep?.source === 'scheduled_agent' ? 'var(--success)' : 'var(--accent-gold)',
              fontWeight: 500,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            {prep?.source === 'scheduled_agent' ? 'Live' : 'Seed'}
          </div>
          <span
            className="font-semibold"
            style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Today's Prep
          </span>
          {prep?.generated_at && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Generated {prep.generated_at}
              {prep.source === 'scheduled_agent' ? ' by agent' : ' · seed data'}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
          {collapsed
            ? <ChevronDown size={16} strokeWidth={1.75} />
            : <ChevronUp size={16} strokeWidth={1.75} />
          }
        </span>
      </div>

      {!collapsed && (
        <>
          {/* Tabs */}
          <div
            className="flex"
            style={{
              padding: '0 var(--space-6)',
              gap: 'var(--space-3)',
              borderBottom: '1px solid var(--divider)',
            }}
          >
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: 'var(--space-2) var(--space-2)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === t.id ? '2px solid var(--accent-gold)' : '2px solid transparent',
                  color: activeTab === t.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'inherit',
                  fontWeight: activeTab === t.id ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
                <span
                  style={{
                    background: activeTab === t.id ? 'rgba(232, 196, 104, 0.10)' : 'var(--layer-3)',
                    color: activeTab === t.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0 6px',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: 'var(--space-5) var(--space-6)' }}>

            {/* ── SME LEADS ── */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                {activeLeads.length === 0 && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-3) 0' }}>
                    All leads actioned today — check the Pipeline tab to follow up.
                  </p>
                )}

                {/* ── New unactioned leads ── */}
                {newLeads.length > 0 && (
                  <div className="space-y-3">
                    {newLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="lead-card-anim"
                        style={{
                          background: 'var(--layer-2)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--space-6)',
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'all var(--duration-base) var(--ease-out)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--border-medium)'
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)'
                          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        {/* Gradient accent strip */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                          background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-blue))',
                          opacity: 0.5,
                        }} />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                                {lead.company}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--layer-3)', borderRadius: 'var(--radius-full)', padding: '1px 8px' }}>
                                {lead.industry}
                              </span>
                              {lead.website && (
                                <a href={`https://${lead.website}`} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: 'var(--accent-blue)', textDecoration: 'none' }}>
                                  {lead.website} ↗
                                </a>
                              )}
                              {!lead.website && (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                                  fontSize: 'var(--text-xs)', color: 'var(--danger)',
                                  background: 'var(--danger-bg)', border: '1px solid rgba(248,113,113,0.2)',
                                  borderRadius: 'var(--radius-full)', padding: '2px 10px', fontWeight: 500,
                                }}>
                                  <Globe size={12} strokeWidth={2} style={{ opacity: 0.5 }} />
                                  No website
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.65 }}>
                              {lead.location} · {lead.notes}
                            </p>
                          </div>

                          {/* Phone */}
                          <button
                            onClick={() => copyPhone(lead)}
                            style={{
                              flexShrink: 0,
                              background: copiedId === lead.id ? 'rgba(52,211,153,0.12)' : 'rgba(124,140,248,0.08)',
                              border: `1px solid ${copiedId === lead.id ? 'rgba(52,211,153,0.25)' : 'rgba(124,140,248,0.15)'}`,
                              borderRadius: 'var(--radius-full)', padding: '4px 12px',
                              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                              color: copiedId === lead.id ? 'var(--success)' : 'var(--accent-blue)',
                              cursor: 'pointer', transition: 'all var(--duration-base)', whiteSpace: 'nowrap',
                            }}
                          >
                            {copiedId === lead.id
                              ? '✓ Copied'
                              : <><Phone size={14} strokeWidth={1.75} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />{lead.phone}</>
                            }
                          </button>
                        </div>

                        {/* Script toggle + outcome buttons / note form */}
                        <div style={{
                          marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)',
                          borderTop: '1px solid var(--divider)',
                        }}>
                          {pendingNote?.leadId === lead.id ? (
                            /* ── Inline note capture ── */
                            <div className="space-y-2">
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '4px' }}>
                                Logging: {OUTCOME_CONFIG[pendingNote.outcomeKey]?.label} · add notes before saving
                              </p>
                              <input
                                style={noteInputStyle}
                                placeholder="Contact name (e.g. Nicola — receptionist)"
                                value={noteForm.contactName}
                                onChange={e => setNoteForm(f => ({ ...f, contactName: e.target.value }))}
                                autoFocus
                              />
                              <textarea
                                style={{ ...noteInputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                placeholder="Notes — what happened, when to call back, who to ask for..."
                                value={noteForm.callNotes}
                                onChange={e => setNoteForm(f => ({ ...f, callNotes: e.target.value }))}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => confirmLogOutcome(lead)}
                                  style={{
                                    background: 'var(--accent-gold)', color: 'var(--layer-0)',
                                    border: 'none', borderRadius: 'var(--radius-md)',
                                    padding: '6px 16px', fontSize: 'var(--text-xs)',
                                    fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                                    boxShadow: 'var(--shadow-gold)',
                                  }}
                                >
                                  Confirm +{OUTCOME_CONFIG[pendingNote.outcomeKey]?.xp}XP
                                </button>
                                <button
                                  onClick={() => setPendingNote(null)}
                                  style={{
                                    background: 'transparent', color: 'var(--text-tertiary)',
                                    border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)',
                                    padding: '6px 14px', fontSize: 'var(--text-xs)',
                                    fontFamily: 'inherit', cursor: 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── Script + outcome buttons ── */
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => setOpenScript(openScript === lead.id ? null : lead.id)}
                                style={{
                                  background: openScript === lead.id ? 'var(--accent-gold-muted)' : 'transparent',
                                  border: `1px solid ${openScript === lead.id ? 'var(--accent-gold)' : 'var(--border-medium)'}`,
                                  borderRadius: 'var(--radius-full)', padding: '6px 14px',
                                  fontSize: 'var(--text-xs)',
                                  color: openScript === lead.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', marginRight: '4px',
                                }}
                              >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                  {openScript === lead.id
                                    ? <><ChevronUp size={13} strokeWidth={2} />hide script</>
                                    : <><FileText size={13} strokeWidth={1.75} />call script</>
                                  }
                                </span>
                              </button>
                              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginRight: 'var(--space-1)' }}>
                                Log
                              </span>
                              {Object.entries(OUTCOME_CONFIG).map(([key, cfg]) => (
                                <button
                                  key={key}
                                  onClick={() => startLogOutcome(lead, key)}
                                  style={{
                                    background: key === 'interested' ? 'var(--accent-gold)' : key === 'follow_up' ? 'rgba(255,255,255,0.06)' : 'transparent',
                                    border: key === 'interested' ? 'none' : key === 'follow_up' ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-full)', padding: '6px 14px',
                                    fontSize: 'var(--text-xs)',
                                    color: key === 'interested' ? 'var(--layer-0)' : key === 'follow_up' ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    fontWeight: key === 'interested' ? 600 : 500,
                                    boxShadow: key === 'interested' ? 'var(--shadow-gold)' : 'none',
                                    transition: 'all 0.15s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    {(() => { const Icon = OUTCOME_ICONS[key]; return Icon ? <Icon size={13} strokeWidth={2} /> : null })()}
                                    {cfg.label} +{cfg.xp}XP
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Call script panel */}
                        {openScript === lead.id && pendingNote?.leadId !== lead.id && (
                          <CopyableScript
                            text={customScripts[lead.id] ?? generateCallScript(lead)}
                            isAgentGenerated={false}
                            isCustom={!!customScripts[lead.id]}
                            editMode={editingScript === lead.id}
                            draft={scriptDraft}
                            onDraftChange={setScriptDraft}
                            onEditStart={() => startEditScript(lead)}
                            onSave={() => saveScript(lead)}
                            onCancel={cancelEditScript}
                            onReset={() => resetScript(lead)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROSPECTS ── */}
            {activeTab === 'prospects' && (
              <div className="space-y-3">
                {activeProspects.length === 0 ? (
                  <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-3) 0' }}>
                    All prospects messaged for today.
                  </p>
                ) : activeProspects.map(p => (
                  <div key={p.id}>
                  <div
                    style={{
                      background: 'var(--layer-2)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-3)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all var(--duration-base) var(--ease-out)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                          {p.title} · {p.company}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.65 }}>
                        {p.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(124,140,248,0.08)', color: 'var(--accent-blue)',
                          border: '1px solid rgba(124,140,248,0.15)', borderRadius: 'var(--radius-full)',
                          padding: '4px 12px', fontSize: '10px', textDecoration: 'none', fontWeight: 500,
                        }}
                      >
                        View ↗
                      </a>
                      <button
                        onClick={() => setOpenScript(openScript === p.id ? null : p.id)}
                        style={{
                          background: openScript === p.id ? 'var(--accent-gold-muted)' : 'transparent',
                          border: `1px solid ${openScript === p.id ? 'var(--accent-gold)' : 'var(--border-medium)'}`,
                          borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '10px',
                          color: openScript === p.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <MessageSquare size={13} strokeWidth={1.75} />
                          message
                        </span>
                      </button>
                      <button
                        onClick={() => markMessaged(p.id)}
                        style={{
                          background: 'transparent', border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '10px',
                          color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--success)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
                      >
                        Sent +20XP
                      </button>
                    </div>
                  </div>

                  {openScript === p.id && (
                    <CopyableScript
                      text={p.outreach_message || generateLinkedInMessage(p)}
                      isAgentGenerated={!!p.outreach_message}
                    />
                  )}
                  </div>
                ))}
              </div>
            )}

            {/* ── CONTENT IDEAS ── */}
            {activeTab === 'ideas' && (
              <div className="space-y-4">
                {Object.entries(allIdeas).map(([venture, ideas]) => {
                  const vc = VENTURE_COLORS[venture] || {}
                  if (!ideas || ideas.length === 0) return null
                  return (
                    <div key={venture}>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-2"
                        style={{ color: vc.color || 'var(--color-text-faint)' }}
                      >
                        {VENTURE_LABELS[venture] || venture}
                      </p>
                      <div className="space-y-2">
                        {ideas.map((idea, i) => {
                          const key = `${venture}_${i}`
                          const used = usedIdeas[key]
                          const isObj = typeof idea === 'object' && idea !== null
                          return (
                            <div
                              key={key}
                              style={{
                                background: used ? 'transparent' : 'var(--layer-2)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-3) var(--space-4)',
                                opacity: used ? 0.4 : 1,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <div style={{ flex: 1 }}>
                                  {isObj && idea.platform && (
                                    <p style={{ fontSize: '10px', color: vc.color || 'var(--color-text-faint)', fontWeight: 600, marginBottom: '3px' }}>
                                      {idea.platform}
                                    </p>
                                  )}
                                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0, fontWeight: isObj ? 500 : 400 }}>
                                    {isObj ? idea.title : idea}
                                  </p>
                                  {isObj && idea.format && (
                                    <p style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginTop: '3px', lineHeight: 1.5 }}>
                                      {idea.format}
                                    </p>
                                  )}
                                </div>
                                {!used && (
                                  <button
                                    onClick={() => markIdeaUsed(key)}
                                    style={{
                                      flexShrink: 0, background: 'transparent',
                                      border: `1px solid ${vc.color || 'var(--color-border)'}`,
                                      borderRadius: 'var(--radius-full)', padding: '2px 8px',
                                      fontSize: '10px', color: vc.color || 'var(--color-text-faint)',
                                      cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', marginTop: '2px',
                                    }}
                                  >
                                    Used +10XP
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
