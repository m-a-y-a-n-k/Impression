// Service Worker for Impression PWA
const CACHE_NAME = 'impression-v2.2.0';
const RUNTIME_CACHE = 'impression-runtime-v1';

// Assets to cache on install (these will be cached, but we use runtime caching for hashed files)
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.webp',
  '/impression.webp'
];

// Install event - cache static assets
window.self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS).catch((err) => {
          console.log('[Service Worker] Cache addAll failed:', err);
          // Cache individual files even if some fail
          return Promise.all(
            STATIC_CACHE_URLS.map((url) => {
              return cache.add(url).catch((error) => {
                console.log(`[Service Worker] Failed to cache ${url}:`, error);
              });
            })
          );
        });
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return window.self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
window.self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      console.log('[Service Worker] Claiming clients');
      return window.self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
window.self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip external API calls (if any)
  const url = new URL(event.request.url);
  if (url.origin !== window.location.origin && !event.request.url.includes('localhost')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched response (for static assets and HTML)
            if (event.request.destination === 'document' || 
                event.request.destination === 'script' ||
                event.request.destination === 'style' ||
                event.request.destination === 'image') {
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // If network fails and it's a navigation request, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // For other requests, return cached version if available
            return caches.match(event.request);
          });
      })
  );
});

// Message event - handle messages from the app
window.self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    window.self.skipWaiting();
  }
});

