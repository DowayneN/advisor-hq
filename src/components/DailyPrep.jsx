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

export default function DailyPrep({ onXpEarned, onCallLogged }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leads')
  const [dismissed, setDismissed] = useLocalStorage(`advisor_dismissed_${todayKey()}`, {})
  const [messaged, setMessaged]   = useLocalStorage(`advisor_messaged_${todayKey()}`, {})
  const [usedIdeas, setUsedIdeas] = useLocalStorage(`advisor_ideas_${todayKey()}`, {})
  const [copiedId, setCopiedId] = useState(null)
  const [collapsed, setCollapsed] = useLocalStorage('advisor_prep_collapsed', false)

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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-5)',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: collapsed ? 'none' : '1px solid var(--color-border-soft)',
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: prep?.source === 'scheduled_agent' ? 'var(--color-success)' : 'var(--color-accent)',
              boxShadow: `0 0 6px ${prep?.source === 'scheduled_agent' ? 'var(--color-success)' : 'var(--color-accent)'}`,
            }}
          />
          <span
            className="font-semibold"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}
          >
            Today's Prep
          </span>
          {prep?.generated_at && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              Generated {prep.generated_at}
              {prep.source === 'scheduled_agent' ? ' by agent' : ' · seed data'}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)' }}>
          {collapsed ? '↓ expand' : '↑ collapse'}
        </span>
      </div>

      {!collapsed && (
        <>
          {/* Tabs */}
          <div
            className="flex"
            style={{
              padding: '0 var(--space-4)',
              gap: 'var(--space-2)',
              borderBottom: '1px solid var(--color-border-soft)',
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
                  borderBottom: activeTab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                  color: activeTab === t.id ? 'var(--color-text)' : 'var(--color-text-faint)',
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
                    background: activeTab === t.id ? 'var(--color-accent-dim)' : 'var(--color-surface-3)',
                    color: activeTab === t.id ? 'var(--color-accent)' : 'var(--color-text-faint)',
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
          <div style={{ padding: 'var(--space-3) var(--space-4)' }}>

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
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-soft)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-3)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold"
                            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}
                          >
                            {lead.company}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'var(--color-text-faint)',
                              background: 'var(--color-surface-3)',
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
                              style={{ fontSize: '10px', color: 'var(--color-accent)', textDecoration: 'none' }}
                            >
                              {lead.website} ↗
                            </a>
                          )}
                          {!lead.website && (
                            <span style={{ fontSize: '10px', color: 'var(--color-error)' }}>No website</span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-faint)',
                            marginTop: '4px',
                            lineHeight: 1.5,
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
                          background: copiedId === lead.id ? 'rgba(74,124,89,0.2)' : 'var(--color-surface-3)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '4px 10px',
                          fontSize: 'var(--text-xs)',
                          fontFamily: "'JetBrains Mono', monospace",
                          color: copiedId === lead.id ? 'var(--color-success)' : 'var(--color-text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {copiedId === lead.id ? '✓ Copied' : lead.phone}
                      </button>
                    </div>

                    {/* Outcome buttons */}
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginRight: '4px' }}>
                        Log outcome:
                      </span>
                      {Object.entries(OUTCOME_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => logOutcome(lead, key)}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${cfg.color}`,
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 10px',
                            fontSize: '10px',
                            color: cfg.color,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.target.style.background = cfg.dim}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          {cfg.label} +{cfg.xp}XP
                        </button>
                      ))}
                    </div>
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
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-soft)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-3)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {p.title} · {p.company}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '4px', lineHeight: 1.5 }}>
                        {p.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'var(--color-accent-dim)',
                          color: 'var(--color-accent)',
                          border: '1px solid var(--color-accent)',
                          borderRadius: 'var(--radius-md)',
                          padding: '4px 10px',
                          fontSize: '10px',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        View ↗
                      </a>
                      <button
                        onClick={() => markMessaged(p.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '4px 10px',
                          fontSize: '10px',
                          color: 'var(--color-text-faint)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.target.style.color = 'var(--color-success)'; e.target.style.borderColor = 'var(--color-success)' }}
                        onMouseLeave={e => { e.target.style.color = 'var(--color-text-faint)'; e.target.style.borderColor = 'var(--color-border)' }}
                      >
                        Messaged +20XP
                      </button>
                    </div>
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
                          return (
                            <div
                              key={key}
                              style={{
                                background: used ? 'transparent' : 'var(--color-surface-2)',
                                border: `1px solid ${used ? 'var(--color-border-soft)' : 'var(--color-border-soft)'}`,
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-2) var(--space-3)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-2)',
                                opacity: used ? 0.4 : 1,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              <p style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                                {idea}
                              </p>
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
                                  }}
                                >
                                  Used +10XP
                                </button>
                              )}
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
