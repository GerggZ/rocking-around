// Replace with your raw GitHub CSV URL
const ONLINE_CSV_URL = 'https://raw.githubusercontent.com/gerggz/rocking-around/main/src/tracks.csv';

function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return {};
  
  const headers = lines[0].split(',').map(h => h.trim());
  const database = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

    const entry = {};
    headers.forEach((header, index) => {
      let val = cleanValues[index] || '';
      if (header === 'year' || header === 'id') {
        val = Number(val) || val;
      }
      entry[header] = val;
    });

    if (entry.id) {
      database[entry.id] = {
        title: entry.title,
        artist: entry.artist,
        album: entry.album,
        year: entry.year,
        spotify: entry.spotify || '',
        apple: entry.apple || '',
        youtube: entry.youtube || ''
      };
    }
  }

  return database;
}

export let TRACK_DATABASE = {};

export async function loadTracksOnline() {
  try {
    const response = await fetch(ONLINE_CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch tracks CSV');
    const csvText = await response.text();
    TRACK_DATABASE = parseCSV(csvText);
    return TRACK_DATABASE;
  } catch (err) {
    console.error('Error loading dynamic tracks:', err);
    return {};
  }
}

export function getTrackByNumber(songNumber) {
  return TRACK_DATABASE[songNumber] || null;
}

export function getPlatformTrackId(songNumber, provider = 'spotify') {
  const song = TRACK_DATABASE[songNumber];
  if (!song) return null;
  return song[provider] || null;
}