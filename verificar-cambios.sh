#!/bin/bash

echo "🔍 VERIFICANDO CONFIGURACIÓN RESTAURADA..."
echo ""

# Verificar astro.config.mjs
echo "1. Verificando astro.config.mjs..."
if grep -q "vite.*define" astro.config.mjs && ! grep -q "@astrojs/cloudflare" astro.config.mjs; then
    echo "   ✅ astro.config.mjs: Configuración correcta (vite.define presente, no Cloudflare adapter)"
else
    echo "   ❌ astro.config.mjs: Configuración incorrecta"
fi

# Verificar package.json
echo "2. Verificando package.json..."
if ! grep -q "@astrojs/cloudflare" package.json && grep -q '"astro": "\^4' package.json; then
    echo "   ✅ package.json: Dependencias correctas (no Cloudflare, Astro 4.x)"
else
    echo "   ❌ package.json: Dependencias incorrectas"
fi

# Verificar wordpress.js
echo "3. Verificando wordpress.js..."
if grep -q "console.log('🔗 WordPress API URL'" src/lib/wordpress.js && ! grep -q "console.log('📊 Resultado crudo'" src/lib/wordpress.js; then
    echo "   ✅ wordpress.js: Código simplificado correctamente"
else
    echo "   ❌ wordpress.js: Código no simplificado"
fi

echo ""
echo "🧪 COMANDOS DE PRUEBA:"
echo ""
echo "# Instalar dependencias limpias:"
echo "npm install"
echo ""
echo "# Hacer build de prueba local:"
echo "npm run build"
echo ""
echo "# Si todo funciona, hacer commit:"
echo "git add ."
echo "git commit -m 'Fix: Restore working configuration (remove Cloudflare adapter, restore vite.define)'"
echo "git push"
echo ""
echo "📍 URL para verificar después del deployment:"
echo "https://cb97ed2a.vinylstation.pages.dev/"
echo ""
echo "✅ RESULTADO ESPERADO: Título 'VinylStation Radio' (no 'VinylStation (Error)')"
