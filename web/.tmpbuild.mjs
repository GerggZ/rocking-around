import { build } from 'vite';
await build({ root: process.cwd(), logLevel: 'warn', build: { outDir: '/tmp/rabuild', emptyOutDir: true, cssMinify: false } });
console.log('BUILD OK');
