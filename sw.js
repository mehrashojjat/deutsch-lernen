var CACHE_NAME = 'wortschatz-shell-v1.3';
var APP_SHELL = [
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/js/app.js',
  '/js/adaptive.js',
  '/js/auth.js',
  '/assets/ShareButton.png',
  '/assets/A2HS.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  // HTML navigation requests (page load / refresh):
  // Try network first so the user always gets a fresh shell;
  // on failure (offline) return the cached index.html so the
  // in-app offline screen is shown instead of the browser\'s default page.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.match('/index.html');
        });
      })
    );
    return;
  }

  // All other GET requests: cache-first, network fallback.
  // Skip caching connectivity-probe requests (contain _nc= query param).
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        if (event.request.url.indexOf('_nc=') !== -1) return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
