@echo off
echo 🧹 Limpiando instalación anterior...
rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul
rmdir /s /q .astro 2>nul
rmdir /s /q dist 2>nul

echo 📦 Instalando dependencias correctas...
npm install

echo 🏗️ Haciendo build de prueba...
npm run build

echo ✅ ¡Listo! Ahora puedes hacer commit y push
echo.
echo Comandos a ejecutar:
echo git add .
echo git commit -m "Fix: Restore working configuration (remove Cloudflare adapter, restore vite.define)"
echo git push

pause
