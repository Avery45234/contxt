import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
// Point to the manifest at the new root location
import manifest from './manifest.json' with { type: 'json' };
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    build: {
        // Re-introduce rollupOptions with the correct, absolute paths to the root entry points
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
});