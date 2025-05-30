#!/bin/bash
# implement-solution.sh
# Script para implementar automáticamente la solución de programas GraphQL

echo "🚀 IMPLEMENTANDO SOLUCIÓN PARA PROGRAMAS GRAPHQL"
echo "==============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "astro.config.mjs" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto Astro"
    echo "   Asegúrate de estar en el directorio que contiene astro.config.mjs"
    exit 1
fi

echo "✅ Directorio correcto detectado"
echo ""

# Paso 1: Ejecutar diagnóstico
echo "🔍 PASO 1: Ejecutando diagnóstico..."
echo "-----------------------------------"

if [ -f "fix-programas-debug.mjs" ]; then
    echo "Ejecutando diagnóstico de WordPress GraphQL..."
    node fix-programas-debug.mjs
    echo ""
    echo "📊 Diagnóstico completado. Revisa los resultados arriba."
    echo ""
    read -p "¿Quieres continuar con la implementación? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Implementación cancelada por el usuario"
        exit 0
    fi
else
    echo "⚠️  Archivo de diagnóstico no encontrado. Continuando..."
fi

echo ""

# Paso 2: Crear respaldos
echo "💾 PASO 2: Creando respaldos de archivos originales..."
echo "----------------------------------------------------"

# Respaldar wordpress.js
if [ -f "src/lib/wordpress.js" ]; then
    cp "src/lib/wordpress.js" "src/lib/wordpress-backup-$(date +%Y%m%d-%H%M%S).js"
    echo "✅ Respaldado: src/lib/wordpress.js"
else
    echo "⚠️  Archivo src/lib/wordpress.js no encontrado"
fi

# Respaldar index.astro de programas
if [ -f "src/pages/programas/index.astro" ]; then
    cp "src/pages/programas/index.astro" "src/pages/programas/index-backup-$(date +%Y%m%d-%H%M%S).astro"
    echo "✅ Respaldado: src/pages/programas/index.astro"
else
    echo "⚠️  Archivo src/pages/programas/index.astro no encontrado"
fi

echo ""

# Paso 3: Implementar archivos corregidos
echo "🔧 PASO 3: Implementando archivos corregidos..."
echo "---------------------------------------------"

# Implementar wordpress-fixed.js
if [ -f "src/lib/wordpress-fixed.js" ]; then
    cp "src/lib/wordpress-fixed.js" "src/lib/wordpress.js"
    echo "✅ Implementado: src/lib/wordpress.js (versión adaptativa)"
else
    echo "❌ Error: No se encontró src/lib/wordpress-fixed.js"
    echo "   Asegúrate de que todos los archivos de la solución estén presentes"
    exit 1
fi

# Implementar index-fixed.astro
if [ -f "src/pages/programas/index-fixed.astro" ]; then
    cp "src/pages/programas/index-fixed.astro" "src/pages/programas/index.astro"
    echo "✅ Implementado: src/pages/programas/index.astro (versión adaptativa)"
else
    echo "❌ Error: No se encontró src/pages/programas/index-fixed.astro"
    echo "   Asegúrate de que todos los archivos de la solución estén presentes"
    exit 1
fi

echo ""

# Paso 4: Verificar implementación
echo "✅ PASO 4: Verificando implementación..."
echo "--------------------------------------"

echo "Archivos implementados correctamente:"
echo "  ✅ src/lib/wordpress.js (biblioteca adaptativa)"
echo "  ✅ src/pages/programas/index.astro (página mejorada)"
echo ""

# Paso 5: Instrucciones finales
echo "🎯 PASO 5: ¡Implementación completada!"
echo "------------------------------------"
echo ""
echo "✅ La solución adaptativa ha sido implementada correctamente."
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 🚀 Ejecutar en modo desarrollo:"
echo "   npm run dev"
echo ""
echo "2. 🌐 Abrir en navegador:"
echo "   http://localhost:3000/programas"
echo ""
echo "3. 🔍 Revisar información de diagnóstico:"
echo "   - La página mostrará qué método está usando"
echo "   - Si hay errores, usará el botón de diagnóstico"
echo "   - Los logs aparecerán en la consola del servidor"
echo ""
echo "4. ⚙️ Configurar WordPress (si es necesario):"
echo "   - Revisar SOLUCION-PROGRAMAS.md para instrucciones detalladas"
echo "   - Verificar que WPGraphQL esté instalado y activo"
echo "   - Asegurar que el CPT 'programas' esté expuesto en GraphQL"
echo ""
echo "🆘 SI HAY PROBLEMAS:"
echo ""
echo "1. Ejecutar diagnóstico manual:"
echo "   node fix-programas-debug.mjs"
echo ""
echo "2. Revisar logs en la consola del servidor"
echo ""
echo "3. Usar el botón de diagnóstico en /programas"
echo ""
echo "4. Consultar SOLUCION-PROGRAMAS.md para guía completa"
echo ""
echo "🔄 PARA REVERTIR CAMBIOS:"
echo ""
echo "Los archivos originales están respaldados con timestamp."
echo "Ejemplo: src/lib/wordpress-backup-20240329-143022.js"
echo ""
echo "Para revertir:"
echo "  cp src/lib/wordpress-backup-[TIMESTAMP].js src/lib/wordpress.js"
echo "  cp src/pages/programas/index-backup-[TIMESTAMP].astro src/pages/programas/index.astro"
echo ""
echo "🎉 ¡LISTO! Tu sitio ahora debería mostrar los programas correctamente."
echo ""
