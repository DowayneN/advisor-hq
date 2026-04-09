import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { OUTCOME_CONFIG } from '../data/dailyPrep'

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function genId() {
  return 'call_' + Date.now()
}

const OUTCOME_ORDER = ['interested', 'follow_up', 'not_now', 'no_answer']

function OutcomeBadge({ outcome }) {
  const cfg = OUTCOME_CONFIG[outcome] || {}
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 600,
        color: cfg.color,
        background: cfg.dim,
        borderRadius: 'var(--radius-full)',
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

function LogCallForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    company: '', industry: '', phone: '', outcome: 'interested', notes: '',
  })

  function submit(e) {
    e.preventDefault()
    if (!form.company.trim()) return
    const cfg = OUTCOME_CONFIG[form.outcome]
    onAdd({
      id: genId(),
      date: todayKey(),
      company: form.company.trim(),
      industry: form.industry.trim(),
      phone: form.phone.trim(),
      outcome: form.outcome,
      notes: form.notes.trim(),
      xp: cfg.xp,
    })
  }

  const inputStyle = {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-2)',
    color: 'var(--color-text)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'inherit',
    width: '100%',
    outline: 'none',
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <input
          style={inputStyle}
          placeholder="Company name *"
          value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          required
          autoFocus
        />
        <input
          style={inputStyle}
          placeholder="Industry"
          value={form.industry}
          onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <input
          style={inputStyle}
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        <select
          style={inputStyle}
          value={form.outcome}
          onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}
        >
          {OUTCOME_ORDER.map(key => (
            <option key={key} value={key}>{OUTCOME_CONFIG[key].label} (+{OUTCOME_CONFIG[key].xp}XP)</option>
          ))}
        </select>
      </div>
      <input
        style={inputStyle}
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Log Call
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function CallTracker({ externalCalls = [], onXpEarned }) {
  const [storedCalls, setStoredCalls] = useLocalStorage('advisor_calls', [])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const allCalls = [...storedCalls, ...externalCalls].sort((a, b) => b.id.localeCompare(a.id))
  const today = todayKey()
  const todayCalls = allCalls.filter(c => c.date === today)

  // Stats
  const totalXpFromCalls = allCalls.reduce((s, c) => s + (c.xp || 0), 0)
  const interestedCount  = allCalls.filter(c => c.outcome === 'interested').length
  const convRate = allCalls.length > 0 ? Math.round((interestedCount / allCalls.length) * 100) : 0

  const displayCalls = filter === 'today'
    ? todayCalls
    : filter === 'interested'
    ? allCalls.filter(c => c.outcome === 'interested')
    : allCalls

  function logCall(call) {
    setStoredCalls(prev => [call, ...prev])
    onXpEarned?.(call.xp)
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h2
            className="font-bold"
            style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text)', lineHeight: 1.2 }}
          >
            Call Log
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', marginTop: '2px' }}>
            {todayCalls.length} today · {allCalls.length} total · {convRate}% interested
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            background: showForm ? 'transparent' : 'var(--color-accent)',
            color: showForm ? 'var(--color-text-muted)' : 'var(--color-bg)',
            border: showForm ? '1px solid var(--color-border)' : 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ Log Call'}
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {[
          { label: "Today's Calls",  value: todayCalls.length,  color: 'var(--color-text)' },
          { label: 'Total Calls',    value: allCalls.length,    color: 'var(--color-text)' },
          { label: 'Interested',     value: interestedCount,    color: 'var(--color-success)' },
          { label: 'XP from Calls',  value: `+${totalXpFromCalls}`, color: 'var(--color-accent)' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-soft)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3)',
              textAlign: 'center',
            }}
          >
            <div className="font-bold font-mono" style={{ fontSize: 'var(--text-xl)', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '2px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}
          className="animate-in"
        >
          <LogCallForm onAdd={logCall} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2" style={{ marginBottom: 'var(--space-3)' }}>
        {[
          { id: 'all',        label: `All (${allCalls.length})` },
          { id: 'today',      label: `Today (${todayCalls.length})` },
          { id: 'interested', label: `Interested (${interestedCount})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              background: filter === f.id ? 'var(--color-accent-dim)' : 'transparent',
              border: `1px solid ${filter === f.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: 'var(--text-xs)',
              color: filter === f.id ? 'var(--color-accent)' : 'var(--color-text-faint)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: filter === f.id ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Call list */}
      {displayCalls.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--color-border-soft)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            color: 'var(--color-text-faint)',
            fontSize: 'var(--text-sm)',
          }}
        >
          No calls logged yet. Use Today's Prep or log manually above.
        </div>
      ) : (
        <div className="space-y-2">
          {displayCalls.map(call => (
            <div
              key={call.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-soft)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    {call.company}
                  </span>
                  {call.industry && (
                    <span style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>
                      {call.industry}
                    </span>
                  )}
                </div>
                {call.notes && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '2px' }}>
                    {call.notes}
                  </p>
                )}
                <p style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginTop: '2px' }}>
                  {call.date} {call.phone && `· ${call.phone}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <OutcomeBadge outcome={call.outcome} />
                <span
                  className="font-mono font-semibold"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}
                >
                  +{call.xp}XP
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
