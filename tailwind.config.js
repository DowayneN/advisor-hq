/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        text:        'var(--color-text)',
        muted:       'var(--color-text-muted)',
        faint:       'var(--color-text-faint)',
        border:      'var(--color-border)',
        'border-soft': 'var(--color-border-soft)',
        accent:      'var(--color-accent)',
        'accent-dim': 'var(--color-accent-dim)',
        success:     'var(--color-success)',
        warning:     'var(--color-warning)',
        error:       'var(--color-error)',
      },
      borderRadius: {
        sm:      'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md:      'var(--radius-md)',
        lg:      'var(--radius-lg)',
        xl:      'var(--radius-xl)',
        '2xl':   'var(--radius-2xl)',
      },
      boxShadow: {
        sm:      'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md:      'var(--shadow-md)',
        lg:      'var(--shadow-lg)',
        xl:      'var(--shadow-xl)',
        inner:   'var(--shadow-inner)',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
