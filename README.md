# VinylStation - Frontend con Astro

Este proyecto es el frontend de VinylStation, una plataforma para amantes de los vinilos, podcasts y música en general. Está construido con Astro y se conecta a una API de WordPress a través de GraphQL.

## Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- WordPress con WPGraphQL instalado y configurado

## Configuración

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PUBLIC_WORDPRESS_API_URL=http://tu-wordpress/wp-json
PUBLIC_WORDPRESS_GRAPHQL_URL=http://tu-wordpress/graphql
```

Reemplaza `http://tu-wordpress` con la URL de tu instalación de WordPress.

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000`.

## Construcción

Para construir el proyecto para producción:

```bash
npm run build
```

Los archivos generados estarán en el directorio `dist/`.

## Estructura del proyecto

- `src/components/`: Componentes reutilizables
- `src/layouts/`: Layouts para las páginas
- `src/pages/`: Páginas de la aplicación
- `src/lib/`: Utilidades y funciones auxiliares
- `public/`: Archivos estáticos

## Conexión con WordPress

Este proyecto utiliza GraphQL para conectarse a WordPress. Las consultas están definidas en `src/lib/wordpress.js`.

### Tipos de contenido disponibles:

- Vinilos
- Podcasts
- Programas
- Eventos
- Noticias
- Emisora

## Personalización

Puedes personalizar el aspecto de la aplicación modificando los archivos CSS en `src/styles/` o utilizando Tailwind CSS.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.
