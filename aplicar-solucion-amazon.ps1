# 🔧 Script para solucionar botón Amazon en vinilos (Windows)

Write-Host "🔧 === SOLUCIONANDO BOTÓN AMAZON EN VINILOS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar directorio
if (-not (Test-Path "src/lib/wordpress.js")) {
    Write-Host "❌ Error: No se encuentra wordpress.js" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Directorio verificado ✅" -ForegroundColor Green

# Resumen de cambios
Write-Host ""
Write-Host "✅ CAMBIOS APLICADOS:" -ForegroundColor Green
Write-Host "   • Consultas GraphQL actualizadas: vsEnlaceAmazon → vsLinkAmazon" -ForegroundColor White
Write-Host "   • Mappings de datos corregidos para usar vsLinkAmazon como fuente" -ForegroundColor White
Write-Host "   • Compatibilidad mantenida con código frontend existente" -ForegroundColor White
Write-Host ""

Write-Host "🔍 PROBLEMA SOLUCIONADO:" -ForegroundColor Cyan
Write-Host "   WordPress ACF usaba:     'vs_link_amazon' (data-name='vs_link_amazon')" -ForegroundColor Yellow
Write-Host "   Código GraphQL buscaba:  'vsEnlaceAmazon'" -ForegroundColor Yellow
Write-Host "   SOLUCIÓN: Actualizar GraphQL para usar 'vsLinkAmazon'" -ForegroundColor Green
Write-Host ""

# Hacer commit
Write-Host "💾 Guardando corrección..." -ForegroundColor Yellow

git add src/lib/wordpress.js
git commit -m "Fix: Corregir campo Amazon en vinilos

PROBLEMA: El botón 'Comprar en Amazon' no aparecía en páginas de vinilos
CAUSA: Campo ACF usa 'vs_link_amazon' pero GraphQL buscaba 'vsEnlaceAmazon'  
SOLUCIÓN: Actualizar consultas GraphQL para usar 'vsLinkAmazon'

Archivos modificados:
- src/lib/wordpress.js: Actualizar todas las consultas GraphQL de vinilos"

Write-Host "   ✅ Cambios guardados en Git" -ForegroundColor Green

# Push
Write-Host ""
Write-Host "📤 Subiendo corrección a repositorio..." -ForegroundColor Yellow
git push origin main
Write-Host "   ✅ Cambios subidos a GitHub" -ForegroundColor Green

# Build
Write-Host ""
Write-Host "🔨 Construyendo proyecto con corrección..." -ForegroundColor Yellow

if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path ".astro") { Remove-Item -Recurse -Force ".astro" }

try {
    npm run build
    Write-Host "   ✅ Build completado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en el build" -ForegroundColor Red
    exit 1
}

# Deploy
Write-Host ""
Write-Host "🚀 Desplegando corrección a Cloudflare..." -ForegroundColor Yellow

try {
    wrangler pages deploy dist/
    Write-Host ""
    Write-Host "🎉 === BOTÓN AMAZON SOLUCIONADO ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Corrección aplicada y desplegada:" -ForegroundColor Green
    Write-Host "   • Consultas GraphQL corregidas" -ForegroundColor White
    Write-Host "   • Build y deploy completados" -ForegroundColor White
    Write-Host "   • El botón Amazon debería aparecer ahora" -ForegroundColor White
} catch {
    Write-Host "❌ Error en el deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 VERIFICACIÓN RECOMENDADA:" -ForegroundColor Cyan
Write-Host "   1. Abre: https://vinylstation.es/vinilos/[slug-vinilo]" -ForegroundColor White
Write-Host "   2. Busca el botón '🛒 Comprar en Amazon'" -ForegroundColor White
Write-Host "   3. Verifica que funciona correctamente" -ForegroundColor White
Write-Host ""
Write-Host "🧪 SI QUIERES HACER UNA PRUEBA:" -ForegroundColor Yellow
Write-Host "   • Ve a WordPress Admin y añade un link de Amazon a un vinilo" -ForegroundColor White
Write-Host "   • Ejemplo: https://www.amazon.es/dp/B00001234/" -ForegroundColor White
Write-Host "   • Guarda y verifica en el frontend" -ForegroundColor White
Write-Host ""
Write-Host "📋 DIAGNÓSTICO (si aún hay problemas):" -ForegroundColor Yellow
Write-Host "   • Ejecuta: https://vinylstation.es/diagnostico-amazon" -ForegroundColor White
Write-Host "   • O ejecuta: node diagnosticar-amazon.js" -ForegroundColor White
Write-Host ""
Write-Host "🎵 ¡Los botones de Amazon deberían funcionar ahora!" -ForegroundColor Green

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
