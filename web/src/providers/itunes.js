// iTunes previews: 30-second clips from Apple's public iTunes lookup API.
// No account or developer key is needed, so there is nothing to log in to.
// Apple's terms ask that previews are credited "courtesy of iTunes" (shown in
// the provider menu) and that the lookup API is called sparingly (about 20
// calls per minute), so preview links are cached per track.
export const requiresLogin = false;

const lookupUrl = 'https://itunes.apple.com/lookup';
const previewCache = new Map();
let audio = null;

export async function login() {}
export function logout() {}
export function isCallback() { return false; }
export async function handleCallback() {}
export function hasSession() { return true; }

// The lookup API has no CORS headers but supports JSONP via `callback`.
function lookup(trackId) {
  return new Promise((resolve, reject) => {
    const callbackName = '__itunesLookup' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timer = setTimeout(() => finish(new Error('iTunes did not answer. Please try again.')), 10000);
    function finish(error, data) {
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();
      if (error) reject(error);
      else resolve(data);
    }
    window[callbackName] = data => finish(null, data);
    script.onerror = () => finish(new Error('Could not reach iTunes. Please try again.'));
    script.src = lookupUrl + '?' + new URLSearchParams({ id: trackId, entity: 'song', callback: callbackName });
    document.head.appendChild(script);
  });
}

async function getPreviewUrl(trackId) {
  if (previewCache.has(trackId)) return previewCache.get(trackId);
  const data = await lookup(trackId);
  const track = data?.results?.find(result => String(result.trackId) === String(trackId));
  if (!track?.previewUrl) throw new Error('iTunes has no preview for this card.');
  previewCache.set(trackId, track.previewUrl);
  return track.previewUrl;
}

export function getCurrentState() {
  if (!audio) return null;
  return {
    paused: audio.paused,
    position: audio.currentTime * 1000,
    duration: (Number.isFinite(audio.duration) ? audio.duration : 30) * 1000
  };
}

export async function initPlayer(onReady, onError, onStateChange) {
  audio = new Audio();
  audio.preload = 'none';
  for (const type of ['play', 'pause', 'ended', 'loadedmetadata']) {
    audio.addEventListener(type, () => onStateChange(getCurrentState()));
  }
  audio.addEventListener('error', () => {
    if (audio.getAttribute('src')) onError('This iTunes preview could not play. Please try again.');
  });
  onReady();
}

export async function playTrack(trackId) {
  if (!/^[0-9]+$/.test(String(trackId))) {
    throw new Error('This card needs a numeric iTunes track ID.');
  }
  if (!audio) throw new Error('The iTunes player is not ready yet.');
  audio.src = await getPreviewUrl(String(trackId));
  await audio.play();
}

export async function pauseTrack() {
  audio?.pause();
}

export async function togglePlay() {
  if (!audio) return;
  if (audio.paused) {
    if (audio.ended) audio.currentTime = 0;
    await audio.play();
  } else {
    audio.pause();
  }
}
