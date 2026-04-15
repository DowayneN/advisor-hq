import { Flame } from 'lucide-react'

const DAILY_XP_TARGET = 200
const STREAK_MILESTONES = [
  { days: 7,  label: '7 days',  color: 'var(--color-accent)' },
  { days: 30, label: '30 days', color: 'var(--venture-athletics)' },
  { days: 60, label: '60 days', color: 'var(--venture-dts)' },
]

export default function XPBar({ xpToday, xpTotal, streak }) {
  const pct = Math.min(100, Math.round((xpToday / DAILY_XP_TARGET) * 100))
  const nextMilestone = STREAK_MILESTONES.find(m => streak < m.days)
  const earnedMilestones = STREAK_MILESTONES.filter(m => streak >= m.days)

  return (
    <div
      style={{
        background: 'var(--layer-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Daily XP
          </span>
          <span
            className="font-semibold"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}
          >
            {xpToday} / {DAILY_XP_TARGET}
          </span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {xpTotal.toLocaleString()} total XP
        </span>
      </div>

      {/* XP progress bar */}
      <div
        style={{
          height: '6px',
          background: 'var(--layer-3)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: pct >= 100 ? 'var(--success)' : 'var(--accent-gold)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Streak row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={16} strokeWidth={2} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <span
            className="font-medium"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
          >
            {streak}-day streak
          </span>
          {nextMilestone && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              · {nextMilestone.days - streak} to {nextMilestone.label}
            </span>
          )}
        </div>

        {/* Earned milestone badges */}
        <div className="flex gap-1.5">
          {earnedMilestones.map(m => (
            <span
              key={m.days}
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                color: m.color,
                background: 'var(--layer-1)',
                border: '1px solid var(--border-medium)',
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
