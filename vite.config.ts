import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Psyche Support',
        short_name: 'Psyche',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2A9D8F',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp}'],
        // Runtime caching strategies (adds effective long-lived caching)
        runtimeCaching: [
          // CSS & JS: fast, update in background
          {
            urlPattern: ({ request }) =>
              request.destination === 'style' || request.destination === 'script',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            }
          },
          // Images: cache-first with a long TTL
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 }, // 60 days
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Fonts (if any)
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin && url.pathname.endsWith('.woff2'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
});