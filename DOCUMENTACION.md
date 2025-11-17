# 📋 VinylStation - Documentación Técnica Completa

> **Versión**: 1.0.0 (Septiembre 2025)
> **Tecnología**: Astro 5.0 + Cloudflare + WordPress Headless
> **Estado**: Proyecto en producción

## 🚀 RESUMEN EJECUTIVO

VinylStation es una plataforma para amantes de la música que combina una emisora de radio online con una tienda de vinilos y merchandising. Desarrollada con **Astro 5** y desplegada en **Cloudflare**, utiliza WordPress como CMS headless para gestionar todo el contenido dinámico mediante GraphQL.

### ✅ Características Principales:
- **Radio Online**: Streaming y programación dinámica
- **Catálogo de Vinilos**: Integrado con WordPress
- **Tienda de Merchandising**: Con políticas de devolución
- **Noticias Dinámicas**: Blog musical sincronizado con WordPress
- **Formularios Avanzados**: Integración con Gravity Forms
- **SEO Optimizado**: Meta tags, sitemap, y estructura semántica
- **Legal Compliant**: RGPD, cookies, aviso legal completo

---

## 📂 ESTRUCTURA DEL PROYECTO

```
VinylStation/
├── astro.config.mjs       # Configuración Astro + Cloudflare
├── tailwind.config.js     # Configuración de Tailwind CSS
├── tsconfig.json          # Configuración TypeScript
├── package.json           # Dependencias y scripts
├── public/                # Archivos estáticos
│   ├── images/            # Imágenes y recursos gráficos
│   ├── scripts/           # Scripts cliente (interactive-features.js)
│   ├── styles/            # Estilos globales (global.css)
│   ├── _headers           # Configuración Cloudflare
│   ├── _redirects         # Redirecciones
│   └── _routes.json       # Configuración de rutas
├── src/
│   ├── pages/             # Páginas de la aplicación
│   │   ├── api/           # Endpoints de API (Gravity Forms, etc.)
│   │   ├── noticias/      # Blog y noticias
│   │   ├── programas/     # Programas de radio
│   │   ├── vinilos/       # Catálogo de vinilos
│   │   └── [otras].astro  # Páginas estáticas (contacto, legal, etc.)
│   ├── components/        # Componentes reutilizables
│   │   ├── analytics/     # Componentes de analytics
│   │   ├── legal/         # Componentes para páginas legales
│   │   └── [otros].astro  # Componentes principales
│   ├── layouts/           # Layouts base
│   └── lib/               # Utilidades y API WordPress
└── wordpress-config/      # Configuración para WordPress
```

---

## 🔧 STACK TECNOLÓGICO

