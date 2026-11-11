import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ command, isPreview, mode }) => {
  const useHttps = command === 'serve' && !isPreview && mode !== 'development-http';
  return {
    base: '/rocking-around/',
    plugins: [useHttps && mkcert({ hosts: ['127.0.0.1', 'localhost'] })]
  };
});
