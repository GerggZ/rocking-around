import * as spotify from './authenticate_spotify.js';

let activeProvider = 'spotify';

export async function login(provider = 'spotify') {
  activeProvider = provider;
  if (provider === 'spotify') {
    await spotify.login();
  }
}

// Automatically uses the current window location (localhost during dev, github.io in production)
const REDIRECT_URI = window.location.origin + window.location.pathname;

export async function checkAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const token = await spotify.handleCallback(code);

    // 🎯 Check if there was a saved card waiting before login!
    const pendingSong = sessionStorage.getItem('pending_song');
    if (pendingSong) {
      sessionStorage.removeItem('pending_song');
      // Jump straight to the scanned card!
      window.location.href = `${window.location.pathname}?song=${pendingSong}`;
      return { authenticated: true, token, provider: 'spotify' };
    }

    return { authenticated: true, token, provider: 'spotify' };
  } 
  
  else if (spotify.getToken()) {
    return { authenticated: true, token: spotify.getToken(), provider: 'spotify' };
  }

  return { authenticated: false };
}

export async function initPlayer(onReady, onError, onStateChange) {
  if (activeProvider === 'spotify') {
    await spotify.initPlayer(onReady, onError, onStateChange);
  }
}

export async function playTrack(trackId) {
  if (activeProvider === 'spotify') {
    await spotify.playTrack(trackId);
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