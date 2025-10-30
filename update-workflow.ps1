# 🚀 Script para actualizar workflow de auto-deploy de programas
# VinylStation - Blixel AI

Write-Host "🎵 VinylStation - Deploy Workflow Update" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar si estamos en el directorio correcto
$currentDir = Get-Location
Write-Host "📂 Directorio actual: $currentDir" -ForegroundColor Yellow

# Verificar si existe el archivo
$workflowFile = ".github/workflows/auto-deploy-programas.yml"
if (Test-Path $workflowFile) {
    Write-Host "✅ Archivo encontrado: $workflowFile" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: No se encuentra el archivo $workflowFile" -ForegroundColor Red
    exit 1
}

# Verificar estado de Git
Write-Host "`n📊 Estado de Git:" -ForegroundColor Yellow
git status --short

# Añadir archivo
Write-Host "`n📝 Añadiendo archivo al staging..." -ForegroundColor Yellow
git add $workflowFile

# Verificar cambios
Write-Host "`n🔍 Cambios staged:" -ForegroundColor Yellow
git diff --staged --stat

# Commit
$commitMessage = "feat: update auto-deploy workflow para programas"
Write-Host "`n💾 Creando commit..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push
Write-Host "`n🚀 Enviando a GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✨ ¡Workflow actualizado exitosamente!" -ForegroundColor Green
Write-Host "🌐 Ve a GitHub Actions para verificar:" -ForegroundColor Cyan
Write-Host "   https://github.com/ErnestoBlixel/VinylStation/actions" -ForegroundColor White
