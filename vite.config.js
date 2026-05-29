import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Built output goes to /docs so GitHub Pages can serve it straight from the
// main branch with no build step on Mathias's side. base must match the repo
// name so asset URLs resolve at bordingcode.github.io/podwalk2/.
export default defineConfig({
  base: '/podwalk2/',
  build: { outDir: 'docs', emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Aarhus Music Walk',
        short_name: 'Music Walk',
        description: 'En musikhistorisk byvandring gennem Aarhus — 17 stop, 3 ruter, lyd og kort.',
        lang: 'da',
        start_url: '/podwalk2/',
        scope: '/podwalk2/',
        display: 'standalone',
        background_color: '#0f1b2d',
        theme_color: '#0f1b2d',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
        runtimeCaching: [
          {
            // CARTO basemap tiles — cache so the map works offline once seen.
            urlPattern: /^https:\/\/[a-d]\.basemaps\.cartocdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'carto-tiles',
              expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
})
