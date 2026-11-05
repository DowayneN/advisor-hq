import { useState, useEffect, useCallback } from 'react'

// Calls go through the dev server's /api/plausible proxy (server/plausibleProxy.js),
// which adds the API key and site id server-side. No secret reaches the browser.
const BASE_URL = '/api/plausible'

function plausibleFetch(path) {
  return fetch(`${BASE_URL}${path}`).then(r => {
    if (!r.ok) throw new Error(`Plausible ${r.status}`)
    return r.json()
  })
}

export function usePlausible() {
  const [stats, setStats]       = useState(null)   // aggregate 30d
  const [realtime, setRealtime] = useState(null)   // live visitor count
  const [sources, setSources]   = useState([])     // top referrers
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchAggregate = useCallback(async () => {
    try {
      const [aggRes, srcRes] = await Promise.all([
        plausibleFetch(
          `/stats/aggregate?period=30d&metrics=visitors,pageviews,bounce_rate,visit_duration`
        ),
        plausibleFetch(
          `/stats/breakdown?period=30d&property=visit:source&metrics=visitors&limit=5`
        ),
      ])
      setStats(aggRes.results)
      setSources(srcRes.results)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRealtime = useCallback(async () => {
    try {
      const res = await plausibleFetch(`/stats/realtime/visitors`)
      setRealtime(typeof res === 'number' ? res : 0)
    } catch {
      // silently fail on realtime — not critical
    }
  }, [])

  useEffect(() => {
    fetchAggregate()
    fetchRealtime()

    // Refresh aggregate every 10 minutes
    const aggInterval = setInterval(fetchAggregate, 10 * 60 * 1000)
    // Refresh realtime every 30 seconds
    const rtInterval  = setInterval(fetchRealtime, 30 * 1000)

    return () => {
      clearInterval(aggInterval)
      clearInterval(rtInterval)
    }
  }, [fetchAggregate, fetchRealtime])

  return { stats, realtime, sources, loading, error, lastUpdated, refetch: fetchAggregate }
}
