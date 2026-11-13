import { allDecks, getDeck, getTrackById } from './tracks.js';

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

// The deck "Random Card" keeps drawing from after this card: the chosen deck
// (or mix of decks) when it holds the card, otherwise the first deck that does.
export function findDeckForCard(songId, preferredDeckId) {
  const holdsCard = deck => Boolean(deck?.tracks.some(track => track.UniqueID === songId));
  const preferred = getDeck(preferredDeckId);
  return holdsCard(preferred) ? preferred : allDecks().find(holdsCard);
}
