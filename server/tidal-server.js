import { createServer } from 'node:http';
import { createTidalAudioHandler } from './tidal-audio.js';

const handleAudio = createTidalAudioHandler(process.env);
const server = createServer((request, response) => {
  if (new URL(request.url, 'http://localhost').pathname === '/api/tidal/audio') {
    void handleAudio(request, response);
  } else {
    response.writeHead(404).end();
  }
});

server.listen(Number(process.env.PORT || 8787), process.env.TIDAL_HOST || '127.0.0.1', () => {
  console.log('TIDAL audio relay listening on port ' + server.address().port);
});
