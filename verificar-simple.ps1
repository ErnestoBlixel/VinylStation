# Verificación simple - VinylStation
Write-Host "🔍 VERIFICACIÓN SIMPLE - VINYLSTATION" -ForegroundColor Green

# Verificar archivos principales
Write-Host "`n📁 Archivos principales:" -ForegroundColor Yellow
$files = @("package.json", "src\pages\index.astro", "public\images\logos\logo vinylstation.png")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file FALTA" -ForegroundColor Red
    }
}

# Verificar contenido del logo en index.astro
Write-Host "`n🖼️ Verificando logo en index.astro:" -ForegroundColor Yellow
$indexFile = "src\pages\index.astro"
if (Test-Path $indexFile) {
    $content = Get-Content $indexFile -Raw
    if ($content.Contains('logo vinylstation.png')) {
        Write-Host "✅ Logo correcto: 'logo vinylstation.png'" -ForegroundColor Green
    } elseif ($content.Contains('logo-vinylstation.png')) {
        Write-Host "❌ Logo incorrecto: tiene guión, debe ser 'logo vinylstation.png'" -ForegroundColor Red
    } else {
        Write-Host "⚠️ No se encontró referencia al logo" -ForegroundColor Yellow
    }
}

# Verificar efectos en MainLayout.astro
Write-Host "`n✨ Verificando efectos en MainLayout.astro:" -ForegroundColor Yellow
$layoutFile = "src\layouts\MainLayout.astro"
if (Test-Path $layoutFile) {
    $layoutContent = Get-Content $layoutFile -Raw
    
    if ($layoutContent.Contains("body::before") -and -not $layoutContent.Contains("DESHABILITADO")) {
        Write-Host "✅ Efectos de fondo: ACTIVADOS" -ForegroundColor Green
    } else {
        Write-Host "❌ Efectos de fondo: DESACTIVADOS" -ForegroundColor Red
    }
    
    if ($layoutContent.Contains("@keyframes backgroundFloat") -and -not $layoutContent.Contains("DESHABILITADA")) {
        Write-Host "✅ Animaciones: ACTIVADAS" -ForegroundColor Green
    } else {
        Write-Host "❌ Animaciones: DESACTIVADAS" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Si todo está ✅, ejecuta:" -ForegroundColor Cyan
Write-Host ".\actualizar-logo-efectos.ps1" -ForegroundColor White
