var CACHE_NAME = 'wortschatz-shell-v2.1.6';
var APP_SHELL = [
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/js/app.js?v=1.9',
  '/js/adaptive.js?v=1.9',
  '/js/auth.js?v=1.9',
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

  // HTML navigation requests: network-first; fall back to cached shell offline.
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

  // Skip connectivity-probe requests (contain _nc= query param).
  if (event.request.url.indexOf('_nc=') !== -1) return;

  // JavaScript and CSS: NETWORK-FIRST so updates are always served fresh
  // in browser tabs. Falls back to cache when offline.
  // This prevents the browser from persisting stale JS the way a PWA does.
  var url = event.request.url;
  if (url.indexOf('/js/') !== -1 || url.match(/\.js(\?|$)/) || url.match(/\.css(\?|$)/)) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' }).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // All other GET requests (images, manifests, fonts): cache-first.
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
