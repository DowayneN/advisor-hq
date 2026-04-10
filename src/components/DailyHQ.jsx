import { useState } from 'react'
import { getTasksForDay, VENTURES, DAY_NAMES } from '../data/tasks'
import XPBar from './XPBar'
import DailyPrep from './DailyPrep'

const PERIODS = ['morning', 'afternoon', 'evening']
const PERIOD_LABELS = {
  morning:   'Morning',
  afternoon: 'Afternoon',
  evening:   'Evening',
}

function TaskCard({ task, done, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const v = VENTURES[task.venture]

  return (
    <div
      style={{
        background: 'var(--layer-2)',
        border: `1px solid ${done ? 'var(--border-subtle)' : 'var(--border-medium)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'all var(--duration-base) var(--ease-out)',
        boxShadow: done ? 'none' : 'var(--shadow-sm)',
        opacity: done ? 0.5 : 1,
      }}
    >
      {/* Task row */}
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className="text-sm font-medium leading-snug"
              style={{
                color: done ? 'var(--text-disabled)' : 'var(--text-primary)',
                textDecoration: done ? 'line-through' : 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
              }}
            >
              {task.label}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
              {/* Venture tag */}
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: v.color,
                  background: v.dimColor,
                }}
              >
                {v.label}
              </span>
              {/* XP */}
              <span
                className="text-xs font-semibold"
                style={{ color: done ? 'var(--text-disabled)' : 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}
              >
                +{task.xp}
              </span>
            </div>
          </div>

          {/* Duration + expand toggle */}
          <div className="flex items-center gap-3 mt-1.5">
            {task.detail?.duration && (
              <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
                {task.detail.duration}
              </span>
            )}
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: expanded ? 'var(--accent-gold)' : 'var(--text-tertiary)' }}
            >
              <span>{expanded ? '↑ hide' : '↓ how to do this'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && task.detail && (
        <div
          style={{
            borderTop: '1px solid var(--divider)',
            padding: 'var(--space-4)',
            paddingTop: 'var(--space-3)',
            background: 'var(--layer-1)',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          }}
          className="animate-in space-y-3"
        >
          {/* Output */}
          {task.detail.output && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-faint)' }}>
                Output
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                {task.detail.output}
              </p>
            </div>
          )}

          {/* Why */}
          {task.detail.why && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-faint)' }}>
                Why this matters
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                {task.detail.why}
              </p>
            </div>
          )}

          {/* Steps */}
          {task.detail.steps?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-faint)' }}>
                Steps
              </p>
              <ol className="space-y-2">
                {task.detail.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: v.dimColor, color: v.color }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DailyHQ({ completedTasks, setCompletedTasks, xpToday, xpTotal, streak, onXpEarned, onCallLogged }) {
  const today = new Date()
  const dayIndex = today.getDay()
  const tasks = getTasksForDay(dayIndex)
  const todayKey = today.toISOString().split('T')[0]
  const tasksDoneToday = completedTasks[todayKey] || {}

  const dateStr = today.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  function toggleTask(task) {
    const isDone = !!tasksDoneToday[task.id]
    setCompletedTasks(prev => {
      const dayTasks = { ...(prev[todayKey] || {}) }
      if (isDone) delete dayTasks[task.id]
      else dayTasks[task.id] = true
      return { ...prev, [todayKey]: dayTasks }
    })
    onXpEarned(isDone ? -task.xp : task.xp)
  }

  const totalTasks = tasks.length
  const doneTasks = Object.keys(tasksDoneToday).filter(id => tasks.find(t => t.id === id)).length
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div style={{ maxWidth: '720px' }} className="space-y-5">
      {/* Daily Prep Panel */}
      <DailyPrep onXpEarned={onXpEarned} onCallLogged={onCallLogged} />

      {/* Date header */}
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <h1
            className="font-bold leading-tight"
            style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', letterSpacing: '-0.025em', fontWeight: 700 }}
          >
            {DAY_NAMES[dayIndex]}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
            {dateStr}
          </p>
        </div>
        <div className="text-right pt-1">
          <div
            className="font-bold"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: completionPct === 100 ? 'var(--success)' : 'var(--accent-gold)',
            }}
          >
            {completionPct}%
          </div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
            {doneTasks} of {totalTasks} done
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar xpToday={xpToday} xpTotal={xpTotal} streak={streak} />

      {/* Day progress bar */}
      <div
        style={{
          height: '2px',
          background: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${completionPct}%`,
            background: completionPct === 100 ? 'var(--color-success)' : 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* Tasks by period */}
      {PERIODS.map(period => {
        const periodTasks = tasks.filter(t => t.period === period)
        if (periodTasks.length === 0) return null
        return (
          <div key={period} className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              {PERIOD_LABELS[period]}
            </p>
            {periodTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                done={!!tasksDoneToday[task.id]}
                onToggle={() => toggleTask(task)}
              />
            ))}
          </div>
        )
      })}

      {/* All done state */}
      {completionPct === 100 && (
        <div
          className="text-center py-5 animate-in"
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--layer-2)',
          }}
        >
          <p className="font-semibold" style={{ color: 'var(--success)' }}>
            All tasks complete
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
            Streak extends tomorrow.
          </p>
        </div>
      )}
    </div>
  )
}
