import { useState } from 'react'
import { METRICS_DEFINITIONS } from '../data/metrics'
import MetricInput from './MetricInput'

function ProgressBar({ current, target, color }) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  return (
    <div className="space-y-1">
      <div className="flex justify-between" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
        <span>{pct}%</span>
        <span>{current.toLocaleString()} / {target.toLocaleString()}</span>
      </div>
      <div
        style={{
          height: '4px',
          background: 'var(--layer-3)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.7s ease',
          }}
        />
      </div>
    </div>
  )
}

function ventureOverallPct(ventureKey, metrics) {
  const def = METRICS_DEFINITIONS[ventureKey]
  const vals = metrics[ventureKey] || {}
  const pcts = def.fields.map(f => Math.min(100, ((vals[f.key] ?? f.current) / f.target) * 100))
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}

export default function MissionControl({ metrics, setMetrics }) {
  const [editing, setEditing] = useState(null) // { venture, fieldKey }

  function handleSave(ventureKey, fieldKey, value) {
    setMetrics(prev => ({
      ...prev,
      [ventureKey]: { ...prev[ventureKey], [fieldKey]: value }
    }))
  }

  const editingData = editing
    ? {
        venture: METRICS_DEFINITIONS[editing.venture],
        field: METRICS_DEFINITIONS[editing.venture].fields.find(f => f.key === editing.fieldKey),
        currentValue: (metrics[editing.venture] || {})[editing.fieldKey] ?? 0,
      }
    : null

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h1
          className="font-bold"
          style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}
        >
          Mission Control
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
          April → October 2026 · click any metric to update
        </p>
      </div>

      {/* Info strip: objectives + priority side by side */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ marginBottom: 'var(--space-4)' }}
      >
        {/* Objectives */}
        <div
          style={{
            background: 'var(--layer-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3)',
          }}
        >
          <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            6-Month Objectives
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {[
              { label: 'DTS',        goal: '750 users · 120 packages · £3k' },
              { label: 'CloseCoach', goal: '3 customers · £600+ MRR' },
              { label: 'Web Dev',    goal: '4 sites · £750+ avg' },
              { label: 'Athletics',  goal: '2,000 followers · 3×/week' },
            ].map(item => (
              <div key={item.label}>
                <span className="font-medium block" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                  {item.label}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>{item.goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority stack */}
        <div
          style={{
            background: 'var(--layer-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Priority Stack
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {[
              { n: 1, label: 'CloseCoach outbound', note: 'Product done. Pure sales.', color: 'var(--venture-aimybiz)' },
              { n: 2, label: 'DTS marketing',       note: 'Build a growth loop.',      color: 'var(--venture-dts)' },
              { n: 3, label: 'Web Dev',             note: '£750+ per site.',            color: 'var(--venture-aimybiz)' },
              { n: 4, label: 'Athletics brand',     note: 'Long game. Batch it.',       color: 'var(--venture-athletics)' },
            ].map(item => (
              <div key={item.n} className="flex items-start gap-2">
                <span className="font-mono flex-shrink-0" style={{ color: 'var(--text-tertiary)', fontSize: '10px', paddingTop: '1px' }}>
                  #{item.n}
                </span>
                <div>
                  <span className="font-medium block" style={{ color: item.color, fontSize: 'var(--text-xs)' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venture cards — full width, 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(METRICS_DEFINITIONS).map(([ventureKey, venture]) => {
            const vals = metrics[ventureKey] || {}
            const overallPct = ventureOverallPct(ventureKey, metrics)

            return (
              <div
                key={ventureKey}
                style={{
                  background: 'var(--layer-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.borderColor = 'var(--border-medium)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: venture.accentColor }} />
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                      {venture.label}
                    </h3>
                  </div>
                  <span
                    className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: venture.accentColor, background: venture.dimColor }}
                  >
                    {overallPct}% to goal
                  </span>
                </div>

                {/* Overall progress */}
                <div
                  style={{
                    height: '3px',
                    background: 'var(--layer-3)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${overallPct}%`,
                      background: overallPct === 100 ? 'var(--success)' : venture.accentColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.7s ease',
                    }}
                  />
                </div>

                {/* Metric fields */}
                <div className="space-y-3">
                  {venture.fields.map(field => {
                    const current = vals[field.key] ?? field.current
                    return (
                      <button
                        key={field.key}
                        onClick={() => setEditing({ venture: ventureKey, fieldKey: field.key })}
                        className="w-full text-left group space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {field.label}
                          </span>
                          <span
                            className="font-mono font-semibold text-xs group-hover:underline"
                            style={{ color: venture.accentColor }}
                          >
                            {field.prefix}{current.toLocaleString()}{field.suffix}
                          </span>
                        </div>
                        <ProgressBar current={current} target={field.target} color={venture.accentColor} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      {/* Edit modal */}
      {editing && editingData && (
        <MetricInput
          venture={editingData.venture}
          field={editingData.field}
          currentValue={editingData.currentValue}
          onSave={value => handleSave(editing.venture, editing.fieldKey, value)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
