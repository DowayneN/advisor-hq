import { useState } from 'react'
import { Phone, Edit3, Plus, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { OUTCOME_CONFIG } from '../data/dailyPrep'

const STATUS_ORDER  = ['interested', 'follow_up', 'not_now', 'no_answer']
const STATUS_LABELS = { interested: 'Interested', follow_up: 'Follow Up', not_now: 'Not Now', no_answer: 'No Answer' }
const STATUS_COLOR  = {
  interested: 'var(--success)',
  follow_up:  'var(--accent-gold)',
  not_now:    'var(--text-tertiary)',
  no_answer:  'var(--text-tertiary)',
}
const STATUS_BG = {
  interested: 'rgba(52,211,153,0.10)',
  follow_up:  'rgba(232,196,104,0.10)',
  not_now:    'var(--layer-3)',
  no_answer:  'var(--layer-3)',
}

const inputStyle = {
  width: '100%',
  background: 'var(--layer-3)',
  border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-md)',
  padding: '6px 10px',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-xs)',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const sameDay = d.toDateString() === now.toDateString()
  const yesterday = new Date(now - 86400000)
  if (sameDay) return `Today ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ` ${time}`
}

function daysSince(iso) {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

// Migrate old callNotes string → notes array
function getNotes(entry) {
  if (Array.isArray(entry.notes)) return entry.notes
  if (entry.callNotes) return [{
    id: 'note_migrated',
    text: entry.callNotes,
    createdAt: entry.createdAt || (entry.date ? entry.date + 'T09:00:00.000Z' : new Date().toISOString()),
    updatedAt: entry.createdAt || (entry.date ? entry.date + 'T09:00:00.000Z' : new Date().toISOString()),
  }]
  return []
}

function lastActivityTime(entry) {
  const notes = getNotes(entry)
  if (notes.length === 0) return entry.createdAt || null
  return notes.reduce((latest, n) => {
    const t = n.updatedAt || n.createdAt
    return !latest || t > latest ? t : latest
  }, null)
}

export default function GiMediaPipeline() {
  const [smePipeline, setSmePipeline] = useLocalStorage('advisor_sme_pipeline', {})
  const [collapsed, setCollapsed]     = useLocalStorage('advisor_gimp_collapsed', false)

  // Edit states
  const [editingContact, setEditingContact]   = useState(null)   // leadId
  const [contactDraft, setContactDraft]       = useState('')
  const [addingNote, setAddingNote]           = useState(null)   // leadId
  const [newNoteDraft, setNewNoteDraft]       = useState('')
  const [editingNote, setEditingNote]         = useState(null)   // { leadId, noteId }
  const [noteDraft, setNoteDraft]             = useState('')
  const [changingStatus, setChangingStatus]   = useState(null)   // leadId

  const entries = Object.values(smePipeline)
  if (entries.length === 0) return null

  const activeCount = entries.filter(e => e.outcome === 'interested' || e.outcome === 'follow_up').length
  const grouped = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = entries
      .filter(e => e.outcome === s)
      .sort((a, b) => (lastActivityTime(b) || '').localeCompare(lastActivityTime(a) || ''))
    return acc
  }, {})

  function saveContact(id) {
    const now = new Date().toISOString()
    setSmePipeline(prev => ({ ...prev, [id]: { ...prev[id], contactName: contactDraft, updatedAt: now } }))
    setEditingContact(null)
  }

  function saveNewNote(id) {
    if (!newNoteDraft.trim()) { setAddingNote(null); return }
    const now = new Date().toISOString()
    const existing = getNotes(smePipeline[id])
    const note = { id: `note_${Date.now()}`, text: newNoteDraft.trim(), createdAt: now, updatedAt: now }
    setSmePipeline(prev => ({ ...prev, [id]: { ...prev[id], notes: [...existing, note], updatedAt: now } }))
    setAddingNote(null)
    setNewNoteDraft('')
  }

  function saveNoteEdit(leadId, noteId) {
    if (!noteDraft.trim()) { setEditingNote(null); return }
    const now = new Date().toISOString()
    const updated = getNotes(smePipeline[leadId]).map(n =>
      n.id === noteId ? { ...n, text: noteDraft.trim(), updatedAt: now } : n
    )
    setSmePipeline(prev => ({ ...prev, [leadId]: { ...prev[leadId], notes: updated, updatedAt: now } }))
    setEditingNote(null)
  }

  function changeStatus(id, newOutcome) {
    const now = new Date().toISOString()
    setSmePipeline(prev => ({ ...prev, [id]: { ...prev[id], outcome: newOutcome, updatedAt: now } }))
    setChangingStatus(null)
  }

  return (
    <div style={{ background: 'var(--layer-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: collapsed ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>
            GIMedia Lead Pipeline
          </span>
          {activeCount > 0 && (
            <span style={{ background: 'rgba(232,196,104,0.12)', border: '1px solid rgba(232,196,104,0.25)', borderRadius: 'var(--radius-full)', padding: '1px 8px', fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {activeCount} active
            </span>
          )}
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{entries.length} total</span>
        </div>
        <span style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
          {collapsed ? <ChevronDown size={16} strokeWidth={1.75} /> : <ChevronUp size={16} strokeWidth={1.75} />}
        </span>
      </div>

      {!collapsed && (
        <div style={{ padding: 'var(--space-4)' }} className="space-y-5">
          {STATUS_ORDER.map(status => {
            const group = grouped[status]
            if (!group.length) return null

            return (
              <div key={status}>
                {/* Section heading */}
                <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: STATUS_COLOR[status], textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {STATUS_LABELS[status]}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: STATUS_COLOR[status], background: STATUS_BG[status], borderRadius: 'var(--radius-full)', padding: '0 6px' }}>
                    {group.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.map(entry => {
                    const notes       = getNotes(entry)
                    const lastActivity = lastActivityTime(entry)
                    const sinceContact = daysSince(lastActivity)
                    const isChangingThisStatus = changingStatus === entry.id

                    return (
                      <div
                        key={entry.id}
                        style={{
                          background: 'var(--layer-2)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Card header row */}
                        <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">

                              {/* Company + badges */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                                  {entry.company}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--layer-3)', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>
                                  {entry.industry}
                                </span>

                                {/* Status chip — clickable to change */}
                                <button
                                  onClick={e => { e.stopPropagation(); setChangingStatus(isChangingThisStatus ? null : entry.id) }}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    background: STATUS_BG[entry.outcome],
                                    border: `1px solid ${entry.outcome === 'interested' ? 'rgba(52,211,153,0.25)' : entry.outcome === 'follow_up' ? 'rgba(232,196,104,0.25)' : 'var(--border-subtle)'}`,
                                    borderRadius: 'var(--radius-full)', padding: '1px 8px',
                                    fontSize: '10px', color: STATUS_COLOR[entry.outcome], fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                  }}
                                >
                                  {STATUS_LABELS[entry.outcome]}
                                  <ChevronDown size={9} strokeWidth={2.5} />
                                </button>
                              </div>

                              {/* Status change inline */}
                              {isChangingThisStatus && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                  {STATUS_ORDER.map(s => (
                                    <button
                                      key={s}
                                      onClick={() => changeStatus(entry.id, s)}
                                      style={{
                                        background: entry.outcome === s ? STATUS_BG[s] : 'transparent',
                                        border: `1px solid ${entry.outcome === s ? STATUS_COLOR[s] : 'var(--border-medium)'}`,
                                        borderRadius: 'var(--radius-full)', padding: '3px 10px',
                                        fontSize: '10px',
                                        color: entry.outcome === s ? STATUS_COLOR[s] : 'var(--text-tertiary)',
                                        fontWeight: entry.outcome === s ? 600 : 400,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                      }}
                                    >
                                      {STATUS_LABELS[s]}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Location + last contact */}
                              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                                {entry.location}
                                {sinceContact && <span style={{ marginLeft: '8px', color: (status === 'follow_up' || status === 'interested') && sinceContact !== 'Today' ? 'var(--accent-gold)' : 'var(--text-tertiary)' }}>· last contact {sinceContact}</span>}
                              </p>

                              {/* Contact name row */}
                              {editingContact === entry.id ? (
                                <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
                                  <input
                                    style={{ ...inputStyle, flex: 1 }}
                                    value={contactDraft}
                                    onChange={e => setContactDraft(e.target.value)}
                                    placeholder="Contact name (e.g. Nicola — receptionist)"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === 'Enter') saveContact(entry.id); if (e.key === 'Escape') setEditingContact(null) }}
                                  />
                                  <button onClick={() => saveContact(entry.id)} style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '2px', display: 'flex' }}><Check size={14} strokeWidth={2} /></button>
                                  <button onClick={() => setEditingContact(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px', display: 'flex' }}><X size={14} strokeWidth={2} /></button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setEditingContact(entry.id); setContactDraft(entry.contactName || '') }}
                                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}
                                >
                                  {entry.contactName ? (
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                      <span style={{ color: 'var(--text-tertiary)' }}>Contact: </span>{entry.contactName}
                                      <Edit3 size={10} strokeWidth={1.75} style={{ marginLeft: '5px', color: 'var(--text-tertiary)', display: 'inline', verticalAlign: 'middle' }} />
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', textDecoration: 'underline' }}>+ Add contact name</span>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Phone + call button */}
                            <a
                              href={`tel:${entry.phone}`}
                              style={{
                                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(124,140,248,0.08)', border: '1px solid rgba(124,140,248,0.15)',
                                borderRadius: 'var(--radius-full)', padding: '4px 12px',
                                fontSize: '10px', color: 'var(--accent-blue)', textDecoration: 'none',
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              <Phone size={11} strokeWidth={1.75} />
                              {entry.phone}
                            </a>
                          </div>
                        </div>

                        {/* Notes section */}
                        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-3) var(--space-4)', background: 'var(--layer-1)' }}>

                          {/* Existing notes — newest last */}
                          {notes.length > 0 && (
                            <div className="space-y-2" style={{ marginBottom: 'var(--space-2)' }}>
                              {notes.map(note => (
                                <div key={note.id}>
                                  {editingNote?.leadId === entry.id && editingNote?.noteId === note.id ? (
                                    /* Edit mode */
                                    <div className="space-y-1">
                                      <textarea
                                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                        value={noteDraft}
                                        onChange={e => setNoteDraft(e.target.value)}
                                        rows={3}
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => saveNoteEdit(entry.id, note.id)}
                                          style={{ background: 'var(--accent-gold)', color: 'var(--layer-0)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '3px 12px', fontSize: '10px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingNote(null)}
                                          style={{ background: 'transparent', color: 'var(--text-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontSize: '10px', fontFamily: 'inherit', cursor: 'pointer' }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* View mode */
                                    <div
                                      style={{
                                        background: 'var(--layer-2)', borderRadius: 'var(--radius-sm)',
                                        padding: '6px 8px', borderLeft: `2px solid ${STATUS_COLOR[status]}`,
                                        position: 'relative',
                                      }}
                                    >
                                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3px', paddingRight: '20px' }}>
                                        {note.text}
                                      </p>
                                      <p style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>
                                        {formatTime(note.createdAt)}
                                        {note.updatedAt !== note.createdAt && (
                                          <span style={{ marginLeft: '6px', opacity: 0.7 }}>· edited {formatTime(note.updatedAt)}</span>
                                        )}
                                      </p>
                                      <button
                                        onClick={() => { setEditingNote({ leadId: entry.id, noteId: note.id }); setNoteDraft(note.text) }}
                                        style={{
                                          position: 'absolute', top: '6px', right: '6px',
                                          background: 'transparent', border: 'none', cursor: 'pointer',
                                          color: 'var(--text-tertiary)', padding: '2px', display: 'flex',
                                        }}
                                        title="Edit note"
                                      >
                                        <Edit3 size={11} strokeWidth={1.75} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add note */}
                          {addingNote === entry.id ? (
                            <div className="space-y-2">
                              <textarea
                                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                placeholder="What happened? When to call back? Who to ask for?"
                                value={newNoteDraft}
                                onChange={e => setNewNoteDraft(e.target.value)}
                                rows={3}
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Escape') { setAddingNote(null); setNewNoteDraft('') } }}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveNewNote(entry.id)}
                                  style={{ background: 'var(--accent-gold)', color: 'var(--layer-0)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '4px 14px', fontSize: '10px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
                                >
                                  Add note
                                </button>
                                <button
                                  onClick={() => { setAddingNote(null); setNewNoteDraft('') }}
                                  style={{ background: 'transparent', color: 'var(--text-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: '10px', fontFamily: 'inherit', cursor: 'pointer' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingNote(entry.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-tertiary)', fontSize: '10px',
                                fontFamily: 'inherit', padding: 0,
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                            >
                              <Plus size={12} strokeWidth={2} />
                              Add note
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
