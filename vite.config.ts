export default defineConfig({
  base: '/mancala-game/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mancala',
        short_name: 'Mancala',
        start_url: '/mancala-game/',
        display: 'standalone',
        background_color: '#ffffff',
        description: 'Mancala game with strong AI',
        icons: []
      }
    })
  ]
});
