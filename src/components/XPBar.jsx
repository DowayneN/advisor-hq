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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Daily XP
          </span>
          <span
            className="font-mono font-semibold"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}
          >
            {xpToday} / {DAILY_XP_TARGET}
          </span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          {xpTotal.toLocaleString()} total XP
        </span>
      </div>

      {/* XP progress bar */}
      <div
        style={{
          height: '6px',
          background: 'var(--color-surface-3)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: pct >= 100 ? 'var(--color-success)' : 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>

      {/* Streak row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 'var(--text-sm)' }}>🔥</span>
          <span
            className="font-medium"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
          >
            {streak}-day streak
          </span>
          {nextMilestone && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
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
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
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
