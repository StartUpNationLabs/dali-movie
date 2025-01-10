/* eslint-disable header/header */
import {defineConfig} from 'vite';
import * as path from 'path';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
    return {
        build: {
            target: 'esnext',
            rollupOptions: {
                input: {
                    index: path.resolve(__dirname, 'index.html'),
                    monacoClassic: path.resolve(__dirname, 'static/monacoClassic.html'),
                    monacoExtended: path.resolve(__dirname, 'static/monacoExtended.html'),
                    react: path.resolve(__dirname, 'static/react.html')
                }
            }
        },
        resolve: {
            dedupe: ['vscode']
        },
        optimizeDeps: {
            esbuildOptions: {
                plugins: [
                    importMetaUrlPlugin
                ]
            }
        },
        server: {
            port: 5173
        },
        plugins: [react()],
    };
});
