// Bump the version whenever you change index.html so devices pick up the new copy.
var CACHE = 'mar-widget-v14';
var FILES = ['./', './index.html', './JotFormCustomWidget.min.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILES.map(function (f) { return c.add(f).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Serve from cache straight away, refresh the cache in the background when online.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) c.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
