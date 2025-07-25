import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    // This is required to ensure that the content script can access the static publishers.json
    build: {
        rollupOptions: {
            input: {
                sidebar: 'src/ui/sidebar.html',
            },
        },
    },
});