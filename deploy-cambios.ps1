# 🚀 SCRIPT DE DESPLIEGUE AUTOMÁTICO - VinylStation (PowerShell)
# Aplica todos los cambios y despliega a Cloudflare

Write-Host "🚀 INICIANDO DESPLIEGUE DE CAMBIOS VINYLS..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Funciones para mostrar status con colores
function Show-Status($message) {
    Write-Host "📋 $message" -ForegroundColor Cyan
}

function Show-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Show-Warning($message) {
    Write-Host "⚠️ $message" -ForegroundColor Yellow
}

function Show-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

# 1. Verificar que estamos en el directorio correcto
Show-Status "Verificando directorio de trabajo..."
if (!(Test-Path "package.json")) {
    Show-Error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
}

if (!(Test-Path ".git")) {
    Show-Error "No se encontró repositorio git. Asegúrate de estar en el directorio correcto."
    exit 1
}

Show-Success "Directorio de trabajo correcto"

# 2. Verificar status de git
Show-Status "Verificando estado de git..."
git status --porcelain

# 3. Mostrar archivos modificados importantes
Write-Host ""
Show-Status "ARCHIVOS MODIFICADOS PRINCIPALES:"
Write-Host "- src/pages/vinilos/[slug].astro (Fix: vsEnlaceAmazon → vsLinkAmazon)" -ForegroundColor White
Write-Host "- src/pages/en-directo.astro (Auto-play + UI mejoras)" -ForegroundColor White
Write-Host ""

# 4. Confirmar con el usuario
$confirm = Read-Host "🤔 ¿Quieres continuar con el despliegue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Show-Warning "Despliegue cancelado por el usuario"
    exit 0
}

# 5. Añadir todos los cambios
Show-Status "Añadiendo archivos modificados a git..."
git add .
if ($LASTEXITCODE -eq 0) {
    Show-Success "Archivos añadidos correctamente"
} else {
    Show-Error "Error añadiendo archivos a git"
    exit 1
}

# 6. Verificar que hay cambios para commitear
$staged = git diff --staged --quiet
if ($LASTEXITCODE -eq 0) {
    Show-Warning "No hay cambios para commitear"
    exit 0
}

# 7. Hacer commit con mensaje descriptivo
Show-Status "Creando commit..."
$commitMsg = @"
🔧 Fix: Resuelto error GraphQL vinilos + mejoras UI

✅ CAMBIOS PRINCIPALES:
- Fix: vsEnlaceAmazon → vsLinkAmazon en páginas vinilos
- Mejora: Layout 1:1 para páginas individuales de vinilos  
- Añadido: Sección información afiliación Amazon
- Eliminado: Campo fecha de publicación innecesario
- Fix: Auto-play automático en página En Directo
- Eliminado: Bloque programación en En Directo
- Optimizado: CSS y estructura de archivos

🎯 RESULTADO: Vinilos funcionan sin errores GraphQL + mejor UX
"@

git commit -m $commitMsg
if ($LASTEXITCODE -eq 0) {
    Show-Success "Commit creado exitosamente"
} else {
    Show-Error "Error creando commit"
    exit 1
}

# 8. Push a repositorio
Show-Status "Subiendo cambios al repositorio..."
git push origin main
if ($LASTEXITCODE -eq 0) {
    Show-Success "Cambios subidos correctamente al repositorio"
} else {
    Show-Error "Error al subir cambios al repositorio"
    exit 1
}

# 9. Build del proyecto
Show-Status "Construyendo proyecto para producción..."
npm run build
if ($LASTEXITCODE -eq 0) {
    Show-Success "Build completado exitosamente"
} else {
    Show-Error "Error en el build del proyecto"
    exit 1
}

# 10. Desplegar a Cloudflare
Show-Status "Desplegando a Cloudflare Pages..."
npm run deploy
if ($LASTEXITCODE -eq 0) {
    Show-Success "Despliegue a Cloudflare completado"
} else {
    Show-Error "Error en el despliegue a Cloudflare"
    exit 1
}

# 11. Resumen final
Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Show-Success "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLS PARA VERIFICAR:" -ForegroundColor Cyan
Write-Host "   📀 Vinilos: https://vinylstation.es/vinilos/page/1/" -ForegroundColor White
Write-Host "   📻 En Directo: https://vinylstation.es/en-directo/" -ForegroundColor White
Write-Host ""
Write-Host "✅ VERIFICACIONES RECOMENDADAS:" -ForegroundColor Green
Write-Host "   1. Abrir página de vinilos y comprobar que cargan" -ForegroundColor White
Write-Host "   2. Abrir un vinilo individual y verificar botón Amazon" -ForegroundColor White
Write-Host "   3. Ir a En Directo y confirmar auto-play" -ForegroundColor White
Write-Host "   4. Verificar que no hay errores en la consola" -ForegroundColor White
Write-Host ""
Show-Success "Todos los cambios aplicados correctamente"

# 12. Abrir URLs automáticamente (opcional)
$openPages = Read-Host "🌐 ¿Quieres abrir las páginas para verificar? (y/N)"
if ($openPages -eq "y" -or $openPages -eq "Y") {
    Show-Status "Abriendo páginas para verificación..."
    
    Start-Process "https://vinylstation.es/vinilos/page/1/"
    Start-Process "https://vinylstation.es/en-directo/"
    
    Show-Success "Páginas abiertas para verificación"
}

Write-Host ""
Show-Success "🚀 Script de despliegue finalizado"
