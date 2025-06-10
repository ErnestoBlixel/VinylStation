#!/bin/bash

echo "🚀 ACTUALIZANDO VINYLSTATION CON LOGO Y EFECTOS ARREGLADOS"
echo "=========================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estás en el directorio raíz del proyecto"
    exit 1
fi

# Verificar que el logo existe
if [ ! -f "public/images/logos/logo vinylstation.png" ]; then
    echo "❌ Error: El archivo del logo no existe en public/images/logos/"
    echo "   Buscando: 'logo vinylstation.png'"
    exit 1
fi

echo "✅ Logo encontrado: public/images/logos/logo vinylstation.png"

# Limpiar y buildear
echo "🧹 Limpiando archivos anteriores..."
rm -rf dist/
rm -rf .astro/

echo "📦 Instalando dependencias..."
npm install

echo "🔨 Construyendo el proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi

echo "✅ Build completado exitosamente"

# Verificar que el logo está en el dist
if [ ! -f "dist/images/logos/logo vinylstation.png" ]; then
    echo "❌ Error: El logo no se copió al directorio dist"
    echo "   Verificando si el archivo source existe..."
    ls -la "public/images/logos/"
    exit 1
fi

echo "✅ Logo verificado en dist/"

# Desplegar a Cloudflare
echo "🚀 Desplegando a Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=vinylstation

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!"
    echo "=========================================="
    echo "✅ Logo del hero: ARREGLADO"
    echo "✅ Logo del header: ARREGLADO" 
    echo "✅ Efectos visuales de fondo: ACTIVADOS"
    echo "✅ Animaciones de colores: ACTIVADAS"
    echo ""
    echo "🌐 Tu sitio debería estar actualizado en:"
    echo "   https://vinylstation.pages.dev"
    echo ""
    echo "⏰ Los cambios pueden tardar 1-2 minutos en propagarse."
    echo "💡 Si no ves los cambios inmediatamente, limpia la caché del navegador (Ctrl+F5)"
else
    echo "❌ Error en el despliegue. Revisa la configuración de Wrangler."
    exit 1
fi
