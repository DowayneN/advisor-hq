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
    <div style={{ width: '100%' }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
            Weekly Timetable
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {expandedDay !== null ? `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][expandedDay]} selected — click again to collapse` : 'Select a day to see its tasks'}
          </p>
        </div>
        {/* Venture legend */}
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(VENTURES).map(([key, v]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: v.color }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{v.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width 7-day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
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
                background: isExpanded ? 'rgba(232,196,104,0.08)' : 'var(--layer-2)',
                border: `1px solid ${isToday ? 'var(--accent-gold)' : isExpanded ? 'rgba(232,196,104,0.4)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isToday ? 'var(--shadow-gold)' : isExpanded ? 'none' : 'var(--shadow-sm)',
                minHeight: '130px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => {
                if (!isExpanded) {
                  e.currentTarget.style.borderColor = 'var(--border-medium)'
                  e.currentTarget.style.background = 'var(--layer-3)'
                }
              }}
              onMouseLeave={e => {
                if (!isExpanded) {
                  e.currentTarget.style.borderColor = isToday ? 'var(--accent-gold)' : 'var(--border-subtle)'
                  e.currentTarget.style.background = 'var(--layer-2)'
                }
              }}
            >
              {/* Day name */}
              <div
                className="font-bold"
                style={{
                  fontSize: 'var(--text-base)',
                  color: isToday ? 'var(--accent-gold)' : isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {DAY_SHORT[dayIdx]}
              </div>

              {/* Theme label */}
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  lineHeight: 1.4,
                  margin: '6px 0',
                }}
              >
                {schedule.theme}
              </div>

              {/* Venture dots */}
              <div className="flex flex-wrap justify-center gap-1">
                {schedule.focus.map(v => (
                  <div
                    key={v}
                    title={VENTURES[v].tag}
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: VENTURES[v].color,
                    }}
                  />
                ))}
              </div>

              {/* Progress */}
              <div style={{ width: '100%', marginTop: '10px' }}>
                <div
                  style={{
                    height: '3px',
                    background: 'var(--layer-3)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${donePct}%`,
                      background: donePct === 100 ? 'var(--success)' : 'var(--accent-gold)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {donePct}%
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Expanded day panel — full width below */}
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
      className="animate-in"
      style={{
        background: 'var(--layer-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {dayNames[dayIndex]}
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {schedule.theme}
          </p>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {tasks.length} tasks
        </div>
      </div>

      {/* Task list */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
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
                  background: done ? 'var(--text-tertiary)' : v.color,
                  flexShrink: 0,
                }}
              />
              <span
                className="flex-1 text-sm"
                style={{
                  color: done ? 'var(--text-tertiary)' : 'var(--text-secondary)',
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
                  style={{ color: 'var(--text-tertiary)' }}
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
