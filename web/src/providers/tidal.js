export const requiresLogin = true;

let player = null;
let pendingCredentials = null;
let playbackError = null;
const credentialsBus = new EventTarget();

// Listeners sign in with their own TIDAL account (OAuth PKCE, "playback"
// scope). Third-party apps only receive 30-second previews.
const clientId = import.meta.env.VITE_TIDAL_CLIENT_ID;
const redirectUri = window.location.origin + window.location.pathname;
const authorizeUrl = 'https://login.tidal.com/authorize';
const tokenUrl = 'https://auth.tidal.com/v1/oauth2/token';
const scopes = ['playback'];
const sessionKey = 'tidal_session';
// Earlier versions routed TIDAL audio through a service worker and a relay
// server. Audio now streams straight from TIDAL to the browser, so remove that
// worker if a visitor's browser still has it.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async registrations => {
    const old = registrations.filter(registration =>
      [registration.active, registration.waiting, registration.installing]
        .some(worker => worker?.scriptURL.includes('tidal-sw.js')));
    if (!old.length) return;
    await Promise.all(old.map(registration => registration.unregister()));
    // A worker still controlling this page keeps rerouting until a reload.
    if (navigator.serviceWorker.controller?.scriptURL.includes('tidal-sw.js')) window.location.reload();
  }).catch(() => {});
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(sessionKey)) || null; } catch { return null; }
}

function saveSession(session) {
  try { localStorage.setItem(sessionKey, JSON.stringify(session)); } catch {}
}

export function hasSession() {
  const session = readSession();
  return Boolean(session?.refreshToken || session?.expires > Date.now());
}

export function logout() {
  try { localStorage.removeItem(sessionKey); } catch {}
}

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), x => chars[x % chars.length]).join('');
}

async function codeChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function login() {
  if (!clientId) throw new Error('TIDAL client ID is missing. Add VITE_TIDAL_CLIENT_ID to .env.local.');
  const verifier = randomString(64);
  const state = 'tidal-' + randomString(16);
  localStorage.setItem('tidal_code_verifier', verifier);
  localStorage.setItem('tidal_oauth_state', state);
  const url = new URL(authorizeUrl);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    code_challenge_method: 'S256',
    code_challenge: await codeChallenge(verifier),
    state
  });
  window.location.href = url.toString();
}

export function isCallback(params) {
  const state = params.get('state');
  return Boolean(state && state === localStorage.getItem('tidal_oauth_state'));
}

async function requestToken(body) {
  let response;
  try {
    response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, ...body }),
      signal: AbortSignal.timeout(12000)
    });
  } catch {
    throw new Error('Could not reach TIDAL. Please try again.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.access_token) {
    throw new Error(data?.error_description || 'TIDAL login failed. Please log in again.');
  }
  const previous = readSession();
  const session = {
    token: data.access_token,
    refreshToken: data.refresh_token || previous?.refreshToken,
    expires: Date.now() + Number(data.expires_in || 3600) * 1000,
    grantedScopes: (data.scope || scopes.join(' ')).split(' ').filter(Boolean),
    userId: data.user_id ?? data.user?.userId ?? previous?.userId
  };
  saveSession(session);
  return session;
}

export async function handleCallback(code) {
  const verifier = localStorage.getItem('tidal_code_verifier');
  localStorage.removeItem('tidal_code_verifier');
  localStorage.removeItem('tidal_oauth_state');
  window.history.replaceState({}, document.title, window.location.pathname);
  await requestToken({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, code_verifier: verifier });
}

async function getCredentials(apiErrorSubStatus) {
  let session = readSession();
  if (!session) throw new Error('Please log in to TIDAL to play.');
  if (!apiErrorSubStatus && session.expires > Date.now() + 60000) return toCredentials(session);
  if (!pendingCredentials) {
    pendingCredentials = (async () => {
      if (!session.refreshToken) {
        logout();
        throw new Error('Your TIDAL login expired. Please log in again.');
      }
      try {
        session = await requestToken({ grant_type: 'refresh_token', refresh_token: session.refreshToken });
      } catch (error) {
        logout();
        throw error;
      }
      const credentials = toCredentials(session);
      credentialsBus.dispatchEvent(new CustomEvent('credentials', { detail: credentials }));
      return credentials;
    })().finally(() => { pendingCredentials = null; });
  }
  return pendingCredentials;
}

function toCredentials(session) {
  return {
    clientId,
    token: session.token,
    expires: session.expires,
    requestedScopes: scopes,
    grantedScopes: session.grantedScopes,
    ...(session.userId != null ? { userId: String(session.userId) } : {})
  };
}

