import myHits from './decks/my_hits.csv?raw';
import country from './decks/country.csv?raw';
import classic from './decks/classic.csv?raw';
import oneHitWonders from './decks/one_hit_wonders.csv?raw';
import covers from './decks/covers_vs_originals.csv?raw';

function parseDeck(csv) {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const columns = header.split(',');

  return lines.map(line => {
    const values = [...line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)]
      .map(([, quoted, plain]) => quoted === undefined ? plain : quoted.replaceAll('""', '"'));
    return Object.fromEntries(columns.map((column, index) => [column, values[index]]));
  });
}

export const decks = [
  { id: 'my-hits', name: 'My Hits', csv: myHits },
  { id: 'country', name: 'Country', csv: country },
  { id: 'classic', name: 'Classic Hitster', csv: classic },
  { id: 'one-hit-wonders', name: 'One-Hit Wonders', csv: oneHitWonders },
  { id: 'covers-vs-originals', name: 'Covers vs Originals', csv: covers }
].map(({ id, name, csv }) => ({ id, name, tracks: parseDeck(csv) }));

const recordings = new Map();
for (const { tracks } of decks) {
  for (const track of tracks) {
    const existing = recordings.get(track.UniqueID);
    if (!existing) {
      recordings.set(track.UniqueID, { ...track });
    } else {
      for (const provider of ['spotify', 'tidal', 'itunes', 'youtube']) {
        if (!existing[provider] && track[provider]) existing[provider] = track[provider];
      }
    }
  }
}

export function getTrackById(id) {
  return recordings.get(id) ?? null;
}

// --- SAVED PLAYLIST DECKS ---
// Spotify playlists added on the main screen become extra decks. They are kept
// in this browser (localStorage) until removed or the browser data is cleared.
// Songs that are already in a built-in deck reuse that card (and its checked year).
const PLAYLISTS_KEY = 'saved_playlists';
const playlistDeckId = spotifyId => `pl-${spotifyId}`;

const cardBySpotifyId = new Map();
for (const track of recordings.values()) {
  if (track.spotify && !cardBySpotifyId.has(track.spotify)) cardBySpotifyId.set(track.spotify, track.UniqueID);
}

let savedPlaylists = [];   // as stored: { id, name, tracks: [{ title, artist, album, year, spotify }] }
let playlistDecks = [];

function toDeck(playlist) {
  const tracks = playlist.tracks.map(track => {
    const known = cardBySpotifyId.get(track.spotify);
    if (known) return recordings.get(known);
    const UniqueID = `sp-${track.spotify}`;
    if (!recordings.has(UniqueID)) recordings.set(UniqueID, { ...track, UniqueID });
    return recordings.get(UniqueID);
  });
  return { id: playlistDeckId(playlist.id), name: playlist.name, playlistId: playlist.id, tracks, playlist: true };
}

function storePlaylists(list) {
  // Throws when the browser is out of storage space; the caller reports it.
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list));
  savedPlaylists = list;
  playlistDecks = list.map(toDeck);
}

export function getPlaylistDecks() {
  return playlistDecks;
}

// Adds a playlist (or refreshes it, when the same playlist is added again) and returns its deck.
export function addPlaylistDeck(playlist) {
  storePlaylists([playlist, ...savedPlaylists.filter(saved => saved.id !== playlist.id)]);
  return playlistDecks[0];
}

export function removePlaylistDeck(deckId) {
  storePlaylists(savedPlaylists.filter(saved => playlistDeckId(saved.id) !== deckId));
}

try {
  const stored = JSON.parse(localStorage.getItem(PLAYLISTS_KEY) || '[]');
  if (Array.isArray(stored)) {
    savedPlaylists = stored.filter(saved => saved?.id && saved.tracks?.length);
    playlistDecks = savedPlaylists.map(toDeck);
  }
} catch {}

export function allDecks() {
  return [...playlistDecks, ...decks];
}

// Several decks can be played together: their ids joined with "+" (e.g.
// "playlist+classic") make one mixed deck.
export function getDeck(id) {
  if (!id) return null;
  const parts = String(id).split('+')
    .map(part => allDecks().find(deck => deck.id === part))
    .filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? null;
  return {
    id: parts.map(deck => deck.id).join('+'),
    name: parts.map(deck => deck.name).join(' + '),
    tracks: parts.flatMap(deck => deck.tracks),
    parts
  };
}
