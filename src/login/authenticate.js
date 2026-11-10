import * as spotify from './authenticate_spotify.js';

let activeProvider = 'spotify';

function resumeCard() {
  const pendingSong = sessionStorage.getItem('pending_song');
  sessionStorage.removeItem('pending_song');
  window.location.href = pendingSong
    ? window.location.pathname + '?' + new URLSearchParams({ song: pendingSong })
    : window.location.pathname;
}

export async function login(provider = 'spotify') {
  if (provider !== 'spotify' && provider !== 'tidal') return;
  sessionStorage.setItem('selected_provider', provider);
  if (provider === 'tidal' || spotify.getToken()) {
    resumeCard();
    return;
  }
  await spotify.login();
}

export function changeProvider() {
  sessionStorage.setItem('selected_provider', 'choose');
  window.location.reload();
}

export function logout() {
  spotify.logout();
  changeProvider();
}

export async function checkAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const token = await spotify.handleCallback(code);
    activeProvider = 'spotify';
    sessionStorage.setItem('selected_provider', 'spotify');

    // 🎯 Check if there was a saved card waiting before login!
    const pendingSong = sessionStorage.getItem('pending_song');
    if (pendingSong) {
      sessionStorage.removeItem('pending_song');
      // Jump straight to the scanned card!
      window.location.href = `${window.location.pathname}?song=${encodeURIComponent(pendingSong)}`;
      return { authenticated: true, token, provider: 'spotify' };
    }

    return { authenticated: true, token, provider: 'spotify' };
  } 
  
  const selectedProvider = sessionStorage.getItem('selected_provider');
  if (selectedProvider === 'choose') return { authenticated: false };
  if (selectedProvider === 'tidal') {
    activeProvider = 'tidal';
    return { authenticated: true, provider: 'tidal' };
  }

  if (spotify.getToken()) {
    activeProvider = 'spotify';
    return { authenticated: true, token: spotify.getToken(), provider: 'spotify' };
  }

  return { authenticated: false };
}

export async function initPlayer(onReady, onError, onStateChange) {
  if (activeProvider === 'spotify') {
    await spotify.initPlayer(onReady, onError, onStateChange);
  } else {
    onError('TIDAL preview playback is awaiting app credentials and a token service.');
  }
}

export async function playTrack(trackId) {
  if (activeProvider === 'spotify') {
    await spotify.playTrack(trackId);
  }
}

export async function pauseTrack() {
  if (activeProvider === 'spotify') {
    await spotify.pauseTrack();
  }
}

export async function togglePlay() {
  if (activeProvider === 'spotify') {
    await spotify.togglePlay();
  }
}

export async function getCurrentState() {
  if (activeProvider === 'spotify') {
    return await spotify.getCurrentState();
  }
  return null;
}