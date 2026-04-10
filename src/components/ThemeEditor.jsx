import { useState, useEffect } from 'react'

const PALETTE_KEYS = [
  { key: 'deep-night', label: 'Deep Night',  role: 'Page canvas',        cssVar: '--deep-night' },
  { key: 'slate',      label: 'Slate',       role: 'Cards & surfaces',   cssVar: '--slate' },
  { key: 'smoke',      label: 'Smoke',       role: 'Secondary & muted',  cssVar: '--smoke' },
  { key: 'snow',       label: 'Snow',        role: 'Primary text',       cssVar: '--snow' },
  { key: 'gold',       label: 'Gold',        role: 'Accent & CTAs',      cssVar: '--gold' },
]

const PRESETS = [
  {
    name: 'Default',
    colors: { 'deep-night': '#0E1016', slate: '#181B25', smoke: '#6B7082', snow: '#EAEAF0', gold: '#D4A843' },
  },
  {
    name: 'Midnight',
    colors: { 'deep-night': '#070B14', slate: '#0F1525', smoke: '#5A6A8A', snow: '#D8DEF0', gold: '#6C8EEF' },
  },
  {
    name: 'Forest',
    colors: { 'deep-night': '#0A100E', slate: '#141F1A', smoke: '#5E7A6B', snow: '#E0EDE6', gold: '#5DAE75' },
  },
  {
    name: 'Rose',
    colors: { 'deep-night': '#12090E', slate: '#1F1219', smoke: '#8A6577', snow: '#F0E0E8', gold: '#D4637A' },
  },
]

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const n = parseInt(hex, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function applyPalette(palette) {
  const root = document.documentElement
  for (const [key, hex] of Object.entries(palette)) {
    root.style.setProperty(`--${key}`, hex)
    if (['smoke', 'gold', 'snow'].includes(key)) {
      const { r, g, b } = hexToRgb(hex)
      root.style.setProperty(`--${key}-r`, r)
      root.style.setProperty(`--${key}-g`, g)
      root.style.setProperty(`--${key}-b`, b)
    }
    // Sync derived layer/accent vars for deep-night and slate
    if (key === 'deep-night') {
      root.style.setProperty('--layer-0', hex)
    }
    if (key === 'slate') {
      root.style.setProperty('--layer-1', hex)
    }
    if (key === 'gold') {
      const { r, g, b } = hexToRgb(hex)
      root.style.setProperty('--accent-gold', hex)
      root.style.setProperty('--accent-gold-muted', `rgba(${r},${g},${b},0.12)`)
      root.style.setProperty('--shadow-gold', `0 4px 16px rgba(${r},${g},${b},0.15)`)
    }
  }
  localStorage.setItem('advisorHQ_theme', JSON.stringify(palette))
}

export default function ThemeEditor() {
  const [open, setOpen] = useState(false)
  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem('advisorHQ_theme')
    return saved ? JSON.parse(saved) : PRESETS[0].colors
  })

  useEffect(() => {
    const saved = localStorage.getItem('advisorHQ_theme')
    if (saved) {
      const p = JSON.parse(saved)
      setPalette(p)
      applyPalette(p)
    }
  }, [])

  function updateColor(key, hex) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return
    const next = { ...palette, [key]: hex }
    setPalette(next)
    applyPalette(next)
  }

  function applyPreset(preset) {
    setPalette(preset.colors)
    applyPalette(preset.colors)
  }

  const inputStyle = {
    width: '80px',
    padding: '4px 8px',
    background: 'rgba(107,112,130,0.08)',
    border: '1px solid rgba(107,112,130,0.15)',
    borderRadius: '8px',
    color: '#EAEAF0',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    textAlign: 'center',
    outline: 'none',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        width: '280px',
        background: 'var(--slate, #181B25)',
        border: '1px solid rgba(107,112,130,0.12)',
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderBottom: open ? '1px solid rgba(107,112,130,0.08)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>🎨</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#EAEAF0', letterSpacing: '-0.01em' }}>
            Theme
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Mini palette preview */}
          {Object.values(palette).map((hex, i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: hex,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          ))}
          <span style={{ fontSize: '10px', color: '#6B7082', marginLeft: '4px' }}>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '12px 16px' }}>
          {/* Colour rows */}
          {PALETTE_KEYS.map(({ key, label, role }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(107,112,130,0.05)',
              }}
            >
              {/* Swatch */}
              <div
                style={{
                  width: 28, height: 28,
                  borderRadius: '8px',
                  background: palette[key],
                  border: '2px solid rgba(107,112,130,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <input
                  type="color"
                  value={palette[key]}
                  onChange={e => updateColor(key, e.target.value)}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer', border: 'none',
                  }}
                />
              </div>
              {/* Labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#EAEAF0' }}>{label}</div>
                <div style={{ fontSize: '10px', color: '#6B7082', marginTop: '1px' }}>{role}</div>
              </div>
              {/* Hex input */}
              <input
                style={inputStyle}
                value={palette[key]}
                onChange={e => {
                  const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                  setPalette(p => ({ ...p, [key]: val }))
                }}
                onBlur={e => updateColor(key, e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') updateColor(key, e.target.value) }}
                maxLength={7}
              />
            </div>
          ))}

          {/* Preset buttons */}
          <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: 'rgba(107,112,130,0.08)',
                  border: '1px solid rgba(107,112,130,0.12)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10px',
                  color: '#B8BCC8',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(107,112,130,0.15)'
                  e.currentTarget.style.color = '#EAEAF0'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(107,112,130,0.08)'
                  e.currentTarget.style.color = '#B8BCC8'
                }}
              >
                {Object.values(preset.colors).slice(0, 5).map((hex, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: hex }} />
                ))}
                <span style={{ marginLeft: '2px' }}>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
