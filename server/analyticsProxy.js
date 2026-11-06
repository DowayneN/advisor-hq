// Server-side proxy for Umami Cloud (DTS traffic panel).
//
// The browser calls /api/analytics/summary and /api/analytics/realtime. The
// server reads stats through the website's Umami share link (free plan, no API
// key): it swaps the share id for a short-lived token, caches it, and refreshes
// it when Umami rejects it. The share id comes from UMAMI_SHARE_ID (no VITE_
// prefix), so it never reaches the browser bundle, and the panel only ever
// receives a small, fixed set of numbers.
//
// Runs in `npm run dev` and `npm run preview`. A static host has no server,
// so the panel shows an error there instead.

const UPSTREAM = 'https://gateway-eu.umami.is/api'
const DAY_MS = 24 * 60 * 60 * 1000

export function analyticsProxy({ shareId }) {
  let share = null // { token, websiteId }

  async function getShare(force = false) {
    if (share && !force) return share
    const r = await fetch(`${UPSTREAM}/share/${encodeURIComponent(shareId)}`, { headers: { Accept: 'application/json' } })
    if (!r.ok) throw Object.assign(new Error('share'), { status: r.status })
    const { token, websiteId } = await r.json()
    share = { token, websiteId }
    return share
  }

  const umami = async (path, retry = true) => {
    const { token, websiteId } = await getShare()
    const r = await fetch(`${UPSTREAM}/websites/${encodeURIComponent(websiteId)}${path}`, {
      headers: { Accept: 'application/json', 'x-umami-share-token': token, 'x-umami-share-context': '1' },
    })
    if (r.status === 401 && retry) {
      await getShare(true)
      return umami(path, false)
    }
    if (!r.ok) throw Object.assign(new Error('upstream'), { status: r.status })
    return r.json()
  }

  async function summary() {
    const endAt = Date.now()
    const startAt = endAt - 30 * DAY_MS
    const range = `startAt=${startAt}&endAt=${endAt}`
    const [s, refs] = await Promise.all([
      umami(`/stats?${range}`),
      umami(`/metrics?type=referrer&limit=5&${range}`),
    ])
    const visits = s.visits || 0
    return {
      stats: {
        visitors: s.visitors ?? 0,
        pageviews: s.pageviews ?? 0,
        bounceRate: visits ? Math.round((s.bounces / visits) * 100) : null,
        avgDuration: visits ? Math.round(s.totaltime / visits) : null,
      },
      sources: (Array.isArray(refs) ? refs : []).map(r => ({ source: r.x || 'Direct', visitors: r.y })),
    }
  }

  async function realtime() {
    const r = await umami('/active')
    return { visitors: r.visitors ?? 0 }
  }

  const ROUTES = { '/summary': summary, '/realtime': realtime }

  async function handle(req, res) {
    const send = (status, body) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(body))
    }
    const path = new URL(req.url, 'http://localhost').pathname
    const route = ROUTES[path]

    if (req.method !== 'GET') return send(405, { error: 'Method not allowed' })
    if (!route) return send(404, { error: 'Not found' })
    if (!shareId) return send(500, { error: 'Umami is not configured on the server' })

    try {
      send(200, await route())
    } catch (e) {
      // Never echo upstream error detail
      send(e.status || 502, { error: e.status ? `Umami ${e.status}` : 'Could not reach Umami' })
    }
  }

  const mount = server => {
    server.middlewares.use('/api/analytics', handle)
  }

  return { name: 'analytics-proxy', configureServer: mount, configurePreviewServer: mount }
}
