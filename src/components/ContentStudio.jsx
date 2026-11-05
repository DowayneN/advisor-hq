import { useState } from 'react'
import { ChevronDown, ChevronUp, Lock, Film, Image as ImageIcon, Type, Layers, Clapperboard, Smartphone, Square, MonitorPlay } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { privateData } from '../privateModules'
import FORMATS from '../data/contentFormats.json'

const ACCENT = 'var(--venture-aimybiz)'
const ACCENT_DIM = 'var(--venture-aimybiz-dim)'
const PLAN = privateData('content-plan') ?? { series: 'Content plan', pieces: [] }
const STATUS_IDS = FORMATS.statuses.map(s => s.id)

const label = {
  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
}
const panel = {
  background: 'var(--layer-2)', border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
}

function formatWeek(iso) {
  if (!iso) return 'Unscheduled'
  const d = new Date(iso + 'T00:00:00')
  return 'w/c ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/* ── Status track: five steps, click to set ─────────────────────────────── */
function StatusTrack({ status, onChange, locked }) {
  const current = STATUS_IDS.indexOf(status)
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {FORMATS.statuses.map((s, i) => {
        const done = i <= current
        const blocked = locked && s.id === 'posted'
        return (
          <button
            key={s.id}
            disabled={blocked}
            title={blocked ? 'On hold: cannot be posted yet' : `Set to ${s.label}`}
            onClick={e => { e.stopPropagation(); onChange(s.id) }}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${done ? ACCENT : 'var(--border-subtle)'}`,
              background: i === current ? ACCENT_DIM : 'transparent',
              color: blocked ? 'var(--text-disabled)' : done ? ACCENT : 'var(--text-tertiary)',
              fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: blocked ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {blocked && <Lock size={10} />}
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── One piece of content ───────────────────────────────────────────────── */
function PieceCard({ piece, status, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const held = !!piece.hold

  return (
    <div style={{ ...panel, borderColor: held ? 'rgba(251,191,36,0.25)' : 'var(--border-subtle)' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', cursor: 'pointer' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 700,
          color: ACCENT, minWidth: '28px',
        }}>
          {String(piece.order).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={label}>{formatWeek(piece.targetWeek)}</span>
            {held && (
              <span style={{
                ...label, color: 'var(--warning)', background: 'var(--warning-bg)',
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}>
                <Lock size={10} /> On hold
              </span>
            )}
          </div>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>
            {piece.title}
          </div>
          <StatusTrack status={status} onChange={onStatusChange} locked={held} />
          {held && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--warning)', marginTop: 'var(--space-2)' }}>
              {piece.hold.reason}
            </div>
          )}
        </div>
        <div style={{ color: 'var(--text-tertiary)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {FORMATS.structure.map(beat => {
              const b = piece.structure?.[beat.id]
              if (!b) return null
              return (
                <div key={beat.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <div style={{ ...label, color: ACCENT }}>{beat.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{beat.seconds}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.text}</div>
                    {b.broll && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', marginTop: '4px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <Film size={11} style={{ marginTop: '2px', flexShrink: 0 }} /> {b.broll}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <div style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ ...label, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-2)' }}><Smartphone size={11} /> Shorts</div>
              {piece.shorts?.map(s => (
                <div key={s.title} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {s.title} <span style={{ color: 'var(--text-disabled)' }}>· {s.beat}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ ...label, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-2)' }}><Square size={11} /> LinkedIn</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{piece.linkedin}</div>
            </div>
            <div style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ ...label, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-2)' }}><ImageIcon size={11} /> Thumbnail</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{piece.thumbnail?.text}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{piece.thumbnail?.visual}</div>
            </div>
          </div>

          {(piece.sources?.length > 0 || piece.notes) && (
            <div style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ ...label, marginBottom: 'var(--space-2)' }}>Sources and notes</div>
              {piece.sources?.map(s => (
                <div key={s.what} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: 1.5 }}>
                  {s.url
                    ? <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{s.what}</a>
                    : s.what}
                  <span style={{ color: 'var(--text-disabled)' }}> · checked {s.checked}</span>
                </div>
              ))}
              {piece.notes && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)', lineHeight: 1.5 }}>{piece.notes}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Formats reference ──────────────────────────────────────────────────── */
function RuleList({ icon: Icon, title, rules, children }) {
  return (
    <div style={panel}>
      <div style={{ ...label, color: ACCENT, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <Icon size={12} /> {title}
      </div>
      {children}
      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rules.map(r => (
          <li key={r} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{r}</li>
        ))}
      </ul>
    </div>
  )
}

function StackCaptionPreview() {
  return (
    <div style={{
      background: 'var(--layer-0)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
      textAlign: 'center', marginBottom: 'var(--space-3)', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', opacity: 0.7 }}>we're locked in with</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        <span style={{ color: '#22D3EE' }}>BT</span>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', opacity: 0.45 }}>until next spring</div>
    </div>
  )
}

function FormatsView() {
  const cutIcons = { youtube: MonitorPlay, shorts: Smartphone, linkedin: Square }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={panel}>
        <div style={{ ...label, color: ACCENT, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <Layers size={12} /> Structure for every piece
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-3)' }}>
          {FORMATS.structure.map((b, i) => (
            <div key={b.id} style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-disabled)' }}>{i + 1} · {b.seconds}</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 4px' }}>{b.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{b.guide}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={panel}>
        <div style={{ ...label, color: ACCENT, display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <Clapperboard size={12} /> One recording, three cuts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          {FORMATS.cuts.map(c => {
            const Icon = cutIcons[c.id] ?? Film
            return (
              <div key={c.id} style={{ background: 'var(--layer-1)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Icon size={13} /> {c.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: ACCENT, margin: '4px 0' }}>
                  {c.aspect} · {c.size} · {c.length}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{c.notes}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        <RuleList icon={Type} title={`Captions: ${FORMATS.captions.style}`} rules={FORMATS.captions.rules}>
          <StackCaptionPreview />
        </RuleList>
        <RuleList icon={Film} title="B-roll" rules={FORMATS.broll.rules} />
        <RuleList icon={ImageIcon} title={`Thumbnail · ${FORMATS.thumbnail.size}`} rules={FORMATS.thumbnail.rules} />
        <RuleList icon={Clapperboard} title="Video format" rules={FORMATS.videoFormat.rules} />
      </div>
    </div>
  )
}

/* ── Tab ────────────────────────────────────────────────────────────────── */
export default function ContentStudio() {
  const [view, setView] = useState('plan')
  const [statuses, setStatuses] = useLocalStorage('advisor_content_status', () =>
    Object.fromEntries(PLAN.pieces.map(p => [p.id, p.status ?? 'idea']))
  )

  const pieces = [...PLAN.pieces].sort((a, b) => a.order - b.order)
  const statusOf = p => statuses[p.id] ?? p.status ?? 'idea'
  const setStatus = (id, s) => setStatuses(prev => ({ ...prev, [id]: s }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ ...label, color: ACCENT }}>CloseCoach · build in public</div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            {PLAN.series}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
            One recording a week, cut three ways. Every piece follows the same five beats.
          </p>
        </div>
        <div style={{ ...panel, display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-3) var(--space-4)' }}>
          {FORMATS.statuses.map(s => (
            <div key={s.id} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.id === 'posted' ? 'var(--success)' : 'var(--text-primary)' }}>
                {pieces.filter(p => statusOf(p) === s.id).length}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {[['plan', 'Plan'], ['formats', 'Formats']].map(([id, text]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              border: `1px solid ${view === id ? ACCENT : 'var(--border-subtle)'}`,
              background: view === id ? ACCENT_DIM : 'transparent',
              color: view === id ? ACCENT : 'var(--text-tertiary)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {view === 'plan' && (
        pieces.length === 0 ? (
          <div style={{ ...panel, color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
            No content plan in this copy. Add src/private/content-plan.json to see it.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pieces.map(p => (
              <PieceCard key={p.id} piece={p} status={statusOf(p)} onStatusChange={s => setStatus(p.id, s)} />
            ))}
          </div>
        )
      )}
      {view === 'formats' && <FormatsView />}
    </div>
  )
}
