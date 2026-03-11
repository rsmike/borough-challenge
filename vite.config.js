import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // base path must match the GitHub Pages repo name
  // so the app loads assets from /borough-challenge/... not /...
  base: '/borough-challenge/',

  plugins: [
    // React plugin: enables JSX transforms and fast refresh during dev
    react(),

    // Tailwind CSS v4 Vite plugin: processes @import "tailwindcss" in CSS
    tailwindcss(),

    // PWA plugin: generates a service worker and web manifest
    // so the app works offline and can be "installed" on a phone home screen
    VitePWA({
      registerType: 'autoUpdate', // auto-update SW when new version is deployed
      workbox: {
        // precache all these file types so the app works fully offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
      manifest: {
        name: '33 London Boroughs in One Day',
        short_name: '33 Boroughs',
        description: 'Track your progress visiting all 33 London boroughs in a single day',
        theme_color: '#0019A8',      // TfL Underground blue - shown in mobile browser chrome
        background_color: '#ffffff',
        display: 'standalone',        // hides browser UI when launched from home screen
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // "maskable" lets Android crop it into adaptive shape
          },
        ],
      },
    }),
  ],
})
