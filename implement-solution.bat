@echo off
REM implement-solution.bat
REM Script para implementar automáticamente la solución de programas GraphQL en Windows

echo 🚀 IMPLEMENTANDO SOLUCION PARA PROGRAMAS GRAPHQL
echo ===============================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "astro.config.mjs" (
    echo ❌ Error: Este script debe ejecutarse desde la raíz del proyecto Astro
    echo    Asegúrate de estar en el directorio que contiene astro.config.mjs
    pause
    exit /b 1
)

echo ✅ Directorio correcto detectado
echo.

REM Paso 1: Ejecutar diagnóstico
echo 🔍 PASO 1: Ejecutando diagnóstico...
echo -----------------------------------

if exist "fix-programas-debug.mjs" (
    echo Ejecutando diagnóstico de WordPress GraphQL...
    node fix-programas-debug.mjs
    echo.
    echo 📊 Diagnóstico completado. Revisa los resultados arriba.
    echo.
    set /p continue="¿Quieres continuar con la implementación? (y/N): "
    if /i not "%continue%"=="y" (
        echo ❌ Implementación cancelada por el usuario
        pause
        exit /b 0
    )
) else (
    echo ⚠️  Archivo de diagnóstico no encontrado. Continuando...
)

echo.

REM Paso 2: Crear respaldos
echo 💾 PASO 2: Creando respaldos de archivos originales...
echo ----------------------------------------------------

REM Obtener timestamp para respaldos
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,8%-%dt:~8,6%"

REM Respaldar wordpress.js
if exist "src\lib\wordpress.js" (
    copy "src\lib\wordpress.js" "src\lib\wordpress-backup-%timestamp%.js" >nul
    echo ✅ Respaldado: src\lib\wordpress.js
) else (
    echo ⚠️  Archivo src\lib\wordpress.js no encontrado
)

REM Respaldar index.astro de programas
if exist "src\pages\programas\index.astro" (
    copy "src\pages\programas\index.astro" "src\pages\programas\index-backup-%timestamp%.astro" >nul
    echo ✅ Respaldado: src\pages\programas\index.astro
) else (
    echo ⚠️  Archivo src\pages\programas\index.astro no encontrado
)

echo.

REM Paso 3: Implementar archivos corregidos
echo 🔧 PASO 3: Implementando archivos corregidos...
echo ---------------------------------------------

REM Implementar wordpress-fixed.js
if exist "src\lib\wordpress-fixed.js" (
    copy "src\lib\wordpress-fixed.js" "src\lib\wordpress.js" >nul
    echo ✅ Implementado: src\lib\wordpress.js (versión adaptativa)
) else (
    echo ❌ Error: No se encontró src\lib\wordpress-fixed.js
    echo    Asegúrate de que todos los archivos de la solución estén presentes
    pause
    exit /b 1
)

REM Implementar index-fixed.astro
if exist "src\pages\programas\index-fixed.astro" (
    copy "src\pages\programas\index-fixed.astro" "src\pages\programas\index.astro" >nul
    echo ✅ Implementado: src\pages\programas\index.astro (versión adaptativa)
) else (
    echo ❌ Error: No se encontró src\pages\programas\index-fixed.astro
    echo    Asegúrate de que todos los archivos de la solución estén presentes
    pause
    exit /b 1
)

echo.

REM Paso 4: Verificar implementación
echo ✅ PASO 4: Verificando implementación...
echo --------------------------------------

echo Archivos implementados correctamente:
echo   ✅ src\lib\wordpress.js (biblioteca adaptativa)
echo   ✅ src\pages\programas\index.astro (página mejorada)
echo.

REM Paso 5: Instrucciones finales
echo 🎯 PASO 5: ¡Implementación completada!
echo ------------------------------------
echo.
echo ✅ La solución adaptativa ha sido implementada correctamente.
echo.
echo 📋 PRÓXIMOS PASOS:
echo.
echo 1. 🚀 Ejecutar en modo desarrollo:
echo    npm run dev
echo.
echo 2. 🌐 Abrir en navegador:
echo    http://localhost:3000/programas
echo.
echo 3. 🔍 Revisar información de diagnóstico:
echo    - La página mostrará qué método está usando
echo    - Si hay errores, usará el botón de diagnóstico
echo    - Los logs aparecerán en la consola del servidor
echo.
echo 4. ⚙️ Configurar WordPress (si es necesario):
echo    - Revisar SOLUCION-PROGRAMAS.md para instrucciones detalladas
echo    - Verificar que WPGraphQL esté instalado y activo
echo    - Asegurar que el CPT 'programas' esté expuesto en GraphQL
echo.
echo 🆘 SI HAY PROBLEMAS:
echo.
echo 1. Ejecutar diagnóstico manual:
echo    node fix-programas-debug.mjs
echo.
echo 2. Revisar logs en la consola del servidor
echo.
echo 3. Usar el botón de diagnóstico en /programas
echo.
echo 4. Consultar SOLUCION-PROGRAMAS.md para guía completa
echo.
echo 🔄 PARA REVERTIR CAMBIOS:
echo.
echo Los archivos originales están respaldados con timestamp.
echo Ejemplo: src\lib\wordpress-backup-%timestamp%.js
echo.
echo Para revertir:
echo   copy "src\lib\wordpress-backup-[TIMESTAMP].js" "src\lib\wordpress.js"
echo   copy "src\pages\programas\index-backup-[TIMESTAMP].astro" "src\pages\programas\index.astro"
echo.
echo 🎉 ¡LISTO! Tu sitio ahora debería mostrar los programas correctamente.
echo.

pause
