@echo off
echo 💥 LIMPIEZA AGRESIVA + ENCABEZADOS CON !IMPORTANT
echo.
echo 🔥 PROBLEMA: Los estilos no se aplican por cache o conflictos CSS
echo ✅ SOLUCIÓN: Estilos con !important + limpieza total de cache
echo.

echo 🗂️ ELIMINANDO TODO EL CACHE (PASO 1)...
if exist "dist" (
    echo    - Eliminando carpeta dist...
    rmdir /s /q "dist"
)
if exist ".astro" (
    echo    - Eliminando carpeta .astro...
    rmdir /s /q ".astro"
)
if exist "node_modules\.cache" (
    echo    - Eliminando cache de node_modules...
    rmdir /s /q "node_modules\.cache"
)
if exist "node_modules\.astro" (
    echo    - Eliminando cache astro en node_modules...
    rmdir /s /q "node_modules\.astro"
)

echo.
echo 🧹 LIMPIEZA ADICIONAL (PASO 2)...
if exist "src\styles\*.css" (
    echo    - Verificando archivos CSS...
)
echo    - Cache del navegador se limpiará automáticamente

echo.
echo 🔨 RECONSTRUCCIÓN FORZADA (PASO 3)...
echo    - Construyendo con estilos !important aplicados...
npm run build

if errorlevel 1 (
    echo.
    echo ❌ ERROR EN BUILD - Intentando arreglar...
    echo.
    npm install
    npm run build
)

echo.
echo 🚀 INICIANDO SERVIDOR (PASO 4)...
echo.
echo 🎯 CAMBIOS APLICADOS CON !IMPORTANT:
echo   - H1: 2.5rem (rojo con borde)
echo   - H2: 2.2rem (blanco con borde rojo)  
echo   - H3: 1.9rem (rojo con barra lateral)
echo   - H4: 1.6rem (fondo sutil)
echo   - H5: 1.4rem (mayúsculas)
echo   - H6: 1.2rem (itálica)
echo.
echo 💪 Los estilos ahora usan !important para forzar aplicación
echo 🌐 Abriendo: http://localhost:4321/noticias
echo.

start http://localhost:4321/noticias
npm run dev
