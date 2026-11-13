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

export function findDeckForCard(songId, preferredDeckId) {
  const matchingDecks = decks.filter(deck =>
    deck.tracks.some(track => track.UniqueID === songId)
  );
  return matchingDecks.find(deck => deck.id === preferredDeckId) ?? matchingDecks[0];
}
