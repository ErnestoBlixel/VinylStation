# 🔧 SOLUCIÓN TEMPORAL: Logo y Programas en VinylStation

## 🚨 Problema Identificado

Tu sitio web tiene dos problemas principales:

1. **El logo no se muestra** - GraphQL no está devolviendo el logo de WordPress
2. **Los programas no se muestran** - GraphQL no encuentra el tipo de contenido "programas"

## 🏃 Solución Rápida

### Paso 1: Ejecutar el Diagnóstico

Primero, ejecuta el script de diagnóstico para ver exactamente qué está pasando:

```bash
node diagnostico-completo.mjs
```

Este script te dirá:
- ✅ Si hay un logo configurado en WordPress
- ✅ Si los programas están disponibles en GraphQL
- ✅ Qué método usar para obtener los datos

### Paso 2: Solución Temporal para el Logo

Mientras tanto, aquí está la solución temporal para que el logo se muestre:

**Edita el archivo `src/lib/wordpress.js`**, busca la función `getSiteLogo()` y reemplázala con:

```javascript
export async function getSiteLogo() {
  console.log('🎯 Obteniendo logo del sitio...');
  
  // Por ahora, usar directamente el logo local
  // mientras se resuelve el problema con WordPress
  console.log('⚠️ Usando logo local temporal');
  
  return {
    url: '/images/logos/vinyl-station-logo.svg',
    altText: 'VinylStation',
    source: 'local-temporal'
  };
}
```

### Paso 3: Solución Temporal para Programas

**En el mismo archivo `src/lib/wordpress.js`**, busca la función `getProgramas()` y reemplázala con:

```javascript
export async function getProgramas({ limit = 10, offset = 0 } = {}) {
  console.log(`📻 Obteniendo programas (limit: ${limit}, offset: ${offset})`);
  
  // Datos de ejemplo mientras se resuelve el problema con GraphQL
  const programasEjemplo = [
    {
      id: 'programa-1',
      title: 'Rock Classics',
      slug: 'rock-classics',
      date: new Date().toISOString(),
      excerpt: 'Los mejores clásicos del rock en vinilo',
      featuredImage: {
        node: {
          sourceUrl: '/images/placeholder-radio.jpg',
          altText: 'Rock Classics'
        }
      },
      camposPrograma: {
        vsDescripcion: 'Un viaje por los mejores álbumes de rock de todos los tiempos',
        vsCabecera: null
      }
    },
    {
      id: 'programa-2',
      title: 'Jazz Sessions',
      slug: 'jazz-sessions',
      date: new Date().toISOString(),
      excerpt: 'El mejor jazz en formato vinilo',
      featuredImage: {
        node: {
          sourceUrl: '/images/placeholder-radio.jpg',
          altText: 'Jazz Sessions'
        }
      },
      camposPrograma: {
        vsDescripcion: 'Explorando los grandes del jazz y sus grabaciones más emblemáticas',
        vsCabecera: null
      }
    },
    {
      id: 'programa-3',
      title: 'Vinyl Treasures',
      slug: 'vinyl-treasures',
      date: new Date().toISOString(),
      excerpt: 'Descubriendo joyas ocultas del vinilo',
      featuredImage: {
        node: {
          sourceUrl: '/images/placeholder-radio.jpg',
          altText: 'Vinyl Treasures'
        }
      },
      camposPrograma: {
        vsDescripcion: 'Cada semana exploramos álbumes poco conocidos pero extraordinarios',
        vsCabecera: null
      }
    }
  ];

  // Limitar según el parámetro
  const programasLimitados = programasEjemplo.slice(offset, offset + limit);

  return {
    programas: programasLimitados,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      endCursor: null,
      startCursor: null
    }
  };
}
```

### Paso 4: Reiniciar el Servidor

Después de hacer estos cambios:

```bash
# Detener el servidor (Ctrl+C)
# Volver a iniciarlo
npm run dev
```

## 🎯 Solución Permanente

Basándote en los resultados del diagnóstico, necesitarás:

### Para el Logo:
1. **En WordPress**: Ve a `Apariencia → Personalizar → Identidad del sitio`
2. **Sube un logo** si no hay ninguno
3. **O instala/activa** el plugin WPGraphQL si no está activo

### Para los Programas:
1. **Si usas Custom Post Type UI**:
   - Ve a `CPT UI → Post Types → Editar "programas"`
   - En la sección "Settings", activa:
     - `Show in GraphQL`: `true`
     - `GraphQL Single Name`: `programa`
     - `GraphQL Plural Name`: `programas`

2. **Si los programas son posts normales**:
   - Crea una categoría llamada "Programas"
   - Asigna esa categoría a los posts de programas

3. **Verifica que tienes programas publicados** (no en borrador)

## 📝 Notas Adicionales

- El diagnóstico te dirá exactamente qué configurar
- Los datos de ejemplo son temporales y se verán reemplazados cuando configures WordPress correctamente
- Si el diagnóstico encuentra un logo o programas, te mostrará el código exacto para usar

## 🆘 ¿Necesitas más ayuda?

Después de ejecutar el diagnóstico, comparte los resultados y podré darte instrucciones más específicas para tu caso particular.
