import * as spotify from './authenticate_spotify.js';

let activeProvider = 'spotify';

export async function login(provider = 'spotify') {
  activeProvider = provider;
  if (provider === 'spotify') {
    await spotify.login();
  }
}

export async function checkAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const token = await spotify.handleCallback(code);
    return { authenticated: true, token, provider: 'spotify' };
  } else if (spotify.getToken()) {
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