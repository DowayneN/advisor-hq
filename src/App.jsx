import { useState } from 'react'
import { Clock, CalendarDays, BarChart3, Radar, Flame } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_METRICS } from './data/metrics'
import { getTasksForDay } from './data/tasks'
import DailyHQ from './components/DailyHQ'
import WeeklyTimetable from './components/WeeklyTimetable'
import MissionControl from './components/MissionControl'
import ProspectPipeline from './components/ProspectPipeline'
import CallTracker from './components/CallTracker'
import GiMediaPipeline from './components/GiMediaPipeline'
import ThemeEditor from './components/ThemeEditor'

const TABS = [
  { id: 'daily',    label: 'Daily HQ',        Icon: Clock },
  { id: 'weekly',   label: 'Weekly',           Icon: CalendarDays },
  { id: 'pipeline', label: 'Pipeline',         Icon: BarChart3 },
  { id: 'mission',  label: 'Mission Control',  Icon: Radar },
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
  const [pipelineFilter, setPipelineFilter] = useLocalStorage('advisor_pipeline_filter', 'all')
  const [xpBonusToday, setXpBonusToday]    = useLocalStorage(`advisor_xp_bonus_${getDateKey()}`, 0)

  const todayKey       = getDateKey()
  const todayCompleted = completedTasks[todayKey] || {}
  const todayTasks     = getTasksForDay(new Date().getDay())
  const xpFromTasks    = todayTasks
    .filter(t => todayCompleted[t.id])
    .reduce((sum, t) => sum + t.xp, 0)
  const xpToday        = xpFromTasks + xpBonusToday

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

  // Bonus XP (calls, messages, ideas) — tracked separately so it contributes to the daily bar
  function handleBonusXpEarned(amount) {
    setXpTotal(prev => Math.max(0, prev + amount))
    setXpBonusToday(prev => Math.max(0, prev + amount))
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

  const DAILY_XP_TARGET = 200
  const xpPct = Math.min(100, Math.round((xpToday / DAILY_XP_TARGET) * 100))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

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
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--space-3) var(--space-5)',
            gap: 'var(--space-4)',
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
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

          {/* Daily XP bar — centre */}
          <div style={{ flex: 1, maxWidth: '260px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Daily XP
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
                {xpToday} / {DAILY_XP_TARGET}
              </span>
            </div>
            <div style={{ height: '3px', background: 'var(--layer-3)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${xpPct}%`,
                  background: xpPct >= 100 ? 'var(--success)' : 'var(--accent-gold)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5" style={{ flexShrink: 0, marginLeft: 'auto' }}>
            <div className="flex items-center gap-1.5">
              <Flame size={16} strokeWidth={2} style={{ color: 'var(--accent-gold)' }} />
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
            padding: 'var(--space-2) var(--space-5)',
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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <t.Icon
                size={16}
                strokeWidth={1.75}
                style={{ color: tab === t.id ? 'var(--accent-gold)' : 'var(--smoke)' }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main — flex: 1 pushes footer to bottom */}
      <main style={{ flex: 1 }}>
        <div
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
              onBonusXpEarned={handleBonusXpEarned}
              onCallLogged={handleCallLogged}
            />
          )}
          {tab === 'weekly' && (
            <WeeklyTimetable completedTasks={completedTasks} />
          )}
          {tab === 'pipeline' && (
            <div className="space-y-5">
              {/* Filter chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all',         label: 'All' },
                  { id: 'gimedia',     label: 'Website Builds' },
                  { id: 'closecoach',  label: 'CloseCoach' },
                  { id: 'dts',         label: 'DTS' },
                  { id: 'athletics',   label: 'Athletics' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setPipelineFilter(f.id)}
                    style={{
                      padding: '5px 14px',
                      background: pipelineFilter === f.id ? 'rgba(232,196,104,0.12)' : 'var(--layer-2)',
                      border: `1px solid ${pipelineFilter === f.id ? 'rgba(232,196,104,0.35)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      color: pipelineFilter === f.id ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                      fontWeight: pipelineFilter === f.id ? 600 : 400,
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Website Builds — GIMedia cold call pipeline */}
              {(pipelineFilter === 'all' || pipelineFilter === 'gimedia') && (
                <GiMediaPipeline />
              )}

              {/* CloseCoach — LinkedIn prospects + call tracker */}
              {(pipelineFilter === 'all' || pipelineFilter === 'closecoach') && (
                <div
                  className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6"
                  style={{ alignItems: 'start' }}
                >
                  <ProspectPipeline />
                  <CallTracker
                    externalCalls={pendingCalls}
                    onXpEarned={handleXpEarned}
                  />
                </div>
              )}

              {/* DTS placeholder */}
              {(pipelineFilter === 'dts') && (
                <div style={{
                  background: 'var(--layer-2)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    DTS pipeline coming soon · focus is marketing &amp; growth loops
                  </p>
                </div>
              )}

              {/* Athletics placeholder */}
              {(pipelineFilter === 'athletics') && (
                <div style={{
                  background: 'var(--layer-2)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    Athletics pipeline coming soon · focus is content consistency
                  </p>
                </div>
              )}
            </div>
          )}
          {tab === 'mission' && (
            <MissionControl metrics={metrics} setMetrics={setMetrics} />
          )}
        </div>
      </main>

      {/* Footer — always at bottom */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--layer-1)',
          padding: 'var(--space-3) var(--space-5)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-xs)',
          flexShrink: 0,
        }}
      >
        Advisor HQ · {new Date().getFullYear()} · DTS · AIMyBiz · Athletics
      </footer>

      <ThemeEditor />
    </div>
  )
}
