#!/bin/bash

echo "========================================"
echo "  VINYLSTATION - DEPLOY A PRODUCCION"
echo "========================================"
echo ""

# Verificar cambios
echo "[1/6] Verificando cambios..."
git status
echo ""

# Preguntar si continuar
read -p "¿Deseas continuar con el deploy? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "Deploy cancelado."
    exit 1
fi

# Añadir cambios
echo ""
echo "[2/6] Añadiendo cambios a Git..."
git add .

# Commit
echo ""
read -p "Mensaje del commit: " mensaje
echo "[3/6] Haciendo commit..."
git commit -m "$mensaje"

# Push
echo ""
echo "[4/6] Subiendo a GitHub..."
git push origin main

# Build
echo ""
echo "[5/6] Construyendo proyecto..."
npm run build

# Deploy
echo ""
echo "[6/6] Desplegando a Cloudflare..."
wrangler pages deploy dist/

echo ""
echo "========================================"
echo "  ¡DEPLOY COMPLETADO CON EXITO!"
echo "========================================"
echo ""
echo "Tu sitio se está actualizando en Cloudflare."
echo "Revisa el progreso en: https://dash.cloudflare.com"
echo ""
