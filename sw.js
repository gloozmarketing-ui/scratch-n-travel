/**
 * Scratch'n'Travel — Service Worker (Offline Cache & PWA)
 * Caches core pages, styling and scripts for offline usage on planes & remote beaches
 */

const CACHE_NAME = 'scratch-travel-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/js/app.js',
  '/assets/js/i18n.js',
  '/assets/js/stripe-config.js',
  '/assets/js/family-pet-engine.js',
  '/assets/js/activities-engine.js',
  '/assets/js/safety-radar.js',
  '/assets/js/hermes-guardian.js',
  '/assets/js/scratch-passport-engine.js',
  '/assets/js/hazard-sim-engine.js',
  '/assets/js/hermes-concierge.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ [ServiceWorker] Pre-caching offline travel assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => console.warn('Cache addAll warning:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('⚡ [ServiceWorker] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first with cache fallback
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone and update cache
        if (response && response.status === 200 && e.request.method === 'GET') {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (e.request.destination === 'document') {
            return caches.match('/app.html');
          }
        });
      })
  );
});