// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // for custom domain root. If deploying under /<repo>/, set base accordingly.
  build: {
    target: 'es2020', 
    modulePreload: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          helmet: ['react-helmet-async'],
        }
      }
    }
  },
  plugins: [
    react(),
  //   VitePWA({
  //     registerType: 'autoUpdate',
  //     injectRegister: 'auto',           // makes sure the helper is injected
  //     includeAssets: ['favicons/favicon.ico', 'robots.txt', 'sitemap.xml'],
  //     manifest: {
  //       name: 'Psyche Support',
  //       short_name: 'Psyche',
  //       start_url: '/',
  //       display: 'standalone',
  //       background_color: '#ffffff',
  //       theme_color: '#2A9D8F',
  //       icons: [
  //         { src: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
  //         { src: '/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
  //       ],
  //     },
  //     devOptions: {
  //       enabled: true,                  // <<< lets you test SW locally (vite dev)
  //       navigateFallback: 'index.html',
  //       suppressWarnings: true,
  //     },
  //     workbox: {
  //       globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
  //       runtimeCaching: [
  //         // CSS & JS: fast with background update
  //         {
  //           urlPattern: ({ request }) =>
  //             request.destination === 'style' || request.destination === 'script',
  //           handler: 'StaleWhileRevalidate',
  //           options: {
  //             cacheName: 'static-assets',
  //             expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
  //           },
  //         },
  //         // Images: long-lived cache-first
  //         {
  //           urlPattern: ({ request }) => request.destination === 'image',
  //           handler: 'CacheFirst',
  //           options: {
  //             cacheName: 'images',
  //             expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 },
  //             cacheableResponse: { statuses: [0, 200] },
  //           },
  //         },
  //         // Fonts
  //         {
  //           urlPattern: ({ url }) => url.pathname.endsWith('.woff2'),
  //           handler: 'CacheFirst',
  //           options: {
  //             cacheName: 'fonts',
  //             expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
  //             cacheableResponse: { statuses: [0, 200] },
  //           },
  //         },
  //       ],
  //     },
  //   }),
  ],
});