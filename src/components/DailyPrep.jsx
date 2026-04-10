import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchDailyPrep, OUTCOME_CONFIG } from '../data/dailyPrep'

const VENTURE_LABELS = { dts: 'DTS', athletics: 'Athletics', aimybiz: 'AIMyBiz' }
const VENTURE_COLORS = {
  dts:       { color: 'var(--venture-dts)',      dim: 'var(--venture-dts-dim)' },
  athletics: { color: 'var(--venture-athletics)', dim: 'var(--venture-athletics-dim)' },
  aimybiz:   { color: 'var(--venture-aimybiz)',   dim: 'var(--venture-aimybiz-dim)' },
}

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function generateCallScript(lead) {
  const hasFacebook = lead.notes?.toLowerCase().includes('facebook')
  const hasReviews  = lead.notes?.toLowerCase().includes('review')
  const noWebsite   = !lead.website

  const reviewLine = hasReviews
    ? 'You have got some brilliant reviews - the reputation is clearly there, people really rate what you do.'
    : 'The business has a solid presence - you can tell people rate what you do.'

  const gapLine = noWebsite
    ? 'I just noticed you do not have your own website yet - which honestly surprised me given how strong the business looks.'
    : 'I noticed your website has not been updated in a while - which stood out because the business clearly deserves better than that.'

  const fantasyLine = noWebsite
    ? 'A lot of ' + lead.industry.toLowerCase() + 's around Southampton have been picking up new customers just from showing up on Google - people searching "' + lead.industry.toLowerCase() + ' near me" who had no idea they existed before.'
    : 'Once a site is refreshed and properly set up, it starts pulling in people searching locally who would never have found you otherwise.'

  const socialProof = hasFacebook
    ? 'Facebook is great for the regulars, but the people who do not follow you yet - they go to Google first.'
    : 'Most new customers search before they call. If you are not showing up, they are going somewhere else.'

  return [
    'Hey, is that [Name]?',
    '',
    "Hi [Name], hope you do not mind the call - my name is Dowayne, I am local, based here in Southampton.",
    '',
    reviewLine,
    '',
    gapLine,
    '',
    fantasyLine,
    '',
    socialProof,
    '',
    'I build websites for local businesses - nothing complicated, I keep it straightforward and affordable. I just thought it was worth a conversation rather than leaving it.',
    '',
    'Is that something you have ever thought about - having your own site pulling in new customers on its own?',
    '',
    '[ Let them answer - then listen. If yes: "When would be a good time to sit down for 20 minutes?" If unsure: "Totally understand - no pressure at all. Could I send you a couple of examples so you can see what it could look like for ' + lead.company + '?" ]',
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

function CopyableScript({ text, isAgentGenerated }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div
      style={{
        marginTop: 'var(--space-2)',
        background: 'var(--color-surface-3)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
      className="animate-in"
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: '6px 10px', borderBottom: '1px solid var(--color-border-soft)' }}
      >
        <span style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>
          {isAgentGenerated ? '✦ Agent-generated' : '◇ Template'}
        </span>
        <button
          onClick={copy}
          style={{
            background: copied ? 'rgba(74,124,89,0.2)' : 'transparent',
            border: `1px solid ${copied ? 'var(--color-success)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '2px 8px',
            fontSize: '10px',
            color: copied ? 'var(--color-success)' : 'var(--color-text-faint)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '10px',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {text}
      </pre>
    </div>
  )
}

export default function DailyPrep({ onXpEarned, onCallLogged }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leads')
  const [dismissed, setDismissed] = useLocalStorage(`advisor_dismissed_${todayKey()}`, {})
  const [messaged, setMessaged]   = useLocalStorage(`advisor_messaged_${todayKey()}`, {})
  const [usedIdeas, setUsedIdeas] = useLocalStorage(`advisor_ideas_${todayKey()}`, {})
  const [copiedId, setCopiedId] = useState(null)
  const [collapsed, setCollapsed] = useLocalStorage('advisor_prep_collapsed', false)
  const [openScript, setOpenScript] = useState(null)

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

  function logOutcome(lead, outcomeKey) {
    const cfg = OUTCOME_CONFIG[outcomeKey]
    const call = {
      id: `call_${Date.now()}`,
      date: todayKey(),
      company: lead.company,
      industry: lead.industry,
      phone: lead.phone,
      outcome: outcomeKey,
      notes: '',
      xp: cfg.xp,
    }
    onCallLogged?.(call)
    onXpEarned?.(cfg.xp)
    setDismissed(prev => ({ ...prev, [lead.id]: outcomeKey }))
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

  const activeLeads      = (prep?.sme_leads || []).filter(l => !dismissed[l.id])
  const activeProspects  = (prep?.linkedin_prospects || []).filter(p => !messaged[p.id])
  const allIdeas         = prep?.content_ideas || {}
  const ideaCount        = Object.values(allIdeas).flat().length

  const tabs = [
    { id: 'leads',     label: `SME Leads`,   count: activeLeads.length },
    { id: 'prospects', label: `Prospects`,   count: activeProspects.length },
    { id: 'ideas',     label: `Content`,     count: ideaCount },
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
        <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
          {collapsed ? '↓ expand' : '↑ collapse'}
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
              <div className="space-y-3">
                {activeLeads.length === 0 ? (
                  <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-3) 0' }}>
                    All leads actioned for today.
                  </p>
                ) : activeLeads.map(lead => (
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
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-blue))',
                      opacity: 0.5,
                    }} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold"
                            style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
                          >
                            {lead.company}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'var(--text-tertiary)',
                              background: 'var(--layer-3)',
                              borderRadius: 'var(--radius-full)',
                              padding: '1px 8px',
                            }}
                          >
                            {lead.industry}
                          </span>
                          {lead.website && (
                            <a
                              href={`https://${lead.website}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '10px', color: 'var(--accent-blue)', textDecoration: 'none' }}
                            >
                              {lead.website} ↗
                            </a>
                          )}
                          {!lead.website && (
                            <span style={{
                              fontSize: 'var(--text-xs)',
                              color: 'var(--danger)',
                              background: 'var(--danger-bg)',
                              border: '1px solid rgba(248,113,113,0.2)',
                              borderRadius: 'var(--radius-full)',
                              padding: '2px 10px',
                              fontWeight: 500,
                            }}>No website</span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                            marginTop: '4px',
                            lineHeight: 1.65,
                          }}
                        >
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
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 12px',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-mono)',
                          color: copiedId === lead.id ? 'var(--success)' : 'var(--accent-blue)',
                          cursor: 'pointer',
                          transition: 'all var(--duration-base)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {copiedId === lead.id ? '✓ Copied' : lead.phone}
                      </button>
                    </div>

                    {/* Script toggle + outcome buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      flexWrap: 'wrap',
                      marginTop: 'var(--space-4)',
                      paddingTop: 'var(--space-4)',
                      borderTop: '1px solid var(--divider)',
                    }}>
                      <button
                        onClick={() => setOpenScript(openScript === lead.id ? null : lead.id)}
                        style={{
                          background: openScript === lead.id ? 'var(--accent-gold-muted)' : 'transparent',
                          border: `1px solid ${openScript === lead.id ? 'var(--accent-gold)' : 'var(--border-medium)'}`,
                          borderRadius: 'var(--radius-full)',
                          padding: '6px 14px',
                          fontSize: 'var(--text-xs)',
                          color: openScript === lead.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                          marginRight: '4px',
                        }}
                      >
                        {openScript === lead.id ? '↑ hide script' : '📞 call script'}
                      </button>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginRight: 'var(--space-1)',
                      }}>
                        Log
                      </span>
                      {Object.entries(OUTCOME_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => logOutcome(lead, key)}
                          style={{
                            background: key === 'interested' ? 'var(--accent-gold)' : key === 'follow_up' ? 'rgba(255,255,255,0.06)' : 'transparent',
                            border: key === 'interested' ? 'none' : key === 'follow_up' ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-full)',
                            padding: '6px 14px',
                            fontSize: 'var(--text-xs)',
                            color: key === 'interested' ? 'var(--layer-0)' : key === 'follow_up' ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: key === 'interested' ? 600 : 500,
                            boxShadow: key === 'interested' ? 'var(--shadow-gold)' : 'none',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          {cfg.label} +{cfg.xp}XP
                        </button>
                      ))}
                    </div>

                    {/* Call script panel */}
                    {openScript === lead.id && (
                      <CopyableScript
                        text={lead.call_script || generateCallScript(lead)}
                        isAgentGenerated={!!lead.call_script}
                      />
                    )}
                  </div>
                ))}
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
                          background: 'rgba(124,140,248,0.08)',
                          color: 'var(--accent-blue)',
                          border: '1px solid rgba(124,140,248,0.15)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 12px',
                          fontSize: '10px',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        View ↗
                      </a>
                      <button
                        onClick={() => setOpenScript(openScript === p.id ? null : p.id)}
                        style={{
                          background: openScript === p.id ? 'var(--accent-gold-muted)' : 'transparent',
                          border: `1px solid ${openScript === p.id ? 'var(--accent-gold)' : 'var(--border-medium)'}`,
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 12px',
                          fontSize: '10px',
                          color: openScript === p.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        }}
                      >
                        💬 message
                      </button>
                      <button
                        onClick={() => markMessaged(p.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 12px',
                          fontSize: '10px',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
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
                                      flexShrink: 0,
                                      background: 'transparent',
                                      border: `1px solid ${vc.color || 'var(--color-border)'}`,
                                      borderRadius: 'var(--radius-full)',
                                      padding: '2px 8px',
                                      fontSize: '10px',
                                      color: vc.color || 'var(--color-text-faint)',
                                      cursor: 'pointer',
                                      fontFamily: 'inherit',
                                      whiteSpace: 'nowrap',
                                      marginTop: '2px',
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
