# Script de verificación rápida - VinylStation
Write-Host "🔍 VERIFICACIÓN RÁPIDA - VINYLSTATION" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$allGood = $true

# 1. Verificar estructura de directorios
Write-Host "`n📁 Verificando estructura de archivos..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "src\pages\index.astro",
    "src\components\Header.astro", 
    "src\layouts\MainLayout.astro",
    "public\images\logos\logo vinylstation.png"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
        $allGood = $false
    }
}

# 2. Verificar que el logo en index.astro es correcto
Write-Host "`n🖼️ Verificando referencia del logo en index.astro..." -ForegroundColor Yellow
$indexContent = Get-Content "src\pages\index.astro" -Raw -ErrorAction SilentlyContinue
if ($indexContent -like '*src="/images/logos/logo vinylstation.png"*') {
    Write-Host "✅ Logo en index.astro: CORRECTO" -ForegroundColor Green
} elseif ($indexContent -like '*src="/images/logos/logo-vinylstation.png"*') {
    Write-Host "❌ Logo en index.astro: NECESITA CORRECCIÓN (tiene guión)" -ForegroundColor Red
    $allGood = $false
} else {
    Write-Host "⚠️ Logo en index.astro: NO ENCONTRADO" -ForegroundColor Yellow
    $allGood = $false
}

# 3. Verificar que el logo en header es correcto
Write-Host "`n🖼️ Verificando referencia del logo en Header.astro..." -ForegroundColor Yellow
$headerContent = Get-Content "src\components\Header.astro" -Raw -ErrorAction SilentlyContinue
if ($headerContent -like '*src="/images/logos/logo vinylstation.png"*') {
    Write-Host "✅ Logo en Header.astro: CORRECTO" -ForegroundColor Green
} elseif ($headerContent -like '*src="/images/logos/logo-vinylstation.png"*') {
    Write-Host "❌ Logo en Header.astro: NECESITA CORRECCIÓN (tiene guión)" -ForegroundColor Red
    $allGood = $false
} else {
    Write-Host "⚠️ Logo en Header.astro: NO ENCONTRADO" -ForegroundColor Yellow
    $allGood = $false
}

# 4. Verificar que los efectos están activados
Write-Host "`n✨ Verificando efectos visuales..." -ForegroundColor Yellow
$layoutContent = Get-Content "src\layouts\MainLayout.astro" -Raw -ErrorAction SilentlyContinue

if ($layoutContent -like '*body::before*' -and $layoutContent -notlike '*/* Fondo animado con partículas - DESHABILITADO */*') {
    Write-Host "✅ Efectos de fondo: ACTIVADOS" -ForegroundColor Green
} else {
    Write-Host "❌ Efectos de fondo: DESACTIVADOS o COMENTADOS" -ForegroundColor Red
    $allGood = $false
}

if ($layoutContent -like '*@keyframes backgroundFloat*' -and $layoutContent -notlike '*/* Animación del fondo - DESHABILITADA */*') {
    Write-Host "✅ Animación backgroundFloat: ACTIVADA" -ForegroundColor Green
} else {
    Write-Host "❌ Animación backgroundFloat: DESACTIVADA o COMENTADA" -ForegroundColor Red
    $allGood = $false
}

# 5. Verificar tamaño del logo
Write-Host "`n📏 Verificando archivo del logo..." -ForegroundColor Yellow
$logoPath = "public\images\logos\logo vinylstation.png"
if (Test-Path $logoPath) {
    $logoFile = Get-Item $logoPath
    $logoSizeKB = [math]::Round($logoFile.Length / 1KB, 2)
    Write-Host "✅ Tamaño del logo: $logoSizeKB KB" -ForegroundColor Green
    
    if ($logoFile.Length -lt 1KB) {
        Write-Host "⚠️ El archivo del logo parece muy pequeño, verifica que no esté corrupto" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Archivo del logo no encontrado" -ForegroundColor Red
    $allGood = $false
}

# Resultado final
Write-Host "`n$('='*50)" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "🎉 ¡TODO CORRECTO! Listo para desplegar" -ForegroundColor Green
    Write-Host "Ejecuta: .\actualizar-logo-efectos.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️ HAY PROBLEMAS QUE CORREGIR" -ForegroundColor Red
    Write-Host "Revisa los errores marcados arriba antes de desplegar" -ForegroundColor Yellow
}
Write-Host "$('='*50)" -ForegroundColor Cyan
