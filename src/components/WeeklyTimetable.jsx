import { useState } from 'react'
import { getTasksForDay, VENTURES, DAY_SHORT, WEEK_SCHEDULE } from '../data/tasks'

function getDayKey(dayIndex) {
  const now = new Date()
  const diff = dayIndex - now.getDay()
  const d = new Date(now)
  d.setDate(now.getDate() + diff)
  return d.toISOString().split('T')[0]
}

export default function WeeklyTimetable({ completedTasks }) {
  const [expandedDay, setExpandedDay] = useState(null)
  const today = new Date().getDay()

  // Week order: Mon → Sun
  const weekOrder = [1, 2, 3, 4, 5, 6, 0]

  return (
    <div style={{ maxWidth: '720px' }} className="space-y-5">
      <div>
        <h1
          className="font-bold"
          style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text)' }}
        >
          Weekly Timetable
        </h1>
        <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
          Select a day to see its tasks
        </p>
      </div>

      {/* Day cards grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekOrder.map(dayIdx => {
          const tasks = getTasksForDay(dayIdx)
          const schedule = WEEK_SCHEDULE[dayIdx]
          const dayKey = getDayKey(dayIdx)
          const doneTasks = completedTasks[dayKey] || {}
          const doneCount = Object.keys(doneTasks).filter(id => tasks.find(t => t.id === id)).length
          const donePct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0
          const isToday = dayIdx === today
          const isExpanded = expandedDay === dayIdx

          return (
            <button
              key={dayIdx}
              onClick={() => setExpandedDay(isExpanded ? null : dayIdx)}
              style={{
                background: isExpanded ? 'var(--color-surface-2)' : 'var(--color-surface)',
                border: `1px solid ${isToday ? 'var(--color-accent)' : isExpanded ? 'var(--color-border)' : 'var(--color-border-soft)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                boxShadow: isToday ? 'none' : 'var(--shadow-sm)',
              }}
            >
              {/* Day name */}
              <div
                className="font-semibold"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: isToday ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  marginBottom: '4px',
                }}
              >
                {DAY_SHORT[dayIdx]}
              </div>

              {/* Theme label */}
              <div
                style={{
                  fontSize: '0.55rem',
                  color: 'var(--color-text-faint)',
                  lineHeight: 1.3,
                  marginBottom: '8px',
                  minHeight: '2.2em',
                }}
              >
                {schedule.theme}
              </div>

              {/* Venture dots */}
              <div className="flex flex-wrap justify-center gap-1 mb-2">
                {schedule.focus.map(v => (
                  <div
                    key={v}
                    title={VENTURES[v].tag}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: VENTURES[v].color,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '3px',
                  background: 'var(--color-surface-3)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${donePct}%`,
                    background: donePct === 100 ? 'var(--color-success)' : 'var(--color-accent)',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.55rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                {donePct}%
              </div>
            </button>
          )
        })}
      </div>

      {/* Venture legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(VENTURES).map(([key, v]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.color }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{v.tag}</span>
          </div>
        ))}
      </div>

      {/* Expanded day panel */}
      {expandedDay !== null && (
        <ExpandedDay
          dayIndex={expandedDay}
          completedTasks={completedTasks[getDayKey(expandedDay)] || {}}
        />
      )}
    </div>
  )
}

function ExpandedDay({ dayIndex, completedTasks }) {
  const tasks = getTasksForDay(dayIndex)
  const schedule = WEEK_SCHEDULE[dayIndex]
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div
      className="animate-in space-y-3"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
            {dayNames[dayIndex]}
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            {schedule.theme}
          </p>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
          {tasks.length} tasks
        </div>
      </div>

      {/* Task list */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          paddingTop: 'var(--space-3)',
        }}
        className="space-y-2"
      >
        {tasks.map(task => {
          const done = !!completedTasks[task.id]
          const v = VENTURES[task.venture]
          return (
            <div
              key={task.id}
              className="flex items-center gap-3"
              style={{ opacity: done ? 0.45 : 1 }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: done ? 'var(--color-text-faint)' : v.color,
                  flexShrink: 0,
                }}
              />
              <span
                className="flex-1 text-sm"
                style={{
                  color: done ? 'var(--color-text-faint)' : 'var(--color-text-muted)',
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                {task.label}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: v.color }}
                >
                  {v.label}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--color-text-faint)' }}
                >
                  +{task.xp}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
