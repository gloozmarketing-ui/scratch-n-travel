/**
 * Scratch'n'Travel — Progressive Web App Service Worker v5.0
 *
 * Wichtig: Es werden bewusst NUR Dateien gecacht, die es im Build wirklich gibt.
 * Vorher standen hier /app.html, /assets/css/main.css und
 * /assets/icons/favicon.svg — die existieren im Vite-Build nicht.
 * cache.addAll() ist all-or-nothing: ein einziger 404 hat die
 * Installation des Service Workers komplett verhindert.
 */

const CACHE_NAME = 'snt-pwa-v5'

// Bewusst minimal: nur, was garantiert existiert. Der Rest wird beim
// Navigieren zur Laufzeit gecacht (siehe fetch-Handler unten).
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg']

// Anfragen, die niemals gecacht werden dürfen.
function isCacheable(request) {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false
  // Supabase und andere API-Aufrufe bleiben immer live.
  if (url.pathname.startsWith('/api/')) return false
  if (url.pathname.startsWith('/auth/')) return false
  return true
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    // addAll scheitert bei EINER fehlenden Datei. Deshalb einzeln cachen,
    // damit ein 404 die Installation nicht mehr killt.
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            console.warn('[sw] precache übersprungen:', url, err)
          })
        )
      )
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (!isCacheable(request)) return

  // Navigationen: immer das frische index.html liefern (SPA-Fallback),
  // damit neue Deploys nicht in einem alten Cache hängen bleiben.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(() =>
          caches.match('/index.html').then((cached) => cached || caches.match('/'))
        )
    )
    return
  }

  // Statische Assets: Cache zuerst, im Hintergrund auffrischen.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})