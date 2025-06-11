#!/bin/bash

# 🚀 SCRIPT DE DESPLIEGUE AUTOMÁTICO - VinylStation
# Aplica todos los cambios y despliega a Cloudflare

echo "🚀 INICIANDO DESPLIEGUE DE CAMBIOS VINYLS..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar status
show_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar que estamos en el directorio correcto
show_status "Verificando directorio de trabajo..."
if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

if [ ! -d ".git" ]; then
    show_error "No se encontró repositorio git. Asegúrate de estar en el directorio correcto."
    exit 1
fi

show_success "Directorio de trabajo correcto"

# 2. Verificar status de git
show_status "Verificando estado de git..."
git status --porcelain

# 3. Mostrar archivos modificados importantes
echo ""
show_status "ARCHIVOS MODIFICADOS PRINCIPALES:"
echo "- src/pages/vinilos/[slug].astro (Fix: vsEnlaceAmazon → vsLinkAmazon)"
echo "- src/pages/en-directo.astro (Auto-play + UI mejoras)"
echo ""

# 4. Confirmar con el usuario
read -p "🤔 ¿Quieres continuar con el despliegue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    show_warning "Despliegue cancelado por el usuario"
    exit 0
fi

# 5. Añadir todos los cambios
show_status "Añadiendo archivos modificados a git..."
git add .
show_success "Archivos añadidos correctamente"

# 6. Verificar que hay cambios para commitear
if git diff --staged --quiet; then
    show_warning "No hay cambios para commitear"
    exit 0
fi

# 7. Hacer commit con mensaje descriptivo
show_status "Creando commit..."
COMMIT_MSG="🔧 Fix: Resuelto error GraphQL vinilos + mejoras UI

✅ CAMBIOS PRINCIPALES:
- Fix: vsEnlaceAmazon → vsLinkAmazon en páginas vinilos
- Mejora: Layout 1:1 para páginas individuales de vinilos  
- Añadido: Sección información afiliación Amazon
- Eliminado: Campo fecha de publicación innecesario
- Fix: Auto-play automático en página En Directo
- Eliminado: Bloque programación en En Directo
- Optimizado: CSS y estructura de archivos

🎯 RESULTADO: Vinilos funcionan sin errores GraphQL + mejor UX"

git commit -m "$COMMIT_MSG"
show_success "Commit creado exitosamente"

# 8. Push a repositorio
show_status "Subiendo cambios al repositorio..."
git push origin main
if [ $? -eq 0 ]; then
    show_success "Cambios subidos correctamente al repositorio"
else
    show_error "Error al subir cambios al repositorio"
    exit 1
fi

# 9. Build del proyecto
show_status "Construyendo proyecto para producción..."
npm run build
if [ $? -eq 0 ]; then
    show_success "Build completado exitosamente"
else
    show_error "Error en el build del proyecto"
    exit 1
fi

# 10. Desplegar a Cloudflare
show_status "Desplegando a Cloudflare Pages..."
npm run deploy
if [ $? -eq 0 ]; then
    show_success "Despliegue a Cloudflare completado"
else
    show_error "Error en el despliegue a Cloudflare"
    exit 1
fi

# 11. Resumen final
echo ""
echo "=================================================="
show_success "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "=================================================="
echo ""
echo "🔗 URLS PARA VERIFICAR:"
echo "   📀 Vinilos: https://vinylstation.es/vinilos/page/1/"
echo "   📻 En Directo: https://vinylstation.es/en-directo/"
echo ""
echo "✅ VERIFICACIONES RECOMENDADAS:"
echo "   1. Abrir página de vinilos y comprobar que cargan"
echo "   2. Abrir un vinilo individual y verificar botón Amazon"
echo "   3. Ir a En Directo y confirmar auto-play"
echo "   4. Verificar que no hay errores en la consola"
echo ""
show_success "Todos los cambios aplicados correctamente"

# 12. Abrir URLs automáticamente (opcional)
read -p "🌐 ¿Quieres abrir las páginas para verificar? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    show_status "Abriendo páginas para verificación..."
    
    # Detectar sistema operativo y abrir URLs
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "https://vinylstation.es/vinilos/page/1/"
        start "https://vinylstation.es/en-directo/"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "https://vinylstation.es/vinilos/page/1/"
        open "https://vinylstation.es/en-directo/"
    else
        # Linux
        xdg-open "https://vinylstation.es/vinilos/page/1/" >/dev/null 2>&1
        xdg-open "https://vinylstation.es/en-directo/" >/dev/null 2>&1
    fi
    
    show_success "Páginas abiertas para verificación"
fi

echo ""
show_success "🚀 Script de despliegue finalizado"
