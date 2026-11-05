import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { plausibleProxy } from './server/plausibleProxy.js'

export default defineConfig(({ mode }) => {
  // Load every variable from .env for server-side use only. Anything without
  // the VITE_ prefix stays out of the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      plausibleProxy({ apiKey: env.PLAUSIBLE_API_KEY, siteId: env.PLAUSIBLE_SITE_ID }),
    ],
    server: {
      port: 5080,
      host: '0.0.0.0',
      strictPort: false,
    },
  }
})
