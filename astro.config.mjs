import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://vinylstation.com',
  integrations: [
    // Añadir soporte para componentes React
    react(),
    // Añadir soporte para Tailwind CSS
    tailwind(),
  ],
  // Configuración para desarrollo
  server: {
    // Puerto para desarrollo
    port: 3000,
    // Host para acceder desde dispositivos en red local
    host: true,
  },
  // Configuración para construcción
  build: {
    // Opciones para optimización
    format: 'file',
    assets: '_assets',
  },
  // Variables de entorno públicas - CORREGIDAS
  vite: {
    define: {
      // Usar las URLs de producción directamente
      'import.meta.env.PUBLIC_WORDPRESS_API_URL': JSON.stringify('https://cms.vinylstation.es/wp-json'),
      'import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL': JSON.stringify('https://cms.vinylstation.es/graphql'),
    },
    // CORS para desarrollo
    server: {
      proxy: {
        // Redireccionar solicitudes API para evitar problemas CORS en desarrollo
        '/api/wordpress': {
          target: 'https://cms.vinylstation.es/wp-json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wordpress/, ''),
        },
      },
    },
  },
});
