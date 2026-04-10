import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_METRICS } from './data/metrics'
import { getTasksForDay } from './data/tasks'
import DailyHQ from './components/DailyHQ'
import WeeklyTimetable from './components/WeeklyTimetable'
import MissionControl from './components/MissionControl'
import ProspectPipeline from './components/ProspectPipeline'
import CallTracker from './components/CallTracker'
import ThemeEditor from './components/ThemeEditor'

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
          background: 'rgba(22, 24, 34, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--space-3) var(--space-8)',
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gold-muted)',
                border: '1px solid var(--border-medium)',
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
                  background: 'var(--accent-gold)',
                }}
              />
            </div>
            <span
              className="font-semibold"
              style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)', letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}
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
                style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}
              >
                {streak}-day streak
              </span>
            </div>
            <div
              className="font-semibold"
              style={{ color: 'var(--accent-gold)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}
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
            padding: 'var(--space-2) var(--space-8)',
            display: 'flex',
            gap: 'var(--space-1)',
          }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '6px 16px',
                background: tab === t.id ? 'rgba(232, 196, 104, 0.12)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: tab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: tab === t.id ? 600 : 500,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'all var(--duration-base) var(--ease-out)',
              }}
              onMouseEnter={e => {
                if (tab !== t.id) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (tab !== t.id) {
                  e.currentTarget.style.color = 'var(--text-tertiary)'
                  e.currentTarget.style.background = 'transparent'
                }
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
          padding: 'var(--space-8)',
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
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--layer-1)',
          padding: 'var(--space-4) var(--space-8)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-xs)',
        }}
      >
        Advisor HQ · {new Date().getFullYear()} · DTS · AIMyBiz · Athletics
      </footer>

      <ThemeEditor />
    </div>
  )
}
