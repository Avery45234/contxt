import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        crx({ manifest: manifest as ManifestV3Export }),
    ],
    build: {
        rollupOptions: {
            input: {
                sidebar: path.resolve(__dirname, 'sidebar.html'),
                devtools: path.resolve(__dirname, 'devtools.html'),
            },
        },
    },
    server: {
        port: 5175,
        strictPort: true,
        hmr: {
            port: 5175,
        },
        cors: true,
    },
});