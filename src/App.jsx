import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_METRICS } from './data/metrics'
import { getTasksForDay } from './data/tasks'
import DailyHQ from './components/DailyHQ'
import WeeklyTimetable from './components/WeeklyTimetable'
import MissionControl from './components/MissionControl'
import ProspectPipeline from './components/ProspectPipeline'
import CallTracker from './components/CallTracker'

const TABS = [
  { id: 'daily',    label: 'Daily HQ' },
  { id: 'weekly',   label: 'Weekly' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'mission',  label: 'Mission Control' },
]

function getDateKey() {
  return new Date().toISOString().split('T')[0]
}

export default function App() {
  const [tab, setTab] = useState('daily')

  const [completedTasks, setCompletedTasks] = useLocalStorage('advisor_completed_tasks', {})
  const [metrics, setMetrics]               = useLocalStorage('advisor_metrics', DEFAULT_METRICS)
  const [xpTotal, setXpTotal]               = useLocalStorage('advisor_xp_total', 0)
  const [streak, setStreak]                 = useLocalStorage('advisor_streak', 0)
  const [lastActiveDate, setLastActiveDate] = useLocalStorage('advisor_last_active', null)
  const [pendingCalls, setPendingCalls]     = useState([])

  const todayKey       = getDateKey()
  const todayCompleted = completedTasks[todayKey] || {}
  const todayTasks     = getTasksForDay(new Date().getDay())
  const xpToday        = todayTasks
    .filter(t => todayCompleted[t.id])
    .reduce((sum, t) => sum + t.xp, 0)

  function handleXpEarned(amount) {
    setXpTotal(prev => Math.max(0, prev + amount))
    if (amount > 0) {
      const today = getDateKey()
      if (lastActiveDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yKey = yesterday.toISOString().split('T')[0]
        setStreak(prev => lastActiveDate === yKey ? prev + 1 : 1)
        setLastActiveDate(today)
      }
    }
  }

  function handleCallLogged(call) {
    setPendingCalls(prev => [...prev, call])
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* Header */}
      <header
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border-soft)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--space-3) var(--space-5)',
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-dim)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                }}
              />
            </div>
            <span
              className="font-semibold"
              style={{ color: 'var(--color-text)', fontSize: 'var(--text-base)' }}
            >
              Advisor HQ
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)' }}>🔥</span>
              <span
                className="font-medium"
                style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}
              >
                {streak}-day streak
              </span>
            </div>
            <div
              className="font-mono font-semibold"
              style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}
            >
              {xpTotal.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 var(--space-5)',
            display: 'flex',
            gap: 0,
          }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.id
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
                color: tab === t.id
                  ? 'var(--color-text)'
                  : 'var(--color-text-faint)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                fontWeight: tab === t.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                lineHeight: 1.4,
              }}
              onMouseEnter={e => {
                if (tab !== t.id) e.target.style.color = 'var(--color-text-muted)'
              }}
              onMouseLeave={e => {
                if (tab !== t.id) e.target.style.color = 'var(--color-text-faint)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--space-5)',
        }}
      >
        {tab === 'daily' && (
          <DailyHQ
            completedTasks={completedTasks}
            setCompletedTasks={setCompletedTasks}
            xpToday={xpToday}
            xpTotal={xpTotal}
            streak={streak}
            onXpEarned={handleXpEarned}
            onCallLogged={handleCallLogged}
          />
        )}
        {tab === 'weekly' && (
          <WeeklyTimetable completedTasks={completedTasks} />
        )}
        {tab === 'pipeline' && (
          <div className="space-y-7">
            <ProspectPipeline />
            <div style={{ borderTop: '1px solid var(--color-border-soft)', paddingTop: 'var(--space-6)' }}>
              <CallTracker
                externalCalls={pendingCalls}
                onXpEarned={handleXpEarned}
              />
            </div>
          </div>
        )}
        {tab === 'mission' && (
          <MissionControl metrics={metrics} setMetrics={setMetrics} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-soft)',
          padding: 'var(--space-4) var(--space-5)',
          textAlign: 'center',
          color: 'var(--color-text-faint)',
          fontSize: 'var(--text-xs)',
        }}
      >
        Advisor HQ · {new Date().getFullYear()} · DTS · AIMyBiz · Athletics
      </footer>
    </div>
  )
}
