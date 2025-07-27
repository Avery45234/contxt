import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

// This is the definitive, stable configuration for a Manifest V3 extension
// using the CRXJS Vite plugin.
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest: manifest as ManifestV3Export }),
    ],
    server: {
        port: 5175,
        strictPort: true,
        hmr: {
            port: 5175,
        },
        // THE DEFINITIVE FIX:
        // Enable the CORS middleware. This is required for the extension's
        // sandboxed pages (chrome-extension://) to communicate with the dev server.
        cors: true,
    },
});