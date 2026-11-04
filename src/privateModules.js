import { createElement } from 'react'

// Personal data lives in src/private/, which is gitignored here and backed up
// to a separate private repo. If the folder is missing (a fresh public clone),
// these globs return nothing and the app falls back to empty states.
const components = import.meta.glob('./private/components/*.jsx', { eager: true })
const data = import.meta.glob('./private/*.json', { eager: true, import: 'default' })

function MissingPrivate({ name }) {
  return createElement('div', {
    style: {
      background: 'var(--layer-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      color: 'var(--text-tertiary)',
      fontSize: 'var(--text-sm)',
    },
  }, `${name} uses private data that isn't in this copy of the repo.`)
}

export function privateComponent(name) {
  const mod = components[`./private/components/${name}.jsx`]
  if (mod?.default) return mod.default
  return function Fallback() { return createElement(MissingPrivate, { name }) }
}

export function privateData(name) {
  return data[`./private/${name}.json`] ?? null
}
