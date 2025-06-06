@echo off
echo 🔧 FIX VINILOS - LIMPIEZA COMPLETA
echo ================================

echo 🧹 Limpiando cache de Astro...
if exist ".astro" (
    rmdir /s /q ".astro"
    echo    ✅ Cache .astro eliminado
) else (
    echo    ℹ️ No hay cache .astro
)

if exist "dist" (
    rmdir /s /q "dist"
    echo    ✅ Carpeta dist eliminada
) else (
    echo    ℹ️ No hay carpeta dist
)

echo.
echo 📦 Instalando dependencias limpias...
npm ci
echo    ✅ Dependencias instaladas

echo.
echo 🚀 Iniciando servidor de desarrollo...
echo    📋 URLs a probar:
echo       http://localhost:3000/vinilos/
echo       http://localhost:3000/vinilos/page/1/
echo       http://localhost:3000/vinilos/page/2/
echo.
echo 🔥 INICIANDO...
npm run dev
