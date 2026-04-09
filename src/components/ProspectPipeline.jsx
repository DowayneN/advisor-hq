import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { VENTURES } from '../data/tasks'

const STAGES = [
  { id: 'contacted', label: 'Contacted',   color: 'var(--color-text-faint)',  dim: 'var(--color-surface-2)' },
  { id: 'replied',   label: 'Replied',     color: 'var(--venture-dts)',       dim: 'var(--venture-dts-dim)' },
  { id: 'demo',      label: 'Demo Booked', color: 'var(--color-accent)',      dim: 'var(--color-accent-dim)' },
  { id: 'won',       label: 'Won',         color: 'var(--color-success)',     dim: 'rgba(74,124,89,0.12)' },
]

const STAGE_ORDER = STAGES.map(s => s.id)

const SEED_PROSPECTS = [
  {
    id: 'prospect_feb_closecoach',
    name: 'Paused CloseCoach Lead',
    company: 'Unknown (Feb contact)',
    venture: 'aimybiz',
    type: 'closecoach',
    stage: 'replied',
    addedDate: '2026-02-01',
    lastContact: '2026-02-01',
    notes: 'Paused due to CRM development. Said to circle back end of March. Wants AI system so new hires can learn full sales script without supervision. Follow up now — overdue.',
    value: 0,
  },
]

function genId() {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

function EmptyStage({ label }) {
  return (
    <div
      style={{
        border: '1px dashed var(--color-border-soft)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3)',
        textAlign: 'center',
        color: 'var(--color-text-faint)',
        fontSize: 'var(--text-xs)',
      }}
    >
      No {label.toLowerCase()} yet
    </div>
  )
}

function ProspectCard({ prospect, onMove, onDelete, onEdit }) {
  const [showNote, setShowNote] = useState(false)
  const stageIndex = STAGE_ORDER.indexOf(prospect.stage)
  const v = VENTURES[prospect.venture] || {}

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.3 }}>
            {prospect.name}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {prospect.company}
          </p>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: v.color,
            background: v.dimColor,
            borderRadius: 'var(--radius-full)',
            padding: '2px 8px',
            flexShrink: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {prospect.type === 'closecoach' ? 'CloseCoach' : prospect.type === 'webdev' ? 'Web Dev' : v.label}
        </span>
      </div>

      {prospect.value > 0 && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginTop: '4px' }}>
          £{prospect.value.toLocaleString()} potential
        </p>
      )}

      {/* Notes toggle */}
      {prospect.notes && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <button
            onClick={() => setShowNote(n => !n)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '10px',
              color: 'var(--color-text-faint)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {showNote ? '↑ hide notes' : '↓ notes'}
          </button>
          {showNote && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.6 }}>
              {prospect.notes}
            </p>
          )}
        </div>
      )}

      {/* Last contact */}
      <p style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginTop: 'var(--space-2)' }}>
        Last contact: {prospect.lastContact}
      </p>

      {/* Move buttons */}
      <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 'var(--space-2)' }}>
        {stageIndex > 0 && (
          <button
            onClick={() => onMove(prospect.id, STAGE_ORDER[stageIndex - 1])}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '3px 8px',
              fontSize: '10px',
              color: 'var(--color-text-faint)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            ← Back
          </button>
        )}
        {stageIndex < STAGE_ORDER.length - 1 && (
          <button
            onClick={() => onMove(prospect.id, STAGE_ORDER[stageIndex + 1])}
            style={{
              background: 'var(--color-accent-dim)',
              border: '1px solid var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '3px 8px',
              fontSize: '10px',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            {STAGES[stageIndex + 1]?.label} →
          </button>
        )}
        <button
          onClick={() => onDelete(prospect.id)}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            padding: '3px 6px',
            fontSize: '10px',
            color: 'var(--color-text-faint)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function AddProspectForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    name: '', company: '', venture: 'aimybiz', type: 'closecoach',
    notes: '', value: '', stage: 'contacted',
  })

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.company.trim()) return
    onAdd({
      id: genId(),
      ...form,
      value: parseInt(form.value) || 0,
      addedDate: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
    })
  }

  const inputStyle = {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-2) var(--space-2)',
    color: 'var(--color-text)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'inherit',
    width: '100%',
    outline: 'none',
  }

  return (
    <form onSubmit={submit} className="space-y-3" style={{ marginTop: 'var(--space-4)' }}>
      <p className="font-semibold" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
        Add Prospect
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <input
          style={inputStyle}
          placeholder="Name / Company"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          style={inputStyle}
          placeholder="Company"
          value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
        <select
          style={inputStyle}
          value={form.venture}
          onChange={e => setForm(f => ({ ...f, venture: e.target.value }))}
        >
          <option value="aimybiz">AIMyBiz</option>
          <option value="dts">DTS</option>
          <option value="athletics">Athletics</option>
        </select>
        <select
          style={inputStyle}
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
        >
          <option value="closecoach">CloseCoach</option>
          <option value="webdev">Web Dev</option>
          <option value="other">Other</option>
        </select>
        <input
          style={inputStyle}
          placeholder="£ Value"
          type="number"
          value={form.value}
          onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
        />
      </div>
      <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ProspectPipeline() {
  const [prospects, setProspects] = useLocalStorage('advisor_pipeline', SEED_PROSPECTS)
  const [showAdd, setShowAdd] = useState(false)

  function moveProspect(id, newStage) {
    setProspects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, stage: newStage, lastContact: new Date().toISOString().split('T')[0] }
          : p
      )
    )
  }

  function deleteProspect(id) {
    setProspects(prev => prev.filter(p => p.id !== id))
  }

  function addProspect(prospect) {
    setProspects(prev => [...prev, prospect])
    setShowAdd(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h2
            className="font-bold"
            style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text)', lineHeight: 1.2 }}
          >
            Prospect Pipeline
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', marginTop: '2px' }}>
            {prospects.length} total · {prospects.filter(p => p.stage === 'won').length} won
          </p>
        </div>
        <button
          onClick={() => setShowAdd(s => !s)}
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            opacity: showAdd ? 0.7 : 1,
          }}
        >
          + Add Prospect
        </button>
      </div>

      {showAdd && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <AddProspectForm onAdd={addProspect} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* Kanban */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
        }}
      >
        {STAGES.map(stage => {
          const stageProspects = prospects.filter(p => p.stage === stage.id)
          return (
            <div key={stage.id}>
              {/* Column header */}
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-2)', borderBottom: `2px solid ${stage.color}` }}
              >
                <span
                  className="font-semibold"
                  style={{ fontSize: 'var(--text-xs)', color: stage.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  {stage.label}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    background: stage.dim,
                    color: stage.color,
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 7px',
                    fontWeight: 600,
                  }}
                >
                  {stageProspects.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {stageProspects.length === 0
                  ? <EmptyStage label={stage.label} />
                  : stageProspects.map(p => (
                    <ProspectCard
                      key={p.id}
                      prospect={p}
                      onMove={moveProspect}
                      onDelete={deleteProspect}
                    />
                  ))
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
