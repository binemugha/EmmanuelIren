/**
 * Service Worker for Emmanuel Iren Portfolio
 * Caches static assets and Cloudinary media locally to reduce CDN costs
 * and improve repeat-visit performance.
 */

const STATIC_CACHE = 'ei-static-v1';
const MEDIA_CACHE   = 'ei-media-v1';

// Local assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/home.css',
  '/js/main.js',
  '/images/logo.svg'
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== STATIC_CACHE && n !== MEDIA_CACHE)
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cloudinary images & video
  if (url.hostname === 'res.cloudinary.com') {
    // Range requests (video seeking) are best left to the browser's HTTP cache
    // and Cloudinary's edge CDN; synthesising them from Cache API is complex.
    if (request.headers.has('range')) return;

    event.respondWith(cacheFirst(request, MEDIA_CACHE));
    return;
  }

  // Everything else served by Firebase Hosting
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// ─── Helpers ────────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}
