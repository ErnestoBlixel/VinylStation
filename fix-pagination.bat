@echo off
echo 🧹 Limpiando cache y archivos temporales...

REM Eliminar cache de Astro
if exist ".astro" rmdir /s /q ".astro"
if exist "dist" rmdir /s /q "dist"

REM Eliminar node_modules cache
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo ✅ Cache limpiado
echo 🔄 Reiniciando servidor de desarrollo...

REM Instalar dependencias (por si acaso)
npm install

echo 🚀 Iniciando servidor limpio...
npm run dev
