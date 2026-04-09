export const METRICS_DEFINITIONS = {
  dts: {
    label: 'Driving Test Swap',
    accentColor: 'var(--venture-dts)',
    dimColor: 'var(--venture-dts-dim)',
    fields: [
      { key: 'users',    label: 'Registered Users',   target: 750,  current: 241, prefix: '',  suffix: '' },
      { key: 'packages', label: 'Active Packages',     target: 120,  current: 46,  prefix: '',  suffix: '' },
      { key: 'revenue',  label: 'Revenue',             target: 3000, current: 800, prefix: '£', suffix: '' },
    ],
  },
  aimybiz: {
    label: 'AIMyBiz',
    accentColor: 'var(--venture-aimybiz)',
    dimColor: 'var(--venture-aimybiz-dim)',
    fields: [
      { key: 'outbound',   label: 'Outbound Messages Sent',  target: 300, current: 0, prefix: '',  suffix: '' },
      { key: 'demos',      label: 'Demos Booked',            target: 15,  current: 0, prefix: '',  suffix: '' },
      { key: 'customers',  label: 'Paying Customers',        target: 3,   current: 0, prefix: '',  suffix: '' },
      { key: 'mrr',        label: 'MRR',                     target: 600, current: 0, prefix: '£', suffix: '/mo' },
      { key: 'websites',   label: 'Websites Delivered',      target: 4,   current: 1, prefix: '',  suffix: '' },
      { key: 'web_revenue',label: 'Web Dev Revenue',         target: 3000, current: 458, prefix: '£', suffix: '' },
    ],
  },
  athletics: {
    label: 'Athletics Brand',
    accentColor: 'var(--venture-athletics)',
    dimColor: 'var(--venture-athletics-dim)',
    fields: [
      { key: 'followers',   label: 'Followers (Primary Platform)', target: 2000, current: 0, prefix: '', suffix: '' },
      { key: 'posts_week',  label: 'Posts This Week',              target: 3,    current: 0, prefix: '', suffix: '' },
      { key: 'longform',    label: 'Long-form Pieces Recorded',    target: 4,    current: 0, prefix: '', suffix: '' },
    ],
  },
}

export const DEFAULT_METRICS = Object.fromEntries(
  Object.entries(METRICS_DEFINITIONS).map(([key, venture]) => [
    key,
    Object.fromEntries(venture.fields.map(f => [f.key, f.current]))
  ])
)
