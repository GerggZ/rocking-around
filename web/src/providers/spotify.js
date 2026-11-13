export const requiresLogin = true;

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin + window.location.pathname;

let spotifyPlayer = null;
let spotifyDeviceId = null;
let audioActivated = false;

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function login() {
  if (!CLIENT_ID) throw new Error('Spotify client ID is missing from the site configuration.');
  const codeVerifier = generateRandomString(64);
  const state = 'spotify-' + generateRandomString(16);
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  localStorage.setItem('spotify_oauth_state', state);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const scopes = "streaming user-read-email user-read-private user-modify-playback-state";
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("scope", scopes);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("code_challenge", codeChallenge);
  authUrl.searchParams.append("code_challenge_method", "S256");
  authUrl.searchParams.append("state", state);

  window.location.href = authUrl.toString();
}

export function isCallback(params) {
  const state = params.get('state');
  return Boolean(state && state === localStorage.getItem('spotify_oauth_state'));
}

export async function handleCallback(code) {
  const verifier = localStorage.getItem('spotify_code_verifier');
  localStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_oauth_state');
  window.history.replaceState({}, document.title, window.location.pathname);
  
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier
    })
  });

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_token_expires_at', String(Date.now() + data.expires_in * 1000));
    return data.access_token;
  }
  throw new Error("Failed to retrieve access token");
}

export function hasSession() {
  return Boolean(getToken());
}

function getToken() {
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  if (expiresAt && Number(expiresAt) <= Date.now()) {
    clearSession();
    return null;
  }
  return localStorage.getItem('spotify_access_token');
}

function clearSession() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expires_at');
}

export function logout() {
  clearSession();
  localStorage.removeItem('spotify_code_verifier');
  spotifyPlayer?.disconnect();
}

function returnToSignIn() {
  clearSession();
  spotifyPlayer?.disconnect();
  window.location.reload();
}

function loadSDK() {
  return new Promise((resolve, reject) => {
    if (window.Spotify) return resolve();
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onerror = () => reject(new Error("Failed to load Spotify SDK"));
    document.head.appendChild(script);
  });
}

export async function initPlayer(onReady, onError, onStateChange, onAutoplayBlocked) {
  await loadSDK();

  spotifyPlayer = new Spotify.Player({
    name: 'RockingAround Game',
    getOAuthToken: callback => {
      const token = getToken();
      if (token) callback(token);
      else returnToSignIn();
    },
    volume: 0.8
  });

  spotifyPlayer.addListener('ready', ({ device_id }) => {
    spotifyDeviceId = device_id;
    onReady(device_id);
  });

  spotifyPlayer.addListener('player_state_changed', (state) => {
    if (onStateChange) onStateChange(state);
  });

  // The browser refused to start audio without a tap; the track stays loaded.
  spotifyPlayer.addListener('autoplay_failed', () => onAutoplayBlocked?.());

  spotifyPlayer.addListener('authentication_error', returnToSignIn);
  spotifyPlayer.addListener('initialization_error', ({ message }) => onError(message));
  spotifyPlayer.addListener('account_error', ({ message }) => onError("Requires Spotify Premium"));
  
  await spotifyPlayer.connect();
}

export async function playTrack(trackId) {
  const token = getToken();
  if (!token) {
    returnToSignIn();
    return;
  }
  const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      uris: [`spotify:track:${trackId}`],
      position_ms: 0
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 401) returnToSignIn();
}

// Must run inside a tap/click handler. Once activated, the SDK's audio can
// start later without another tap (Spotify's answer to browser autoplay rules).
export function unlockAudio() {
  if (audioActivated || !spotifyPlayer?.activateElement) return;
  audioActivated = true;
  spotifyPlayer.activateElement().catch(() => { audioActivated = false; });
}

export async function pauseTrack() {
  await spotifyPlayer?.pause();
}

export async function togglePlay() {
  if (spotifyPlayer) {
    await spotifyPlayer.togglePlay();
  }
}

export async function getCurrentState() {
  if (!spotifyPlayer) return null;
  return await spotifyPlayer.getCurrentState();
}