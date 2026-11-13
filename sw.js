// Makes RockingAround installable and opens it quickly. Music always comes
// straight from Spotify/iTunes/TIDAL: requests to other sites are not touched.
// Bump the version to throw away everything cached by older releases.
const CACHE = 'rocking-around-v1';
const SCOPE = self.registration.scope; // e.g. https://…/rocking-around/

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([
    SCOPE, `${SCOPE}manifest.webmanifest`, `${SCOPE}icons/icon-192.png`, `${SCOPE}icons/icon-512.png`
  ])));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

async function remember(key, response) {
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(CACHE);
    await cache.put(key, response.clone());
  }
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;

  // Pages: always try the network first so new releases show up straight away.
  // Every page (?song=…, login returns with ?code=…) is the same app, so one
  // cached copy under the start address covers them all when offline.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request)
      .then(response => remember(SCOPE, response))
      .catch(async () => (await caches.match(SCOPE)) || Response.error()));
    return;
  }

  // Built files have a content hash in their name, so a cached copy never goes stale.
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request)
      .then(hit => hit || fetch(request).then(response => remember(request, response))));
    return;
  }

  // Everything else (icons, manifest): network first, cached copy when offline.
  event.respondWith(fetch(request)
    .then(response => remember(request, response))
    .catch(async () => (await caches.match(request)) || Response.error()));
});