### Frontend:
- **Framework**: [Astro 5.0](https://astro.build) (SSR habilitado)
- **Adaptador**: [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- **CSS**: [Tailwind CSS](https://tailwindcss.com)
- **JavaScript**: Vanilla JS con componentes interactivos

### Backend y CMS:
- **CMS**: WordPress con [WPGraphQL](https://www.wpgraphql.com/)
- **API**: GraphQL para contenido dinámico
- **Formularios**: Gravity Forms

### Hosting y Despliegue:
- **Plataforma**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **CI/CD**: Despliegue automático desde GitHub
- **Cache**: Cloudflare CDN

---

## 🌐 INTEGRACIÓN CON WORDPRESS

### Configuración WordPress:

1. **Plugins Requeridos**:
   - ✅ WPGraphQL (plugin principal)
   - ✅ WPGraphQL for ACF (campos personalizados)
   - ✅ WPGraphQL for CPT UI (tipos de post personalizados)
   - ✅ Advanced Custom Fields
   - ✅ Gravity Forms (formularios)

2. **Tipos de Contenido**:
   - 📻 **Programas**: Programas de radio con horarios
   - 💿 **Vinilos**: Catálogo de vinilos con metadata
   - 📰 **Noticias**: Blog y noticias (posts estándar)
   - 🏬 **Merchandising**: Productos de la tienda

3. **Endpoints GraphQL**:
   ```
   PUBLIC_WORDPRESS_GRAPHQL_URL=https://cms.vinylstation.es/graphql
   PUBLIC_WORDPRESS_API_URL=https://cms.vinylstation.es/wp-json
   ```

### Cliente GraphQL:

El proyecto utiliza `graphql-request` para realizar consultas a WordPress. Las consultas están definidas en `src/lib/wordpress.js`.

Ejemplo de consulta:
```javascript
// Consulta para obtener programas
export async function getProgramas() {
  const query = `
    query Programas {
      programas(first: 100) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          camposPrograma {
            vsDescripcion
            vsHorarioTexto
          }
        }
      }
    }
  `;
  
  return executeQuery(query);
}
```

El sistema implementa una estrategia adaptativa que prueba múltiples métodos para obtener los datos:
1. CPT `programas` (plural)
2. CPT `programa` (singular)
3. Posts con categoría específica (fallback)
4. ContentNodes con búsqueda genérica
5. Datos de ejemplo (fallback final)

---

## 📝 FORMULARIOS Y GRAVITY FORMS

### Integración con Gravity Forms:

El proyecto utiliza la API de Gravity Forms para:
1. **Cargar dinámicamente** la estructura del formulario
2. **Enviar datos** del formulario al servidor WordPress
3. **Validar campos** según la configuración de GF

La comunicación se realiza mediante endpoints API personalizados en `src/pages/api/gravity-form.ts`.

### Autenticación:

Se utiliza autenticación básica con credenciales de WordPress:
```javascript
const credentials = btoa(`${username}:${password}`);
const headers = { 'Authorization': `Basic ${credentials}` };
```

Las credenciales están configuradas como variables de entorno:
```
WORDPRESS_USER=usuario
WORDPRESS_APP_PASSWORD=contraseña
```

### Estilización y UX:

Los formularios están mejorados con:
- Efectos visuales (glassmorphism, gradientes)
- Animaciones y transiciones suaves
- Validación en tiempo real
- Diseño responsive y accesible

---

## 🚢 DESPLIEGUE Y PRODUCCIÓN

### Scripts de Despliegue:

```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Desplegar en Cloudflare
npm run deploy
```

### Configuración Cloudflare:

El proyecto utiliza el adaptador `@astrojs/cloudflare` para SSR y está configurado para aprovechar:
- **Workers**: Para funcionalidad dinámica (API endpoints)
- **CDN**: Para archivos estáticos
- **Headers**: Configurados en `public/_headers`
- **Redirects**: Configurados en `public/_redirects`

### Configuración SEO:

- **Sitemap**: Generado automáticamente con `@astrojs/sitemap`
- **Meta tags**: Optimizados para cada tipo de contenido
- **Open Graph**: Para compartir en redes sociales
- **Robots.txt**: Configurado para indexación correcta

---

## 📊 ANALYTICS Y TRACKING

### Google Analytics:

El proyecto incluye configuración para Google Analytics 4 mediante el componente `src/components/analytics/GoogleAnalytics.astro`.

Eventos importantes trackeados:
- Vistas de página
- Interacciones con reproductor de radio
- Envío de formularios
- Navegación entre secciones

### Configuración:

```javascript
// src/lib/analyticsConfig.js
export const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
```

---

## ⚖️ CUMPLIMIENTO LEGAL

### Páginas Legales Implementadas:

1. **Aviso Legal** (`/aviso-legal`)
   - Datos identificativos de la empresa
   - Condiciones de uso
   - Derechos de autor

2. **Política de Privacidad y Cookies** (`/politica-cookies-privacidad`)
   - Cumplimiento RGPD
   - Tipos de cookies
   - Derechos del usuario

3. **Política de Devoluciones** (`/politica-devoluciones`)
   - Derecho de desistimiento
   - Condiciones para devoluciones
   - Proceso de reembolso

4. **Hub Legal** (`/politicas-legales`)
   - Índice centralizado de documentos legales

### Cookies:

El sitio utiliza un sistema de gestión de consentimiento para cookies que:
- Muestra banner de consentimiento en primera visita
- Permite aceptar/rechazar categorías específicas
- Almacena preferencias en localStorage
- Cumple con RGPD y ePrivacy

---

## 🔍 ARCHIVOS NO UTILIZADOS Y OPTIMIZACIÓN

### Archivos de Test y Debug:

Los siguientes archivos son utilizados solo para diagnóstico y pueden ser eliminados en producción:

1. **Scripts mencionados en package.json pero no presentes:**
   - `verificar-sitemap.js`: Verificación de sitemap
   - `check-dynamic-pages.js`: Diagnóstico de páginas dinámicas

2. **Endpoints API de debug:**
   - `src/pages/api/check-env.ts`: Diagnóstico de variables de entorno
   - `src/pages/api/debug-env.ts`: Debug completo de configuración
   - `src/pages/api/gravity-form-debug.ts`: Debug detallado de Gravity Forms
   - `src/pages/api/gravity-form-temp.ts`: Versión temporal de la API
   - `src/pages/api/test-wordpress.ts`: Test de conexión con WordPress

3. **Archivos HTML de prueba:**
   - `public/test-logo.html`: Prueba de animación del logo
   - `public/test-theme.html`: Prueba de tema claro/oscuro

4. **Documentación duplicada:**
   - El proyecto tiene tanto `README.md` como `DOCUMENTATION.md` con información parcialmente redundante
   - Se recomienda unificar en un solo documento de documentación

### Recomendaciones de Limpieza:

1. Eliminar todos los archivos de test y debug mencionados
2. Unificar la documentación en un solo archivo completo
3. Revisar scripts en package.json para eliminar los que hacen referencia a archivos inexistentes
4. Considerar mover los archivos de WordPress a un repositorio separado o subfolder más organizado

---

## 🛠️ DESARROLLO Y MANTENIMIENTO

### Entorno de Desarrollo:

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   ```
   PUBLIC_WORDPRESS_API_URL=https://cms.vinylstation.es/wp-json
   PUBLIC_WORDPRESS_GRAPHQL_URL=https://cms.vinylstation.es/graphql
   WORDPRESS_USER=usuario
   WORDPRESS_APP_PASSWORD=contraseña
   ```
4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Comandos Importantes:

```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run deploy       # Desplegar en Cloudflare
npm run sitemap:generate  # Generar sitemap
```

### Problemas Comunes:

1. **Error "Fragment not exported"**
   - **Solución**: Actualizar imports para compatibilidad con Astro 5

2. **Programas/Vinilos no se muestran**
   - **Solución**: Verificar configuración GraphQL en WordPress

3. **Error en build con tslib**
   - **Solución**: Reinstalar dependencias limpiamente

4. **Problemas con caracteres especiales**
   - **Solución**: Asegurar escape correcto de HTML

---

## 🔮 EVOLUCIÓN Y MEJORAS FUTURAS

### Funcionalidades Planificadas:

1. **Sistema de comentarios**: Para noticias y programas
2. **Newsletter**: Integración con sistema de email marketing
3. **E-commerce completo**: Expandir funcionalidad de tienda
4. **App móvil**: Versión PWA con notificaciones
5. **Streaming avanzado**: Mejora del reproductor con estadísticas

### Optimizaciones Técnicas:

1. **Optimización de imágenes**: Implementar formato WebP y avif
2. **Estrategias de cache avanzadas**: Para mejorar rendimiento
3. **A/B testing**: Para optimizar conversiones
4. **Mejora de accesibilidad**: Auditoría WCAG 2.1

---

## 📞 CONTACTO Y SOPORTE

### Contacto del Proyecto:

- **Emisora**: info@vinylstation.es
- **Tienda**: tienda@vinylstation.es
- **Técnico**: desarrollo@vinylstation.es
- **Legal**: dpo@vinylstation.es

### Equipo:

- **Desarrollo**: Blixel Studio
- **Diseño**: Equipo VinylStation
- **Contenido**: Equipo editorial VinylStation

---

> **Documento generado el 26/09/2025**  
> *Última actualización: 26/09/2025*
