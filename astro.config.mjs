import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
// import cloudflare from '@astrojs/cloudflare'; // Comentado temporalmente

// https://astro.build/config
export default defineConfig({
  site: 'https://vinylstation.es', // URL de producción correcta
  output: 'static', // Explícitamente estático para Cloudflare Pages
  // adapter: cloudflare(), // No necesario para output estático
  integrations: [
    react(), 
    tailwind(), 
    sitemap({
      // Configuración del sitemap
      filter: (page) => {
        // Excluir páginas que no deben aparecer en el sitemap
        const excludedPages = [
          '/api/', // Excluir endpoints de API
          '/404', // Página de error
          '/vinilos/page/', // 🔥 NUEVA: Excluir páginas de paginación de vinilos
          '/noticias/page/', // 🔥 NUEVA: Excluir páginas de paginación de noticias
        ];
        
        return !excludedPages.some(excluded => page.includes(excluded));
      },
      customPages: [
        // Agregar páginas dinámicas si es necesario
        // 'https://vinylstation.es/noticias/page/2',
        // 'https://vinylstation.es/vinilos/page/2',
      ],
      serialize: (item) => {
        // Personalizar la prioridad y frecuencia de cambio
        if (item.url === 'https://vinylstation.es/') {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0,
          };
        }
        
        if (item.url.includes('/noticias/')) {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.8,
          };
        }
        
        if (item.url.includes('/vinilos/')) {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.8,
          };
        }
        
        if (item.url.includes('/programas/')) {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.7,
          };
        }
        
        if (item.url.includes('/en-directo')) {
          return {
            ...item,
            changefreq: 'always',
            priority: 0.9,
          };
        }
        
        // Páginas legales
        if (item.url.includes('/aviso-legal') || 
            item.url.includes('/politica-') || 
            item.url.includes('/politicas-legales')) {
          return {
            ...item,
            changefreq: 'yearly',
            priority: 0.3,
          };
        }
        
        // Por defecto
        return {
          ...item,
          changefreq: 'monthly',
          priority: 0.5,
        };
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    format: 'directory',  // Cambiado de 'file' a 'directory' para mejor compatibilidad
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
