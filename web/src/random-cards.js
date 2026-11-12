import { decks, getTrackById } from './tracks.js';

export function getPlayableCardIds(deck, provider) {
  const ids = new Set(deck.tracks.map(track => track.UniqueID));
  return [...ids].filter(id => {
    const track = getTrackById(id);
    return provider ? track?.[provider] : track?.spotify || track?.tidal || track?.itunes;
  });
}

export function pickRandomCard(candidates) {
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function findDeckForCard(deckId, songId) {
  return decks.find(deck =>
    deck.id === deckId &&
    deck.tracks.some(track => track.UniqueID === songId)
  ) ?? null;
}

// The deck a random card came from is kept in the browser history entry, so
// "Next Random Card" still works after a reload or Back/Forward.
export function restoreRandomDeck(songId) {
  return findDeckForCard(window.history.state?.randomDeckId, songId);
}
