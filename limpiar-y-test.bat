@echo off
echo 🧹 SOLUCIÓN COMPLETA: PAGINACIÓN + ENCABEZADOS MEJORADOS
echo.
echo 🔍 PROBLEMAS RESUELTOS:
echo   1. Solo 100 de 260+ noticias (RESUELTO con paginación)
echo   2. Encabezados H2/H3 muy pequeños (RESUELTO con estilos mejorados)
echo.
echo ✅ SOLUCIONES APLICADAS:
echo   - Paginación automática que obtiene TODAS las noticias
echo   - Encabezados H1-H6 más grandes y visibles
echo   - Mejor jerarquía visual en el contenido
echo   - Contador mostrará el total real (como categorías)
echo.

echo 🗂️ Eliminando cache para aplicar todas las mejoras...
if exist "dist" rmdir /s /q "dist"
if exist ".astro" rmdir /s /q ".astro"
if exist "node_modules/.astro" rmdir /s /q "node_modules/.astro"

echo 🔨 Reconstruyendo con todas las mejoras...
npm run build

echo 🚀 Iniciando servidor...
echo.
echo 🎉 ¡TODO MEJORADO!
echo   📊 El marcador "NOTICIAS" mostrará el total real (260+)
echo   📝 Los encabezados H2/H3 serán más grandes y legibles
echo   🎨 Mejor jerarquía visual en el contenido
echo   📱 Responsive: se adapta a todos los tamaños de pantalla
echo   🔗 URL: http://localhost:4321/noticias
echo.
start http://localhost:4321/noticias
npm run dev
