import { useState } from 'react'

export default function MetricInput({ venture, field, currentValue, onSave, onClose }) {
  const [value, setValue] = useState(String(currentValue))

  function handleSave() {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      onSave(num)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full space-y-4 animate-in"
        style={{
          maxWidth: '360px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div>
          <h3
            className="font-semibold"
            style={{ color: 'var(--color-text)', fontSize: 'var(--text-md)' }}
          >
            {field.label}
          </h3>
          <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {venture.label} · Target: {field.prefix}{field.target.toLocaleString()}{field.suffix}
          </p>
        </div>

        {/* Input */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--color-text-faint)' }}
          >
            Current value
          </label>
          <div className="flex items-center gap-2">
            {field.prefix && (
              <span style={{ color: 'var(--color-text-muted)' }}>{field.prefix}</span>
            )}
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              style={{
                flex: 1,
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2) var(--space-3)',
                color: 'var(--color-text)',
                fontSize: 'var(--text-lg)',
                fontFamily: 'var(--font-mono, monospace)',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            {field.suffix && (
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                {field.suffix}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 'var(--space-2)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.target.style.background = 'var(--color-surface-2)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: 'var(--space-2)',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-bg)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.88'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
