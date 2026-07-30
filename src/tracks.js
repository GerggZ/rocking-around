import csvText from './tracks.csv?raw';

// Lightweight CSV Parser (handles quotes and commas gracefully)
function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  const database = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Regex to split on commas while ignoring commas inside quoted strings
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

// Export parsed database
export const TRACK_DATABASE = parseCSV(csvText);

/**
 * Gets local song metadata by song number
 */
export function getTrackByNumber(songNumber) {
  return TRACK_DATABASE[songNumber] || null;
}

/**
 * Gets the platform-specific ID for a given track number
 */
export function getPlatformTrackId(songNumber, provider = 'spotify') {
  const song = TRACK_DATABASE[songNumber];
  if (!song) return null;
  return song[provider] || null;
}