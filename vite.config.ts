import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/mancala-2/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mancala',
        short_name: 'Mancala',
        start_url: '/mancala-2/',
        display: 'standalone',
        background_color: '#ffffff',
        description: 'Mancala game with strong AI',
        icons: []
      }
    })
  ]
});
