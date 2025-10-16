@echo off
echo =====================================
echo   DEPLOY A CLOUDFLARE PAGES
echo =====================================
echo.
echo Proyecto: VinylStation
echo Ubicacion: C:\Users\nestu\Desktop\Blixel\Blixel Studio\CLIENTES\vinylstation\web vinylstation\Astro\V11
echo.

cd /d "C:\Users\nestu\Desktop\Blixel\Blixel Studio\CLIENTES\vinylstation\web vinylstation\Astro\V11"

echo 1. Ejecutando build...
call npm run build

echo.
echo 2. Verificando archivos importantes...
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
echo 3. Iniciando deploy con Wrangler...
echo.

wrangler pages deploy dist --project-name=vinylstation

echo.
echo =====================================
echo   DEPLOY COMPLETADO
echo =====================================
echo.
echo Verifica tu sitio en:
echo - https://vinylstation.es
echo - https://vinylstation.es/robots.txt
echo - https://vinylstation.es/sitemap-index.xml
echo.
pause
