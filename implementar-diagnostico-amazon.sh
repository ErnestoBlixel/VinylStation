#!/bin/bash

echo "🔍 === IMPLEMENTANDO HERRAMIENTAS DE DIAGNÓSTICO AMAZON ==="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "src/pages/diagnostico-amazon.astro" ]; then
    echo "❌ Error: No se encuentra la página de diagnóstico"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo "📁 Directorio verificado ✅"

# Hacer commit de las herramientas de diagnóstico
echo ""
echo "💾 Guardando herramientas de diagnóstico..."
git add .
git commit -m "Add: Herramientas de diagnóstico para botón Amazon en vinilos

- diagnosticar-amazon.js: Script de terminal para diagnóstico completo
- diagnostico-amazon.astro: Página web de diagnóstico en tiempo real
- DIAGNOSTICO_AMAZON_SOLUCION.md: Documentación completa del problema

Estas herramientas ayudan a identificar por qué no aparece el botón 
de 'Comprar en Amazon' en las páginas individuales de vinilos."

echo "   ✅ Cambios guardados en Git"

# Push a repositorio
echo ""
echo "📤 Subiendo a repositorio..."
git push origin main

echo "   ✅ Cambios subidos a GitHub"

# Build del proyecto
echo ""
echo "🔨 Construyendo proyecto..."
rm -rf dist/ .astro/
npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Build completado exitosamente"
else
    echo "   ❌ Error en el build"
    exit 1
fi

# Deploy a Cloudflare
echo ""
echo "🚀 Desplegando a Cloudflare..."
wrangler pages deploy dist/

echo ""
echo "🎉 === HERRAMIENTAS DE DIAGNÓSTICO IMPLEMENTADAS ==="
echo ""
echo "✅ Herramientas disponibles:"
echo "   🌐 Página web: https://vinylstation.es/diagnostico-amazon"
echo "   💻 Script terminal: node diagnosticar-amazon.js"
echo "   📋 Documentación: DIAGNOSTICO_AMAZON_SOLUCION.md"
echo ""
echo "🔍 PRÓXIMOS PASOS:"
echo "   1. Abre: https://vinylstation.es/diagnostico-amazon"
echo "   2. Revisa el estado de los vinilos"
echo "   3. Si no hay links de Amazon, configura ACF en WordPress"
echo "   4. Si hay algunos, completa los faltantes"
echo ""
echo "🆘 Si necesitas ayuda:"
echo "   • Ejecuta: node diagnosticar-amazon.js"
echo "   • Lee: DIAGNOSTICO_AMAZON_SOLUCION.md"
echo "   • Verifica configuración ACF en WordPress"
echo ""
echo "🎵 ¡Pronto tendrás los botones de Amazon funcionando!"
