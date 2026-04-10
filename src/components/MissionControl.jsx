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
    <div style={{ maxWidth: '720px' }} className="space-y-5">
      {/* Header */}
      <div>
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

      {/* 6-month goal banner */}
      <div
        style={{
          background: 'var(--layer-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p
          className="font-semibold text-sm mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          6-Month Objectives
        </p>
        <div className="space-y-1">
          {[
            { label: 'DTS',        goal: '750 users · 120 active packages · £3,000 revenue' },
            { label: 'CloseCoach', goal: '3 paying B2B customers · £600+ MRR' },
            { label: 'Web Dev',    goal: '4 sites delivered · £750+ avg price' },
            { label: 'Athletics',  goal: '2,000 followers · 3×/week consistent for 90 days' },
          ].map(item => (
            <div key={item.label} className="flex gap-3 text-sm">
              <span
                className="font-medium flex-shrink-0"
                style={{ color: 'var(--text-secondary)', width: '80px' }}
              >
                {item.label}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>{item.goal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Venture cards */}
      <div className="space-y-4">
        {Object.entries(METRICS_DEFINITIONS).map(([ventureKey, venture]) => {
          const vals = metrics[ventureKey] || {}
          const overallPct = ventureOverallPct(ventureKey, metrics)

          return (
            <div
              key={ventureKey}
              style={{
                background: 'var(--layer-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: 'var(--space-4)',
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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: venture.accentColor,
                    }}
                  />
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}
                  >
                    {venture.label}
                  </h3>
                </div>
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: venture.accentColor,
                    background: venture.dimColor,
                  }}
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
                  marginBottom: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${overallPct}%`,
                    background: overallPct === 100 ? 'var(--color-success)' : venture.accentColor,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.7s ease',
                  }}
                />
              </div>

              {/* Metric fields */}
              <div className="space-y-4">
                {venture.fields.map(field => {
                  const current = vals[field.key] ?? field.current
                  return (
                    <button
                      key={field.key}
                      onClick={() => setEditing({ venture: ventureKey, fieldKey: field.key })}
                      className="w-full text-left group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {field.label}
                        </span>
                        <span
                          className="font-mono font-semibold text-sm group-hover:underline"
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

      {/* Priority stack */}
      <div
        style={{
          background: 'var(--layer-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Priority Stack
        </p>
        <div className="space-y-3">
          {[
            { n: 1, label: 'CloseCoach outbound sales', note: 'Product is done. Pure sales from here.', color: 'var(--venture-aimybiz)' },
            { n: 2, label: 'DTS marketing system',      note: 'Build a repeatable growth loop.',        color: 'var(--venture-dts)' },
            { n: 3, label: 'Web Dev (AIMyBiz)',         note: 'Immediate revenue. Raise price to £750+.', color: 'var(--venture-aimybiz)' },
            { n: 4, label: 'Athletics brand',           note: 'Long game. Batch around gym sessions.',   color: 'var(--venture-athletics)' },
          ].map(item => (
            <div key={item.n} className="flex items-baseline gap-3 text-sm">
              <span
                className="font-mono text-xs flex-shrink-0"
                style={{ color: 'var(--text-tertiary)', width: '20px' }}
              >
                #{item.n}
              </span>
              <span
                className="font-medium"
                style={{ color: item.color }}
              >
                {item.label}
              </span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                {item.note}
              </span>
            </div>
          ))}
        </div>
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
