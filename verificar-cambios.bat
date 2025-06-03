@echo off
echo 🔍 VERIFICANDO CONFIGURACIÓN RESTAURADA...
echo.

REM Verificar astro.config.mjs
echo 1. Verificando astro.config.mjs...
findstr /c:"vite" astro.config.mjs >nul && findstr /c:"define" astro.config.mjs >nul
if %errorlevel% == 0 (
    findstr /c:"@astrojs/cloudflare" astro.config.mjs >nul
    if %errorlevel% == 1 (
        echo    ✅ astro.config.mjs: Configuración correcta (vite.define presente, no Cloudflare adapter^)
    ) else (
        echo    ❌ astro.config.mjs: Configuración incorrecta
    )
) else (
    echo    ❌ astro.config.mjs: Configuración incorrecta
)

REM Verificar package.json
echo 2. Verificando package.json...
findstr /c:"@astrojs/cloudflare" package.json >nul
if %errorlevel% == 1 (
    findstr /c:"astro.*4" package.json >nul
    if %errorlevel% == 0 (
        echo    ✅ package.json: Dependencias correctas (no Cloudflare, Astro 4.x^)
    ) else (
        echo    ❌ package.json: Dependencias incorrectas
    )
) else (
    echo    ❌ package.json: Dependencias incorrectas
)

REM Verificar wordpress.js
echo 3. Verificando wordpress.js...
findstr /c:"console.log('🔗 WordPress API URL'" src\lib\wordpress.js >nul
if %errorlevel% == 0 (
    findstr /c:"console.log('📊 Resultado crudo'" src\lib\wordpress.js >nul
    if %errorlevel% == 1 (
        echo    ✅ wordpress.js: Código simplificado correctamente
    ) else (
        echo    ❌ wordpress.js: Código no simplificado
    )
) else (
    echo    ❌ wordpress.js: Código no simplificado
)

echo.
echo 🧪 COMANDOS DE PRUEBA:
echo.
echo # Instalar dependencias limpias:
echo npm install
echo.
echo # Hacer build de prueba local:
echo npm run build
echo.
echo # Si todo funciona, hacer commit:
echo git add .
echo git commit -m "Fix: Restore working configuration (remove Cloudflare adapter, restore vite.define)"
echo git push
echo.
echo 📍 URL para verificar después del deployment:
echo https://cb97ed2a.vinylstation.pages.dev/
echo.
echo ✅ RESULTADO ESPERADO: Título 'VinylStation Radio' (no 'VinylStation (Error)')

pause
