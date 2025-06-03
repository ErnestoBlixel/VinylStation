# Configuración de Cloudflare Pages para VinylStation

## ⚠️ IMPORTANTE: Variables de Entorno

Para que el sitio funcione correctamente en Cloudflare Pages, **DEBES** configurar las siguientes variables de entorno:

### 1. En el Panel de Cloudflare Pages:

1. Ve a tu proyecto en Cloudflare Pages
2. Click en **Settings** → **Environment variables**
3. Añade estas variables:

```
PUBLIC_WORDPRESS_API_URL = https://cms.vinylstation.es/wp-json
PUBLIC_WORDPRESS_GRAPHQL_URL = https://cms.vinylstation.es/graphql
```

### 2. Después de añadir las variables:

**IMPORTANTE**: Debes hacer un nuevo deployment para que las variables se apliquen:

- Opción A: Haz click en "Retry deployment" en el último build
- Opción B: Haz un nuevo commit y push

### 3. Verificar que funciona:

1. Accede a: https://tudominio.pages.dev/diagnostico
2. Verifica que las variables aparecen correctamente
3. Ejecuta los tests de conectividad

### 4. Si sigue sin funcionar:

#### Verificar CORS en WordPress:

Añade esto al `functions.php` de tu tema WordPress:

```php
// Permitir CORS para Cloudflare Pages
add_action('init', function() {
    header("Access-Control-Allow-Origin: https://2e43605e.vinylstation.pages.dev");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
});
```

#### Verificar que WordPress GraphQL funciona:

- https://cms.vinylstation.es/graphql debe estar accesible
- https://cms.vinylstation.es/wp-json debe devolver JSON

### 5. Archivos de configuración:

- `.nvmrc`: Especifica Node.js v20 para Cloudflare
- `wrangler.toml`: Configuración adicional para Cloudflare Workers
- `.env`: Variables locales (NO subir a git)
- `.env.production`: Variables de producción (NO subir a git)

### 6. Comandos útiles:

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview local del build
npm run preview
```

### 7. Solución de problemas comunes:

- **Error "VinylStation (Error)"**: Las variables de entorno no están configuradas
- **Error CORS**: WordPress no permite peticiones desde Cloudflare
- **404 en páginas**: Verificar que el build es tipo "server" no "static"

## Configuración del dominio personalizado

Para usar demo.vinylstation.es:

1. En Cloudflare Pages → Custom domains
2. Add custom domain: `demo.vinylstation.es`
3. Añadir registro CNAME en tu DNS:
   ```
   Type: CNAME
   Name: demo
   Content: 2e43605e.vinylstation.pages.dev
   ```

---
Última actualización: 3 de Junio 2025
