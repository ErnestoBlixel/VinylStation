import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://vinylstation.com',
  output: 'server', // 🎯 ACTIVAR SSR PARA PAGINACIÓN DINÁMICA
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
  // Variables de entorno públicas - RESTAURADAS QUE FUNCIONABAN
  vite: {
    define: {
      // Usar las URLs de producción directamente (ESTO FUNCIONABA)
      'import.meta.env.PUBLIC_WORDPRESS_API_URL': JSON.stringify('https://cms.vinylstation.es/wp-json'),
      'import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL': JSON.stringify('https://cms.vinylstation.es/graphql'),
    },
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