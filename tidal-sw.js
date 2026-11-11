// Reroutes the TIDAL player's audio segment requests to this site's own
// audio relay (server/tidal-audio.js). TIDAL's CDN rejects requests sent
// directly from a website, and the player has no hook for changing its
// request URLs, so the rerouting happens here. Nothing else is touched.
const proxy = new URL(self.location.href).searchParams.get('proxy');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  if (!proxy || event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.audio.tidal.com')) return;

  const target = new URL(proxy);
  target.searchParams.set('url', url.href);
  const headers = new Headers();
  const range = event.request.headers.get('range');
  if (range) headers.set('Range', range);
  event.respondWith(fetch(target, {
    headers,
    cache: 'no-store',
    credentials: 'omit',
    signal: event.request.signal
  }));
});
