#!/bin/bash

echo "🚀 FORZANDO DEPLOY AL DOMINIO PRINCIPAL"
echo "======================================"
echo ""

# Ir al directorio del proyecto
cd "C:\Users\nestu\Desktop\web vinylstation\V11"

echo "[1/5] Verificando estado actual..."
git status
echo ""

echo "[2/5] Creando commit técnico para forzar deploy..."
# Crear un pequeño cambio técnico para forzar nuevo deploy
echo "/* Deploy forzado $(date) */" >> src/styles/force-deploy.css
git add .
git commit -m "Force deploy: Actualizar dominio principal con fix radio"

echo ""
echo "[3/5] Subiendo a repositorio..."
git push origin main

echo ""
echo "[4/5] Limpiando build..."
rm -rf dist/ .astro/

echo ""
echo "[5/5] Build y deploy directo..."
npm run build
wrangler pages deploy dist/ --project-name vinylstation

echo ""
echo "✅ DEPLOY FORZADO COMPLETADO"
echo ""
echo "El dominio principal debería actualizarse en 2-3 minutos:"
echo "https://vinylstation.es"
echo ""
echo "Monitorea el progreso en Cloudflare Dashboard"
