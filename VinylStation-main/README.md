# VinylStation - Plataforma Radio y Vinilos

## 📋 Descripción

VinylStation es una plataforma para amantes de la música que combina una emisora de radio online con una tienda de vinilos y merchandising. Desarrollada con **Astro 5** y desplegada en **Cloudflare**, utiliza WordPress como CMS headless para gestionar todo el contenido dinámico mediante GraphQL.

## 🚀 Características Principales

- **Radio Online**: Streaming y programación dinámica
- **Catálogo de Vinilos**: Integrado con WordPress
- **Tienda de Merchandising**: Con políticas de devolución
- **Noticias Dinámicas**: Blog musical sincronizado con WordPress
- **SEO Optimizado**: Meta tags, sitemap, y estructura semántica

## 🔧 Inicio Rápido

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en `.env`:
   ```
   PUBLIC_WORDPRESS_API_URL=https://cms.vinylstation.es/wp-json
   PUBLIC_WORDPRESS_GRAPHQL_URL=https://cms.vinylstation.es/graphql
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📚 Documentación Completa

Para información detallada sobre el proyecto, incluyendo:
- Arquitectura técnica
- Integración con WordPress
- Configuración de formularios
- Despliegue en producción
- y más...

Consulta el archivo [DOCUMENTATION-COMPREHENSIVE.md](./DOCUMENTATION-COMPREHENSIVE.md)

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT.

---

**Desarrollado por Blixel Studio**  
*Última actualización: Septiembre 2025*
