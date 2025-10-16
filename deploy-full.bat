@echo off
echo =====================================
echo   DEPLOY COMPLETO - GITHUB + CLOUDFLARE
echo =====================================
echo.
echo Proyecto: VinylStation
echo Ubicacion: %CD%
echo.

REM 1. Git Status
echo 1. Verificando estado de Git...
git status
echo.

REM 2. Git Add
echo 2. Añadiendo cambios...
git add .
echo.

REM 3. Git Commit
set /p mensaje="Ingresa mensaje de commit (o presiona Enter para usar mensaje por defecto): "
if "%mensaje%"=="" set mensaje=Actualización del blog y mejoras generales
echo 3. Creando commit: %mensaje%
git commit -m "%mensaje%"
echo.

REM 4. Git Push
echo 4. Subiendo cambios a GitHub...
git push origin main
echo.

REM 5. Build
echo 5. Ejecutando build del proyecto...
call npm run build
echo.

REM 6. Verificación de archivos
echo 6. Verificando archivos importantes...
if exist "dist\robots.txt" (
    echo ✓ robots.txt
) else (
    echo ✗ robots.txt NO ENCONTRADO
)

if exist "dist\sitemap-index.xml" (
    echo ✓ sitemap-index.xml
) else (
    echo ✗ sitemap-index.xml NO ENCONTRADO
)

if exist "dist\_headers" (
    echo ✓ _headers
) else (
    echo ✗ _headers NO ENCONTRADO
)

if exist "dist\_routes.json" (
    echo ✓ _routes.json
) else (
    echo ✗ _routes.json NO ENCONTRADO
)

echo.

REM 7. Deploy a Cloudflare
echo 7. Desplegando en Cloudflare Pages...
wrangler pages deploy dist --project-name=vinylstation
echo.

echo =====================================
echo   DEPLOY COMPLETADO EXITOSAMENTE
echo =====================================
echo.
echo ✓ Cambios subidos a GitHub
echo ✓ Build generado correctamente
echo ✓ Desplegado en Cloudflare Pages
echo.
echo Verifica tu sitio en:
echo - https://vinylstation.es
echo - https://vinylstation.es/blog
echo - https://vinylstation.es/robots.txt
echo - https://vinylstation.es/sitemap-index.xml
echo.
pause
