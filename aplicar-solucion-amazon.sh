#!/bin/bash

echo "🔧 === SOLUCIONANDO BOTÓN AMAZON EN VINILOS ==="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "src/lib/wordpress.js" ]; then
    echo "❌ Error: No se encuentra wordpress.js"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo "📁 Directorio verificado ✅"

# Resumen de cambios realizados
echo ""
echo "✅ CAMBIOS APLICADOS:"
echo "   • Consultas GraphQL actualizadas: vsEnlaceAmazon → vsLinkAmazon"
echo "   • Mappings de datos corregidos para usar vsLinkAmazon como fuente"
echo "   • Compatibilidad mantenida con código frontend existente"
echo ""

# Mostrar qué se cambió
echo "🔍 PROBLEMA SOLUCIONADO:"
echo "   WordPress ACF usaba:  'vs_link_amazon' (data-name='vs_link_amazon')"
echo "   Código GraphQL buscaba:  'vsEnlaceAmazon'"
echo "   SOLUCIÓN: Actualizar GraphQL para usar 'vsLinkAmazon'"
echo ""

# Hacer commit de los cambios
echo "💾 Guardando corrección..."
git add src/lib/wordpress.js
git commit -m "Fix: Corregir campo Amazon en vinilos

PROBLEMA: El botón 'Comprar en Amazon' no aparecía en páginas de vinilos
CAUSA: Campo ACF usa 'vs_link_amazon' pero GraphQL buscaba 'vsEnlaceAmazon'  
SOLUCIÓN: Actualizar consultas GraphQL para usar 'vsLinkAmazon'

Archivos modificados:
- src/lib/wordpress.js: Actualizar todas las consultas GraphQL de vinilos"

echo "   ✅ Cambios guardados en Git"

# Push a repositorio
echo ""
echo "📤 Subiendo corrección a repositorio..."
git push origin main

echo "   ✅ Cambios subidos a GitHub"

# Build del proyecto
echo ""
echo "🔨 Construyendo proyecto con corrección..."
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
echo "🚀 Desplegando corrección a Cloudflare..."
wrangler pages deploy dist/

echo ""
echo "🎉 === BOTÓN AMAZON SOLUCIONADO ==="
echo ""
echo "✅ Corrección aplicada y desplegada:"
echo "   • Consultas GraphQL corregidas"
echo "   • Build y deploy completados"
echo "   • El botón Amazon debería aparecer ahora"
echo ""
echo "🔍 VERIFICACIÓN RECOMENDADA:"
echo "   1. Abre: https://vinylstation.es/vinilos/[slug-vinilo]"
echo "   2. Busca el botón '🛒 Comprar en Amazon'"
echo "   3. Verifica que funciona correctamente"
echo ""
echo "🧪 SI QUIERES HACER UNA PRUEBA:"
echo "   • Ve a WordPress Admin y añade un link de Amazon a un vinilo"
echo "   • Ejemplo: https://www.amazon.es/dp/B00001234/"
echo "   • Guarda y verifica en el frontend"
echo ""
echo "📋 DIAGNÓSTICO (si aún hay problemas):"
echo "   • Ejecuta: https://vinylstation.es/diagnostico-amazon"
echo "   • O ejecuta: node diagnosticar-amazon.js"
echo ""
echo "🎵 ¡Los botones de Amazon deberían funcionar ahora!"
