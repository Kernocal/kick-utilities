import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import manifest from './src/manifest';
import packageData from './package.json';
import { BROWSER, PRODUCTION, ZIP } from './src/env';

export default defineConfig(({ mode }) => {
    return {
        build: {
            emptyOutDir: true,
            outDir: 'build',
            rollupOptions: {
                output: {
                    chunkFileNames: 'assets/chunk-[hash].js',
                },
            },
        },
        plugins: [
            UnoCSS(), 
            crx({ manifest: manifest, browser: BROWSER }), 
            react(),
            PRODUCTION && ZIP && zipPack({
                outFileName: `kick-utilites-${packageData.version}-${BROWSER === 'firefox' ? 'ff' : 'cr'}.zip`,
                inDir: 'build',
                outDir: 'artifacts'
            })
        ],
    };
});
