var CACHE_NAME = 'wortschatz-shell-v1.1.s';

// Static assets only — never pre-cache index.html or versioned JS (they go stale
// quickly and cause layout/behaviour mismatches on soft refresh).
var APP_SHELL = [
  '/site.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
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

  var reqUrl;
  try { reqUrl = new URL(event.request.url); } catch (e) { return; }
  if (reqUrl.protocol !== 'http:' && reqUrl.protocol !== 'https:') return;

  // Skip connectivity-probe requests (contain _nc= query param).
  if (event.request.url.indexOf('_nc=') !== -1) return;

  // HTML navigation: always revalidate so soft refresh picks up new inline CSS/markup.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' }).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            return cache.put('/index.html', clone).catch(function() {});
          }).catch(function() {});
        }
        return response;
      }).catch(function() {
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.match('/index.html');
        });
      })
    );
    return;
  }

  // JavaScript and CSS: network-first; fall back to cache when offline.
  var url = event.request.url;
  if (url.indexOf('/js/') !== -1 || url.indexOf('/data/') !== -1 || url.match(/\.js(\?|$)/) || url.match(/\.json(\?|$)/)) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' }).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          return cache.put(event.request, clone).catch(function() {});
        }).catch(function() {});
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
          return cache.put(event.request, responseToCache).catch(function() {});
        }).catch(function() {});
        return response;
      });
    })
  );
});
