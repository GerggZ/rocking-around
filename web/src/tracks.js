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
