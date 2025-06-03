import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://vinylstation.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    format: 'file',
    assets: '_assets',
  },
  vite: {
    server: {
      proxy: {
        '/api/wordpress': {
          target: 'https://cms.vinylstation.es/wp-json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wordpress/, ''),
        },
      },
    },
  },
});