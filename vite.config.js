import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { analyticsProxy } from './server/analyticsProxy.js'

export default defineConfig(({ mode }) => {
  // Load every variable from .env for server-side use only. Anything without
  // the VITE_ prefix stays out of the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      analyticsProxy({ shareId: env.UMAMI_SHARE_ID }),
    ],
    server: {
      port: 5080,
      host: '0.0.0.0',
      strictPort: false,
    },
  }
})
