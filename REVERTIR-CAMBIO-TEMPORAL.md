# ⚠️ IMPORTANTE: CAMBIO TEMPORAL

## Archivo modificado:
- `src/lib/wordpress.js`

## Cambio realizado:
- Se hardcodeó la URL de GraphQL temporalmente porque las variables de entorno no se estaban aplicando en Cloudflare

## Para revertir:
Después de confirmar que las variables de entorno funcionan en Cloudflare, cambiar:

```javascript
// De:
const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

// A:
const WORDPRESS_GRAPHQL_URL =
  import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://cms.vinylstation.es/graphql';
```

## Fecha del cambio:
3 de Junio 2025

## Razón:
Las variables de entorno se configuraron en Cloudflare DESPUÉS del último build, por lo que no se aplicaron. Este cambio temporal permite que el sitio funcione mientras se hace un nuevo deployment.
