// iTunes previews: 30-second clips from Apple's public iTunes lookup API.
// No account or developer key is needed, so there is nothing to log in to.
// Apple's terms ask that previews are credited "courtesy of iTunes" (shown in
// the provider menu) and that the lookup API is called sparingly (about 20
// calls per minute), so preview links are cached per track.
export const requiresLogin = false;

const lookupUrl = 'https://itunes.apple.com/lookup';
const previewCache = new Map();
let audio = null;
let audioUnlocked = false;
let silentUrl = null;
let playRequest = 0;

// A fraction of a second of silence. Playing it once during a tap unlocks the
// audio element, so later previews can start without another tap (iOS Safari).
function getSilentUrl() {
  if (silentUrl) return silentUrl;
  const samples = 800;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const text = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + samples, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true); view.setUint32(28, 8000, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true);
  text(36, 'data'); view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) view.setUint8(44 + i, 128);
  silentUrl = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
  return silentUrl;
}

function isSilent() {
  return Boolean(silentUrl) && audio?.src === silentUrl;
}

export function unlockAudio() {
  if (audioUnlocked || !audio) return;
  // A real preview is already loaded: its own play() call unlocks the element.
  if (audio.getAttribute('src') && !isSilent()) return;
  audioUnlocked = true;
  audio.src = getSilentUrl();
  audio.play()
    .then(() => { if (isSilent()) audio.pause(); })
    .catch(() => { audioUnlocked = false; });
}

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
  if (!audio || isSilent()) return null;
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
  audio.addEventListener('playing', () => { audioUnlocked = true; });
  audio.addEventListener('error', () => {
    if (audio.getAttribute('src') && !isSilent()) onError('This iTunes preview could not play. Please try again.');
  });
  onReady();
}

export async function playTrack(trackId) {
  if (!/^[0-9]+$/.test(String(trackId))) {
    throw new Error('This card needs a numeric iTunes track ID.');
  }
  if (!audio) throw new Error('The iTunes player is not ready yet.');
  const request = ++playRequest;
  const url = await getPreviewUrl(String(trackId));
  // Another card was opened while this one was still looking up its preview.
  if (request !== playRequest) return;
  audio.src = url;
  await audio.play();
}

export async function pauseTrack() {
  playRequest++;
  audio?.pause();
}

export async function togglePlay() {
  if (!audio) return;
  if (audio.paused) {
    if (isSilent()) return;
    if (audio.ended) audio.currentTime = 0;
    await audio.play();
  } else {
    audio.pause();
  }
}
