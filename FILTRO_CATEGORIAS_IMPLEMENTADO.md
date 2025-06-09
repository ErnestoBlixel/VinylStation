# Implementación de Filtro de Categorías para Vinilos

## Fecha: 09/06/2025

## Cambios realizados:

### 1. Actualización de GraphQL (wordpress.js)
- Agregado campo `vsCategoria` a todas las consultas GraphQL de vinilos
- Actualizado el procesamiento de datos para incluir el campo de categoría
- Modificadas las siguientes funciones:
  - `getVinilos()`
  - `getTodosLosVinilos()`
  - `getVinilosPaginados()`
  - `getViniloBySlug()`

### 2. Página de Vinilos ([...page].astro)
- Implementado sistema de filtrado por categorías: Rock, Metal, Jazz
- Agregado parámetro URL `?categoria=` para mantener el filtro entre páginas
- Actualizada la paginación para preservar el filtro seleccionado
- Agregado UI de botones de filtro con estilos responsivos
- Actualizado el mensaje de información cuando hay un filtro activo

### 3. Página de Búsqueda (vinilos-search.astro)
- Agregado display de categoría en las tarjetas de vinilo
- Agregados estilos para mostrar la categoría

### 4. Página de Detalle ([slug].astro)
- Agregado campo de categoría en la información del vinilo

## Cómo usar:

1. **En WordPress/ACF**: Asegúrate de que el campo `vsCategoria` esté configurado correctamente y contenga valores como "Rock", "Metal" o "Jazz"

2. **URLs de ejemplo**:
   - Todos los vinilos: `/vinilos/page/1/`
   - Solo Rock: `/vinilos/page/1/?categoria=rock`
   - Solo Metal: `/vinilos/page/1/?categoria=metal`
   - Solo Jazz: `/vinilos/page/1/?categoria=jazz`

3. **El filtro es case-insensitive**, por lo que "Rock", "rock" o "ROCK" funcionarán igual

## Próximos pasos:

1. Verificar que todos los vinilos en WordPress tengan el campo categoría correctamente configurado
2. Considerar agregar más categorías según sea necesario
3. Opcionalmente, convertir el campo de texto a una taxonomía personalizada en WordPress para mejor gestión

## Para subir a Cloudflare:

```bash
git add .
git commit -m "feat: Implementar filtro de categorías para vinilos (Rock, Metal, Jazz)"
git push origin main
```
