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
      // 🔧 CONFIGURACIÓN MEJORADA DEL SITEMAP
      filter: (page) => {
        // Excluir páginas que no deben aparecer en el sitemap
        const excludedPages = [
          '/api/', // Excluir endpoints de API
          '/404',  // Página de error
          '/test-', // Páginas de testing
          '/page/', // 🚫 EXCLUIR TODAS LAS PÁGINAS DE PAGINACIÓN
        ];
        
        // 🚫 EXCLUSIONES ESPECÍFICAS (páginas redundantes)
        const excludedPatterns = [
          // Excluir páginas de paginación redundantes (page/1 = mismo contenido que /vinilos)
          'https://vinylstation.es/vinilos/page/1', // Redundante con /vinilos
          'https://vinylstation.es/noticias/page/1', // Redundante con /noticias
          'https://vinylstation.es/programas/page/1', // Redundante con /programas
        ];
        
        // Verificar exclusiones generales
        const isExcluded = excludedPages.some(excluded => page.includes(excluded));
        
        // Verificar patrones específicos
        const isPatternExcluded = excludedPatterns.some(pattern => page === pattern);
        
        return !isExcluded && !isPatternExcluded;
      },
      
      // 🎯 PÁGINAS PERSONALIZADAS (solo páginas esenciales)
      customPages: [
        // Páginas principales que siempre deben estar
        'https://vinylstation.es/',
        'https://vinylstation.es/en-directo',
        'https://vinylstation.es/vinilos',      // Listado principal de vinilos
        'https://vinylstation.es/noticias',     // Listado principal de noticias
        'https://vinylstation.es/programas',    // Listado principal de programas
        'https://vinylstation.es/contacto',
        
        // Páginas legales
        'https://vinylstation.es/aviso-legal',
        'https://vinylstation.es/politica-cookies-privacidad',
        'https://vinylstation.es/politica-devoluciones',
        'https://vinylstation.es/politicas-legales',
        
        // NOTA: Las páginas individuales (/vinilos/[slug], /noticias/[slug], etc.)
        // se detectan automáticamente durante el build de Astro
        // Las páginas de paginación (/page/) están EXCLUIDAS del sitemap
      ],
      
      // 🏷️ CONFIGURACIÓN SEO OPTIMIZADA
      serialize: (item) => {
        // 🏠 HOME - Máxima prioridad
        if (item.url === 'https://vinylstation.es/') {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0,
            lastmod: new Date().toISOString().split('T')[0], // Fecha actual
          };
        }
        
        // 📻 RADIO EN DIRECTO - Muy alta prioridad (contenido principal)
        if (item.url.includes('/en-directo')) {
          return {
            ...item,
            changefreq: 'always',
            priority: 0.9,
            lastmod: new Date().toISOString().split('T')[0],
          };
        }
        
        // 💿 VINILOS - Alta prioridad
        if (item.url.includes('/vinilos')) {
          // Páginas individuales de vinilos (lo más importante)
          if (item.url.match(/\/vinilos\/[^\/]+$/) && !item.url.includes('/page/')) {
            return {
              ...item,
              changefreq: 'weekly',
              priority: 0.9, // 🔥 PRIORIDAD MUY ALTA para vinilos individuales
            };
          }
          // Listado principal de vinilos
          if (item.url === 'https://vinylstation.es/vinilos') {
            return {
              ...item,
              changefreq: 'daily',
              priority: 0.8,
            };
          }
        }
        
        // 📰 NOTICIAS - Alta prioridad
        if (item.url.includes('/noticias')) {
          // Artículos individuales de noticias (contenido único)
          if (item.url.match(/\/noticias\/[^\/]+$/) && !item.url.includes('/page/')) {
            return {
              ...item,
              changefreq: 'monthly',
              priority: 0.9, // 🔥 PRIORIDAD MUY ALTA para noticias individuales
            };
          }
          // Listado principal de noticias
          if (item.url === 'https://vinylstation.es/noticias') {
            return {
              ...item,
              changefreq: 'daily',
              priority: 0.8,
            };
          }
        }
        
        // 📻 PROGRAMAS - Media-alta prioridad
        if (item.url.includes('/programas')) {
          // Programas individuales
          if (item.url.match(/\/programas\/[^\/]+$/)) {
            return {
              ...item,
              changefreq: 'weekly',
              priority: 0.8, // 🔥 PRIORIDAD ALTA para programas individuales
            };
          }
          // Listado principal de programas
          if (item.url === 'https://vinylstation.es/programas') {
            return {
              ...item,
              changefreq: 'weekly',
              priority: 0.7,
            };
          }
        }
        
        // 📞 CONTACTO - Media prioridad
        if (item.url.includes('/contacto')) {
          return {
            ...item,
            changefreq: 'monthly',
            priority: 0.6,
          };
        }
        
        // 📄 PÁGINAS LEGALES - Baja prioridad
        if (item.url.includes('/aviso-legal') || 
            item.url.includes('/politica-') || 
            item.url.includes('/politicas-legales')) {
          return {
            ...item,
            changefreq: 'yearly',
            priority: 0.3,
          };
        }
        
        // 🔍 BÚSQUEDA Y OTROS - Baja prioridad
        if (item.url.includes('/search') || item.url.includes('/vinilos-search')) {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.4,
          };
        }
        
        // 📄 POR DEFECTO
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
