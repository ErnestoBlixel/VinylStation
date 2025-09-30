import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare'; // ✅ Reactivado para APIs

// https://astro.build/config
export default defineConfig({
  site: 'https://vinylstation.es',
  // 🔧 CAMBIO CRÍTICO: Activar SSR para APIs de formularios
  output: 'hybrid', // ✅ Permite páginas estáticas + APIs server-side
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(), 
    tailwind(), 
    sitemap({
      // [configuración del sitemap sin cambios]
      filter: (page) => {
        const excludedPages = [
          '/api/', '/404', '/test-', '/page/',
        ];
        const excludedPatterns = [
          'https://vinylstation.es/vinilos/page/1',
          'https://vinylstation.es/noticias/page/1',
          'https://vinylstation.es/programas/page/1',
        ];
        const isExcluded = excludedPages.some(excluded => page.includes(excluded));
        const isPatternExcluded = excludedPatterns.some(pattern => page === pattern);
        return !isExcluded && !isPatternExcluded;
      },
      customPages: [
        'https://vinylstation.es/',
        'https://vinylstation.es/en-directo',
        'https://vinylstation.es/vinilos',
        'https://vinylstation.es/noticias',
        'https://vinylstation.es/programas',
        'https://vinylstation.es/contacto',
        'https://vinylstation.es/aviso-legal',
        'https://vinylstation.es/politica-cookies-privacidad',
        'https://vinylstation.es/politica-devoluciones',
        'https://vinylstation.es/politicas-legales',
      ],
      serialize: (item) => {
        if (item.url === 'https://vinylstation.es/') {
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString().split('T')[0] };
        }
        if (item.url.includes('/en-directo')) {
          return { ...item, changefreq: 'always', priority: 0.9, lastmod: new Date().toISOString().split('T')[0] };
        }
        if (item.url.includes('/vinilos')) {
          if (item.url.match(/\/vinilos\/[^\/]+$/) && !item.url.includes('/page/')) {
            return { ...item, changefreq: 'weekly', priority: 0.9 };
          }
          if (item.url === 'https://vinylstation.es/vinilos') {
            return { ...item, changefreq: 'daily', priority: 0.8 };
          }
        }
        if (item.url.includes('/noticias')) {
          if (item.url.match(/\/noticias\/[^\/]+$/) && !item.url.includes('/page/')) {
            return { ...item, changefreq: 'monthly', priority: 0.9 };
          }
          if (item.url === 'https://vinylstation.es/noticias') {
            return { ...item, changefreq: 'daily', priority: 0.8 };
          }
        }
        if (item.url.includes('/programas')) {
          if (item.url.match(/\/programas\/[^\/]+$/)) {
            return { ...item, changefreq: 'weekly', priority: 0.8 };
          }
          if (item.url === 'https://vinylstation.es/programas') {
            return { ...item, changefreq: 'weekly', priority: 0.7 };
          }
        }
        if (item.url.includes('/contacto')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        if (item.url.includes('/aviso-legal') || item.url.includes('/politica-') || item.url.includes('/politicas-legales')) {
          return { ...item, changefreq: 'yearly', priority: 0.3 };
        }
        if (item.url.includes('/search') || item.url.includes('/vinilos-search')) {
          return { ...item, changefreq: 'weekly', priority: 0.4 };
        }
        return { ...item, changefreq: 'monthly', priority: 0.5 };
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    format: 'directory',
    assets: '_assets',
  },
  // ✅ VARIABLES DE ENTORNO MEJORADAS
  vite: {
    define: {
      'import.meta.env.PUBLIC_WORDPRESS_API_URL': JSON.stringify('https://cms.vinylstation.es/wp-json'),
      'import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL': JSON.stringify('https://cms.vinylstation.es/graphql'),
    },
    server: {
      proxy: {
        // ✅ Proxy mejorado para APIs de WordPress
        '/api/wordpress': {
          target: 'https://cms.vinylstation.es/wp-json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wordpress/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  },
  // ✅ CONFIGURACIÓN ESPECÍFICA PARA CLOUDFLARE PAGES
  experimental: {
    serverIslands: false // Desactivar para evitar problemas con Cloudflare
  }
});
