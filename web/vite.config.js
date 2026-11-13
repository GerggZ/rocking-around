import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { execSync } from 'node:child_process';

// Every build gets a version stamp: when it was built + the git commit.
// It's shown in the "Play with…" menu and written to version.json, which the
// app checks to tell you when a newer version has been published.
function buildVersion() {
  const when = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date());
  let commit = '';
  try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
  return commit ? `${when} · ${commit}` : when;
}

export default defineConfig(({ command, isPreview, mode }) => {
  const useHttps = command === 'serve' && !isPreview && mode !== 'development-http';
  const version = command === 'build' ? buildVersion() : 'dev';
  return {
    base: '/rocking-around/',
    define: { __APP_VERSION__: JSON.stringify(version) },
    plugins: [
      useHttps && mkcert({ hosts: ['127.0.0.1', 'localhost'] }),
      {
        name: 'version-file',
        apply: 'build',
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version }) });
        }
      }
    ]
  };
});
