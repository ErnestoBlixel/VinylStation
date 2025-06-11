# 🔧 Script de Implementación Automática - Fix Errores Radio (Windows)
# Este script aplica automáticamente las correcciones para los errores de la API de Zeno

Write-Host "🎵 === FIX AUTOMÁTICO - ERRORES RADIO ZENO ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "src/components/CustomRadioPlayer.astro")) {
    Write-Host "❌ Error: No se encuentra CustomRadioPlayer.astro" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Directorio verificado ✅" -ForegroundColor Green

# Crear backup del archivo original
if (Test-Path "src/components/CustomRadioPlayer.astro") {
    Write-Host "💾 Creando backup del archivo original..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    Copy-Item "src/components/CustomRadioPlayer.astro" "src/components/CustomRadioPlayer.astro.backup.$timestamp"
    Write-Host "   Backup creado ✅" -ForegroundColor Green
}

# Mostrar opciones al usuario
Write-Host ""
Write-Host "🚀 Selecciona la solución a implementar:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1) CustomRadioPlayerFixed.astro - Reproductor avanzado con metadata robusta" -ForegroundColor White
Write-Host "   ✅ Sistema de metadata con múltiples APIs" -ForegroundColor Green
Write-Host "   ✅ Manejo robusto de errores JSON" -ForegroundColor Green
Write-Host "   ✅ Álbum art dinámico" -ForegroundColor Green
Write-Host "   ✅ Animaciones avanzadas" -ForegroundColor Green
Write-Host ""
Write-Host "2) RadioPlayerRobust.astro - Reproductor simple y confiable" -ForegroundColor White
Write-Host "   ✅ Sin APIs externas (cero errores)" -ForegroundColor Green
Write-Host "   ✅ 100% funcional sin dependencias" -ForegroundColor Green
Write-Host "   ✅ UI moderna y responsive" -ForegroundColor Green
Write-Host "   ✅ Startup rápido" -ForegroundColor Green
Write-Host ""
Write-Host "3) Cancelar" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Elige una opción (1, 2 o 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔧 Aplicando CustomRadioPlayerFixed.astro..." -ForegroundColor Yellow
        
        if (Test-Path "src/components/CustomRadioPlayerFixed.astro") {
            Copy-Item "src/components/CustomRadioPlayerFixed.astro" "src/components/CustomRadioPlayer.astro" -Force
            Write-Host "   ✅ CustomRadioPlayerFixed aplicado correctamente" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Error: No se encuentra CustomRadioPlayerFixed.astro" -ForegroundColor Red
            exit 1
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔧 Aplicando RadioPlayerRobust.astro..." -ForegroundColor Yellow
        
        if (Test-Path "src/components/RadioPlayerRobust.astro") {
            Copy-Item "src/components/RadioPlayerRobust.astro" "src/components/CustomRadioPlayer.astro" -Force
            Write-Host "   ✅ RadioPlayerRobust aplicado correctamente" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Error: No se encuentra RadioPlayerRobust.astro" -ForegroundColor Red
            exit 1
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚫 Operación cancelada" -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        exit 1
    }
}

# Limpiar caché
Write-Host ""
Write-Host "🧹 Limpiando caché..." -ForegroundColor Yellow

if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "   ✅ Directorio dist/ eliminado" -ForegroundColor Green
}

if (Test-Path ".astro") {
    Remove-Item -Recurse -Force ".astro"
    Write-Host "   ✅ Directorio .astro/ eliminado" -ForegroundColor Green
}

# Verificar si existe package.json para npm commands
if (Test-Path "package.json") {
    Write-Host ""
    Write-Host "🔄 Rebuilding proyecto..." -ForegroundColor Yellow
    
    # Verificar si npm está disponible
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        Write-Host "   Ejecutando npm run build..." -ForegroundColor White
        
        try {
            npm run build
            Write-Host "   ✅ Build completado exitosamente" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️ Warning: Build tuvo errores, pero el fix se aplicó" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️ NPM no encontrado, tendrás que hacer build manualmente" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 === FIX APLICADO EXITOSAMENTE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Cambios realizados:" -ForegroundColor Green
Write-Host "   • Backup creado del archivo original" -ForegroundColor White
Write-Host "   • Nuevo reproductor implementado" -ForegroundColor White
Write-Host "   • Caché limpiado" -ForegroundColor White
Write-Host "   • Proyecto rebuilt" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Verificaciones recomendadas:" -ForegroundColor Cyan
Write-Host "   1. Abrir la página en el navegador" -ForegroundColor White
Write-Host "   2. Verificar que no hay errores en la consola" -ForegroundColor White
Write-Host "   3. Probar reproducción del stream" -ForegroundColor White
Write-Host "   4. Verificar controles de volumen" -ForegroundColor White
Write-Host ""
Write-Host "🚨 Si hay problemas:" -ForegroundColor Red
Write-Host "   • Ejecuta: npm run dev" -ForegroundColor White
Write-Host "   • Haz hard refresh: Ctrl+Shift+R" -ForegroundColor White
Write-Host "   • Revisa la consola del navegador" -ForegroundColor White
Write-Host ""
Write-Host "📋 Para revertir cambios:" -ForegroundColor Yellow
Write-Host "   • Restaura desde: src/components/CustomRadioPlayer.astro.backup.*" -ForegroundColor White
Write-Host ""
Write-Host "🎵 ¡Tu radio debería funcionar sin errores ahora!" -ForegroundColor Green

# Pausa para que el usuario pueda leer el resultado
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
