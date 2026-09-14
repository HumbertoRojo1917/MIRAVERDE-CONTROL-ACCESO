const CACHE_NAME = 'miraverde-acceso-v1';
const ARCHIVOS_CACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) return;
  event.respondWith(
    fetch(event.request)
      .then((r) => { const copia = r.clone(); caches.open(CACHE_NAME).then((c) => c.put(event.request, copia)); return r; })
      .catch(() => caches.match(event.request))
  );
});
