import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { createTidalAudioHandler } from './server/tidal-audio.js';

export default defineConfig(({ command, isPreview, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useHttps = command === 'serve' && !isPreview && mode !== 'development-http';
  return {
    base: '/rocking-around/',
    plugins: [useHttps && mkcert({ hosts: ['127.0.0.1', 'localhost'] }), {
      name: 'tidal-audio-relay',
      configureServer(server) {
        const handleAudio = createTidalAudioHandler(env);
        server.middlewares.use((request, response, next) => {
          if (new URL(request.url, 'http://localhost').pathname === '/api/tidal/audio') {
            void handleAudio(request, response);
          } else {
            next();
          }
        });
      }
    }]
  };
});
