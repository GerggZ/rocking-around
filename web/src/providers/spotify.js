import { followPlayback, unlockSilentLoop } from '../media-session.js';

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
  
  // playlist-read-* lets "Add playlist" read your private and collaborative playlists.
  const scopes = "streaming user-read-email user-read-private user-modify-playback-state playlist-read-private playlist-read-collaborative";
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
    // Keeps the phone's media controls showing RockingAround (see media-session.js)
    followPlayback(Boolean(state && !state.paused));
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
  unlockSilentLoop();
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

// --- PLAYLISTS ("Add playlist" on the main screen) ---
// Since Spotify's February 2026 rules, apps in Development Mode only get the
// songs of playlists the signed-in user owns or collaborates on. Anyone else's
// playlist (including Spotify's own) has to be saved as a copy first.
const MAX_PLAYLIST_TRACKS = 2000;

export class PlaylistError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// Accepts open.spotify.com/playlist/<id> links (with or without /intl-xx/ and
// ?si=…), spotify:playlist:<id> URIs, or a bare playlist id.
export function parsePlaylistId(input) {
  const text = String(input ?? '').trim();
  const match = text.match(/playlist[/:]([A-Za-z0-9]{22})/) ?? text.match(/^([A-Za-z0-9]{22})$/);
  return match?.[1] ?? null;
}

const NOT_SHARED = "Spotify only shares the songs of playlists you own or collaborate on. " +
  "Save a copy first (in Spotify: ••• → Add to other playlist → New playlist), then paste the copy's link.";

async function spotifyGet(pathOrUrl) {
  const token = getToken();
  if (!token) throw new PlaylistError('signin', 'Connect Spotify to add a playlist.');
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `https://api.spotify.com/v1${pathOrUrl}`;
  let response;
  try {
    response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    throw new PlaylistError('network', 'Could not reach Spotify. Check your connection and try again.');
  }
  if (response.status === 401) {
    clearSession();
    throw new PlaylistError('signin', 'Your Spotify sign-in has expired. Connect Spotify again.');
  }
  if (response.status === 429) throw new PlaylistError('busy', 'Spotify is busy right now. Try again in a minute.');
  return response;
}

function toCard(entry) {
  const track = entry?.item ?? entry?.track;
  if (!track || track.type !== 'track' || !track.id || track.is_local) return null;
  return {
    title: track.name ?? '',
    artist: (track.artists ?? []).map(artist => artist.name).join(', '),
    album: track.album?.name ?? '',
    // Album release year. Remasters and compilations can show a later year.
    year: (track.album?.release_date ?? '').slice(0, 4),
    spotify: track.id
  };
}

export async function fetchPlaylist(input) {
  const id = parsePlaylistId(input);
  if (!id) {
    const shortLink = /spotify\.link|spotify\.app\.link/.test(String(input));
    throw new PlaylistError('link', shortLink
      ? 'Short share links can’t be read here. Open the link, then copy the full open.spotify.com address.'
      : 'That doesn’t look like a Spotify playlist link.');
  }

  const response = await spotifyGet(`/playlists/${id}`);
  if (response.status === 404) {
    throw new PlaylistError('not-found', 'Spotify couldn’t find that playlist. ' + NOT_SHARED);
  }
  if (response.status === 403) throw new PlaylistError('not-shared', NOT_SHARED);
  if (!response.ok) throw new PlaylistError('failed', 'Could not load that playlist. Please try again.');
  const playlist = await response.json();

  // The songs come inside the playlist only when Spotify shares them with us.
  let page = playlist.items?.items ? playlist.items : playlist.tracks?.items ? playlist.tracks : null;
  if (!page) {
    // New endpoint first; the old one still answers for some apps created
    // before Spotify's February 2026 changes, which may include public playlists.
    for (const path of [`/playlists/${id}/items?limit=50`, `/playlists/${id}/tracks?limit=50`]) {
      const itemsResponse = await spotifyGet(path);
      if (itemsResponse.ok) {
        page = await itemsResponse.json();
        break;
      }
    }
    if (!page) throw new PlaylistError('not-shared', NOT_SHARED);
  }

  const tracks = [];
  const seen = new Set();
  let skipped = 0;
  while (page) {
    for (const entry of page.items ?? []) {
      const card = toCard(entry);
      if (!card) { skipped++; continue; }
      if (seen.has(card.spotify)) continue;
      seen.add(card.spotify);
      tracks.push(card);
    }
    if (!page.next || tracks.length >= MAX_PLAYLIST_TRACKS) break;
    const next = await spotifyGet(page.next);
    if (!next.ok) break;
    page = await next.json();
  }

  if (!tracks.length) {
    throw new PlaylistError('empty', skipped
      ? 'That playlist has no Spotify songs to play (podcasts and local files are skipped).'
      : 'That playlist is empty.');
  }
  return { id, name: playlist.name || 'My playlist', tracks: tracks.slice(0, MAX_PLAYLIST_TRACKS), skipped };
}
