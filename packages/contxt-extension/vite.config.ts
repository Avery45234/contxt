import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import manifest from './manifest.json' with { type: 'json' };
import path from 'path';

// https://vitejs.dev/config/
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
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
    // Use port 5175 as requested.
    server: {
        port: 5175,
        strictPort: true,
        hmr: {
            port: 5175,
        },
    },
});