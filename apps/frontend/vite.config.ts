/// <reference types='vitest' />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import {nxCopyAssetsPlugin} from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,

  server: {
    port: 4200,
    host: 'localhost',
  },
  resolve: {
    dedupe: ['vscode']
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), nxCopyAssetsPlugin(['*.md']), nxViteTsPaths()],

  worker: {
    plugins: () => [nxViteTsPaths()]
  },

  build: {
    target: 'esnext',
    outDir: '../../dist/apps/frontend',
  },
});
