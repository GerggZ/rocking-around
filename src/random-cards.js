import { decks, getTrackById } from './tracks.js';

const pendingDrawKey = 'pending_random_draw';

export function getPlayableCardIds(deck, provider) {
  const ids = new Set(deck.tracks.map(track => track.UniqueID));
  return [...ids].filter(id => {
    const track = getTrackById(id);
    return provider ? track?.[provider] : track?.spotify || track?.tidal;
  });
}

export function openRandomCard(deck, candidates) {
  const song = candidates[Math.floor(Math.random() * candidates.length)];
  sessionStorage.setItem(pendingDrawKey, new URLSearchParams({ song, deck: deck.id }).toString());
  window.location.href = '?' + new URLSearchParams({ song });
}

export function restoreRandomDeck(songId) {
  const pending = new URLSearchParams(sessionStorage.getItem(pendingDrawKey));
  sessionStorage.removeItem(pendingDrawKey);

  if (songId && pending.get('song') === songId) {
    window.history.replaceState({ ...window.history.state, randomDeckId: pending.get('deck') }, '');
  }

  return decks.find(deck =>
    deck.id === window.history.state?.randomDeckId &&
    deck.tracks.some(track => track.UniqueID === songId)
  );
}