// TIDAL streams are DRM-protected. The player only configures Widevine or
// FairPlay when the browser offers them; otherwise Shaka drops every stream
// and fails with error 4032. Check up front so we can explain why.
let drmSupport = null;
async function checkDrmSupport() {
  if (drmSupport) return drmSupport;
  drmSupport = (async () => {
    if (!window.isSecureContext || !navigator.requestMediaKeySystemAccess) return false;
    const config = [{
      initDataTypes: ['cenc'],
      audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"', robustness: 'SW_SECURE_CRYPTO' }]
    }];
    for (const keySystem of ['com.widevine.alpha', 'com.apple.fps.1_0', 'com.apple.fps']) {
      try {
        await navigator.requestMediaKeySystemAccess(keySystem,
          keySystem === 'com.widevine.alpha' ? config : [{ initDataTypes: ['sinf', 'skd'], audioCapabilities: [{ contentType: 'audio/mp4' }] }]);
        return true;
      } catch {}
    }
    return false;
  })();
  return drmSupport;
}

const drmMessage = 'This browser cannot play protected TIDAL audio (no Widevine/FairPlay). '
  + 'Open the app in regular Chrome, Edge, Firefox or Safari with "protected content" / DRM enabled.';

export function getCurrentState() {
  if (!player) return null;
  return {
    paused: player.getPlaybackState() !== 'PLAYING',
    position: player.getAssetPosition() * 1000,
    duration: (player.getPlaybackContext()?.actualDuration || 30) * 1000
  };
}

export async function initPlayer(onReady, onError, onStateChange) {
  try {
    if (hasSession()) await getCredentials();
    player = await import('@tidal-music/player');
    player.bootstrap({
      outputDevices: false,
      players: [{ player: 'shaka', itemTypes: ['track'] }]
    });
    // Previews only need the smallest stream.
    player.setStreamingWifiAudioQuality('LOW');
    // Playback events are not reported for previews.
    player.setEventSender({ sendEvent() {} });
    player.setCredentialsProvider({
      getCredentials,
      bus: callback => credentialsBus.addEventListener('credentials', callback)
    });
    player.events.addEventListener('playback-state-change', () => onStateChange(getCurrentState()));
    player.events.addEventListener('media-product-transition', ({ detail }) => {
      if (import.meta.env.DEV) {
        const { actualAssetPresentation, previewReason } = detail.playbackContext;
        console.info('TIDAL playback', { actualAssetPresentation, previewReason });
      }
      onStateChange(getCurrentState());
    });
    player.events.addEventListener('ended', () => onStateChange({ ...getCurrentState(), paused: true }));
    player.events.addEventListener('error', event => {
      const code = event.detail?.errorCode || 'unknown';
      if (import.meta.env.DEV) {
        console.warn('TIDAL player error', { errorCode: code, errorId: event.detail?.errorId });
      }
      playbackError = new Error(code === 'S4032'
        ? drmMessage
        : 'This TIDAL preview could not play (' + code + '). Please try again.');
      onError(playbackError.message);
      onStateChange({ ...getCurrentState(), paused: true });
    });
    onReady();
  } catch (error) {
    onError(error.message);
  }
}

export async function playTrack(trackId) {
  if (!/^[0-9]+$/.test(String(trackId))) {
    throw new Error('This card needs a numeric TIDAL track ID.');
  }
  if (!player) throw new Error('The TIDAL player is not ready yet.');
  if (!(await checkDrmSupport())) throw new Error(drmMessage);
  playbackError = null;
  let timeout;
  let timedOut = false;
  try {
    const startPlayback = async () => {
      await player.load({
        productId: String(trackId),
        productType: 'track',
        sourceId: String(trackId),
        sourceType: 'TRACK'
      });
      if (timedOut) {
        await player.reset();
        return;
      }
      if (playbackError) throw playbackError;
      await player.play();
      if (playbackError) throw playbackError;
    };
    await Promise.race([
      startPlayback(),
      new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          timedOut = true;
          void player.reset().catch(() => {});
          reject(new Error('The TIDAL preview took too long to load. Please try again.'));
        }, 20000);
      })
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

export async function pauseTrack() {
  if (player) await player.pause();
}

export async function togglePlay() {
  if (!player) return;
  if (player.getPlaybackState() === 'PLAYING') await player.pause();
  else {
    const media = player.getMediaElement();
    if (media?.ended) await player.seek(0);
    await player.play();
  }
}
