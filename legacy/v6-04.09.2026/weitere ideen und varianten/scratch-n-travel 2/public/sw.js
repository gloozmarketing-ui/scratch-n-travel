// public/sw.js
// Offline-Strategie gemäß Kapitel 726 (Zustandsmatrix): Story-Pins und die
// Regionen-Config sollen offline verfügbar bleiben, der KI-Concierge zeigt
// stattdessen den definierten Offline-Hinweistext (siehe ConciergeChat.tsx,
// das reagiert bereits auf navigator.onLine — hier nur der Cache-Teil).

const CACHE_NAME = "snt-static-v1";
const PRECACHE_URLS = ["/manifest.json", "/geo/regions.config.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Regionen-Config & Story-Pin-Reads: Cache-First mit Hintergrund-Refresh
  // (Stale-While-Revalidate) — App bleibt offline benutzbar.
  if (url.pathname.startsWith("/geo/") || url.pathname.startsWith("/api/tools/story-pins")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request)
          .then((res) => {
            cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Alles andere (v.a. /api/ai-concierge Streaming): Network-Only,
  // kein Caching von personalisierten/dynamischen Antworten.
});

// Web-Push-Listener (Kap. "Web-Push (PWA)") — Payload klein halten,
// nur Titel + Text + Deep-Link, keine Bilder (Bandbreiten-Schonung).
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Scratch'n'Travel", {
      body: data.body ?? "",
      icon: "/icons/icon-192.png",
      data: { url: data.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url ?? "/"));
});
