import { useState, useEffect, useCallback } from 'react'

// Calls go through the dev server's /api/analytics proxy (server/analyticsProxy.js),
// which adds the Umami API key server-side. No secret reaches the browser.
function get(path) {
  return fetch(`/api/analytics${path}`).then(async r => {
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Analytics ${r.status}`)
    return r.json()
  })
}

export function useAnalytics() {
  const [stats, setStats]       = useState(null)   // 30-day summary
  const [realtime, setRealtime] = useState(null)   // visitors in the last 5 minutes
  const [sources, setSources]   = useState([])     // top referrers
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchSummary = useCallback(async () => {
    try {
      const res = await get('/summary')
      setStats(res.stats)
      setSources(res.sources)
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
      setRealtime((await get('/realtime')).visitors)
    } catch {
      // Realtime is not critical
    }
  }, [])

  useEffect(() => {
    fetchSummary()
    fetchRealtime()
    const summaryInterval = setInterval(fetchSummary, 10 * 60 * 1000)
    const rtInterval = setInterval(fetchRealtime, 30 * 1000)
    return () => {
      clearInterval(summaryInterval)
      clearInterval(rtInterval)
    }
  }, [fetchSummary, fetchRealtime])

  return { stats, realtime, sources, loading, error, lastUpdated, refetch: fetchSummary }
}
