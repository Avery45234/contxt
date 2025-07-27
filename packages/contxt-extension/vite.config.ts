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
    // THE DEFINITIVE FIX:
    // This server configuration is required for HMR to work correctly with
    // a Manifest V3 service worker. It establishes a stable port and prevents
    // the cross-origin errors that were causing the registration to fail.
    server: {
        port: 5175,
        strictPort: true,
        hmr: {
            port: 5175,
        },
    },
});