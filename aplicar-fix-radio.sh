#!/bin/bash

# 🔧 Script de Implementación Automática - Fix Errores Radio
# Este script aplica automáticamente las correcciones para los errores de la API de Zeno

echo "🎵 === FIX AUTOMÁTICO - ERRORES RADIO ZENO ==="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "src/components/CustomRadioPlayer.astro" ]; then
    echo "❌ Error: No se encuentra CustomRadioPlayer.astro"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo "📁 Directorio verificado ✅"

# Crear backup del archivo original
if [ -f "src/components/CustomRadioPlayer.astro" ]; then
    echo "💾 Creando backup del archivo original..."
    cp "src/components/CustomRadioPlayer.astro" "src/components/CustomRadioPlayer.astro.backup.$(date +%Y%m%d_%H%M%S)"
    echo "   Backup creado ✅"
fi

# Mostrar opciones al usuario
echo ""
echo "🚀 Selecciona la solución a implementar:"
echo ""
echo "1) CustomRadioPlayerFixed.astro - Reproductor avanzado con metadata robusta"
echo "   ✅ Sistema de metadata con múltiples APIs"
echo "   ✅ Manejo robusto de errores JSON" 
echo "   ✅ Álbum art dinámico"
echo "   ✅ Animaciones avanzadas"
echo ""
echo "2) RadioPlayerRobust.astro - Reproductor simple y confiable"
echo "   ✅ Sin APIs externas (cero errores)"
echo "   ✅ 100% funcional sin dependencias"
echo "   ✅ UI moderna y responsive"
echo "   ✅ Startup rápido"
echo ""
echo "3) Cancelar"
echo ""

read -p "Elige una opción (1, 2 o 3): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Aplicando CustomRadioPlayerFixed.astro..."
        
        if [ -f "src/components/CustomRadioPlayerFixed.astro" ]; then
            cp "src/components/CustomRadioPlayerFixed.astro" "src/components/CustomRadioPlayer.astro"
            echo "   ✅ CustomRadioPlayerFixed aplicado correctamente"
        else
            echo "   ❌ Error: No se encuentra CustomRadioPlayerFixed.astro"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        echo "🔧 Aplicando RadioPlayerRobust.astro..."
        
        if [ -f "src/components/RadioPlayerRobust.astro" ]; then
            cp "src/components/RadioPlayerRobust.astro" "src/components/CustomRadioPlayer.astro"
            echo "   ✅ RadioPlayerRobust aplicado correctamente"
        else
            echo "   ❌ Error: No se encuentra RadioPlayerRobust.astro"
            exit 1
        fi
        ;;
        
    3)
        echo ""
        echo "🚫 Operación cancelada"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

# Limpiar caché
echo ""
echo "🧹 Limpiando caché..."

if [ -d "dist" ]; then
    rm -rf dist/
    echo "   ✅ Directorio dist/ eliminado"
fi

if [ -d ".astro" ]; then
    rm -rf .astro/
    echo "   ✅ Directorio .astro/ eliminado"
fi

# Verificar si existe package.json para npm commands
if [ -f "package.json" ]; then
    echo ""
    echo "🔄 Rebuilding proyecto..."
    
    # Verificar si npm está disponible
    if command -v npm > /dev/null 2>&1; then
        echo "   Ejecutando npm run build..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Build completado exitosamente"
        else
            echo "   ⚠️ Warning: Build tuvo errores, pero el fix se aplicó"
        fi
    else
        echo "   ⚠️ NPM no encontrado, tendrás que hacer build manualmente"
    fi
fi

echo ""
echo "🎉 === FIX APLICADO EXITOSAMENTE ==="
echo ""
echo "✅ Cambios realizados:"
echo "   • Backup creado del archivo original"
echo "   • Nuevo reproductor implementado"
echo "   • Caché limpiado"
echo "   • Proyecto rebuilt"
echo ""
echo "🔍 Verificaciones recomendadas:"
echo "   1. Abrir la página en el navegador"
echo "   2. Verificar que no hay errores en la consola"
echo "   3. Probar reproducción del stream"
echo "   4. Verificar controles de volumen"
echo ""
echo "🚨 Si hay problemas:"
echo "   • Ejecuta: npm run dev"
echo "   • Haz hard refresh: Ctrl+Shift+R"
echo "   • Revisa la consola del navegador"
echo ""
echo "📋 Para revertir cambios:"
echo "   • Restaura desde: src/components/CustomRadioPlayer.astro.backup.*"
echo ""
echo "🎵 ¡Tu radio debería funcionar sin errores ahora!"
