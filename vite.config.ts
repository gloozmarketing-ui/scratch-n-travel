import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Vite config - https://vitejs.dev/config/
//
// Bewusst schlank: Die fruehere Konfiguration war an das Figma-Make-Plugin
// gekoppelt (./.figma/make/site.json) und schlug beim Bauen fehl, sobald das
// Projekt nicht in Figma Make gestartet wurde.
export default defineConfig({
  base: '/',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  preview: {
    host: '0.0.0.0',
    port: 4173,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Bundle-Budget: der alte Stand lag bei 1.003.786 Bytes unkomprimiert.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // React, Supabase und Leaflet getrennt ausliefern.
        // Vite 8 / Rolldown erwartet hier eine Funktion.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('leaflet')) return 'map'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})