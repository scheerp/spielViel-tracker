const CACHE_NAME = 'spiel-viel-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/spielViel-logo.png',
  '/android/android-launchericon-192-192.png',
  '/screenshots/screenshot1-v2.png',
  '/screenshots/screenshot2-v2.png',
  '/screenshots/screenshot3-v2.png',
  '/screenshots/screenshot4-v2.png',
  '/screenshots/screenshot5-v2.png',
  '/offline.html', // 👈 WICHTIG: Offline-Seite
];

// 🔥 Installationsprozess verbessern (Fehlerhandling hinzufügen)
self.addEventListener('install', async (event) => {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll(STATIC_ASSETS);
    console.log('[SW] Assets gecached');
  } catch (error) {
    console.error('[SW] Fehler beim Cachen von Assets:', error);
  }
  self.skipWaiting();
});

// 🔥 Aktivierungsprozess mit Cache-Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Alter Cache ${key} gelöscht`);
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

// 🔥 Netzwerk-Fallback-Strategie für `fetch`-Events
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html')), // Falls offline, lade die Offline-Seite
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      }),
    );
  }
});
