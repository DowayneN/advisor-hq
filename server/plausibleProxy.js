// Server-side proxy for the Plausible Stats API.
//
// The browser calls /api/plausible/..., and this middleware adds the API key
// and site id on the server before forwarding to plausible.io. The key is read
// from PLAUSIBLE_API_KEY (no VITE_ prefix), so Vite never puts it in the bundle.
//
// Runs in `npm run dev` and `npm run preview`. A static host (for example
// GitHub Pages) has no server, so the stats panel shows an error there
// instead of leaking the key.

const UPSTREAM = 'https://plausible.io/api/v1'

// Only these read-only endpoints are forwarded
const ALLOWED = new Set(['/stats/aggregate', '/stats/breakdown', '/stats/realtime/visitors'])
// Only these query parameters are passed through. site_id is always set here.
const ALLOWED_PARAMS = new Set(['period', 'metrics', 'property', 'limit', 'date'])

export function plausibleProxy({ apiKey, siteId }) {
  async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost')
    const path = url.pathname.replace(/^\/api\/plausible/, '')

    const send = (status, body) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(body))
    }

    if (req.method !== 'GET') return send(405, { error: 'Method not allowed' })
    if (!ALLOWED.has(path)) return send(404, { error: 'Not found' })
    if (!apiKey || !siteId) return send(500, { error: 'Plausible is not configured on the server' })

    const params = new URLSearchParams({ site_id: siteId })
    for (const [k, v] of url.searchParams) {
      if (ALLOWED_PARAMS.has(k)) params.set(k, v)
    }

    try {
      const upstream = await fetch(`${UPSTREAM}${path}?${params}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const text = await upstream.text()
      res.statusCode = upstream.status
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      // Never echo upstream error detail, which could include request info
      res.end(upstream.ok ? text : JSON.stringify({ error: `Plausible ${upstream.status}` }))
    } catch {
      send(502, { error: 'Could not reach Plausible' })
    }
  }

  const mount = server => {
    server.middlewares.use('/api/plausible', (req, res) => {
      // Connect strips the mount path, so restore it for parsing
      req.url = '/api/plausible' + req.url
      handle(req, res)
    })
  }

  return {
    name: 'plausible-proxy',
    configureServer: mount,
    configurePreviewServer: mount,
  }
}
