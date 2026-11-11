import { Readable } from 'node:stream';

// TIDAL's audio CDN refuses browser requests that carry a website Origin
// header (403, no CORS headers), but serves the same signed URL to a plain
// request. This handler relays those segment requests from the server, which
// sends no Origin. Only signed TIDAL audio URLs are accepted, so it cannot be
// used as an open proxy. The audio stays DRM-encrypted the whole way.
const forwardedResponseHeaders = ['content-type', 'content-range', 'accept-ranges', 'last-modified', 'etag'];

function isTidalAudioUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.audio.tidal.com')
      && url.pathname.startsWith('/mediatracks/');
  } catch {
    return false;
  }
}

export function createTidalAudioHandler(env) {
  const allowedOrigins = new Set((env.TIDAL_ALLOWED_ORIGINS ||
    'http://127.0.0.1:5173,http://localhost:5173,https://127.0.0.1:5173,https://localhost:5173')
    .split(',').map(value => value.trim()));

  function originAllowed(request) {
    const origin = request.headers.origin;
    if (!origin || allowedOrigins.has(origin)) return true;
    try { return new URL(origin).host === request.headers.host; } catch { return false; }
  }

  return async function handleAudio(request, response) {
    const origin = request.headers.origin;
    response.setHeader('Vary', 'Origin');
    if (!originAllowed(request)) {
      response.writeHead(403).end();
      return;
    }
    if (origin) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges');
    }
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'GET');
      response.setHeader('Access-Control-Allow-Headers', 'Range');
      response.setHeader('Access-Control-Max-Age', '600');
      response.writeHead(204).end();
      return;
    }
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET, OPTIONS');
      response.writeHead(405).end();
      return;
    }

    const target = new URL(request.url, 'http://localhost').searchParams.get('url');
    if (!isTidalAudioUrl(target)) {
      response.writeHead(400, { 'Content-Type': 'text/plain' }).end('Not a TIDAL audio URL.');
      return;
    }

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 20000);
    response.on('close', () => abort.abort());
    try {
      const headers = {};
      if (request.headers.range) headers.Range = request.headers.range;
      const upstream = await fetch(target, { headers, signal: abort.signal, redirect: 'follow' });
      for (const name of forwardedResponseHeaders) {
        const value = upstream.headers.get(name);
        if (value) response.setHeader(name, value);
      }
      response.setHeader('Cache-Control', 'no-store');
      response.writeHead(upstream.status);
      if (!upstream.body) {
        response.end();
        return;
      }
      Readable.fromWeb(upstream.body).on('error', () => response.destroy()).pipe(response);
    } catch {
      if (!response.headersSent) response.writeHead(502, { 'Content-Type': 'text/plain' }).end('Could not reach TIDAL audio.');
      else response.destroy();
    } finally {
      clearTimeout(timeout);
    }
  };
}
