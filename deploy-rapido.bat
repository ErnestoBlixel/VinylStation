@echo off
echo 🚀 DESPLIEGUE RAPIDO - VinylStation
echo ==================================

echo.
echo 📋 VERIFICANDO CAMBIOS...
git status

echo.
echo 🤔 ¿Continuar con el despliegue? (presiona cualquier tecla o Ctrl+C para cancelar)
pause >nul

echo.
echo 📦 AÑADIENDO ARCHIVOS...
git add .

echo.
echo 💾 CREANDO COMMIT...
git commit -m "🔧 Fix: Resuelto error GraphQL vinilos + mejoras UI - Auto-play En Directo + Layout optimizado"

echo.
echo 📤 SUBIENDO CAMBIOS...
git push origin main

echo.
echo 🔨 CONSTRUYENDO PROYECTO...
npm run build

echo.
echo 🚀 DESPLEGANDO A CLOUDFLARE...
npm run deploy

echo.
echo ========================================
echo ✅ DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo 🔗 VERIFICAR EN:
echo    📀 https://vinylstation.es/vinilos/page/1/
echo    📻 https://vinylstation.es/en-directo/
echo.
echo ¿Abrir páginas para verificar? (presiona cualquier tecla)
pause >nul

start "https://vinylstation.es/vinilos/page/1/"
start "https://vinylstation.es/en-directo/"

echo.
echo ✅ LISTO! Verifica que todo funciona correctamente
pause
