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
    background: 'var(--layer-2)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-2)',
    color: 'var(--text-primary)',
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
            background: 'var(--accent-gold)',
            color: 'var(--layer-0)',
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
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
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
            style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', lineHeight: 1.2 }}
          >
            Call Log
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {todayCalls.length} today · {allCalls.length} total · {convRate}% interested
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            background: showForm ? 'transparent' : 'var(--accent-gold)',
            color: showForm ? 'var(--text-secondary)' : 'var(--layer-0)',
            border: showForm ? '1px solid var(--border-medium)' : 'none',
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
          { label: "Today's Calls",  value: todayCalls.length,  color: 'var(--text-primary)' },
          { label: 'Total Calls',    value: allCalls.length,    color: 'var(--text-primary)' },
          { label: 'Interested',     value: interestedCount,    color: 'var(--success)' },
          { label: 'XP from Calls',  value: `+${totalXpFromCalls}`, color: 'var(--accent-gold)' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              background: 'var(--layer-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="font-bold" style={{ fontSize: 'var(--text-xl)', color: stat.color, fontFamily: 'var(--font-mono)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <div
          style={{
            background: 'var(--layer-2)',
            border: '1px solid var(--border-medium)',
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
              background: filter === f.id ? 'var(--accent-gold-muted)' : 'transparent',
              border: `1px solid ${filter === f.id ? 'var(--accent-gold)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: 'var(--text-xs)',
              color: filter === f.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
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
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
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
                background: 'var(--layer-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {call.company}
                  </span>
                  {call.industry && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {call.industry}
                    </span>
                  )}
                </div>
                {call.notes && (call.notes.length > 0) && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    {Array.isArray(call.notes) ? call.notes.map(n => n.text).join(' · ') : call.notes}
                  </p>
                )}
                <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {call.date} {call.phone && `· ${call.phone}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <OutcomeBadge outcome={call.outcome} />
                <span
                  className="font-semibold"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}
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
