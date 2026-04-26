const CACHE_NAME = 'arlotechx-cache-v3';
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const PRECACHE_URLS = [SCOPE_PATH, `${SCOPE_PATH}manifest.json`, `${SCOPE_PATH}assets/icon-192.png`, `${SCOPE_PATH}assets/icon-512.png`];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(async () => (await caches.match(SCOPE_PATH)) || Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const isValidResponse =
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic' &&
            requestUrl.protocol.startsWith('http') &&
            !requestUrl.pathname.startsWith(`${SCOPE_PATH}api/`);

          if (isValidResponse) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }

          return networkResponse;
        })
        .catch(async () => (await caches.match(event.request)) || (await caches.match(SCOPE_PATH)) || Response.error());
    }),
  );
});
