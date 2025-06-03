#!/bin/bash

echo "🧹 Limpiando instalación anterior..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf .astro
rm -rf dist

echo "📦 Instalando dependencias correctas..."
npm install

echo "🏗️ Haciendo build de prueba..."
npm run build

echo "✅ ¡Listo! Ahora puedes hacer commit y push"
echo ""
echo "Comandos a ejecutar:"
echo "git add ."
echo "git commit -m 'Fix: Restore working configuration (remove Cloudflare adapter, restore vite.define)'"
echo "git push"
