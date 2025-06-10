# Script para actualizar VinylStation con logo y efectos arreglados
Write-Host "🚀 ACTUALIZANDO VINYLSTATION CON LOGO Y EFECTOS ARREGLADOS" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No estás en el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar que el logo existe
$logoPath = "public\images\logos\logo vinylstation.png"
if (-not (Test-Path $logoPath)) {
    Write-Host "❌ Error: El archivo del logo no existe en public\images\logos\" -ForegroundColor Red
    Write-Host "   Buscando: 'logo vinylstation.png'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logo encontrado: $logoPath" -ForegroundColor Green

# Limpiar y buildear
Write-Host "🧹 Limpiando archivos anteriores..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path ".astro") { Remove-Item -Recurse -Force ".astro" }

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Construyendo el proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completado exitosamente" -ForegroundColor Green

# Verificar que el logo está en el dist
$distLogoPath = "dist\images\logos\logo vinylstation.png"
if (-not (Test-Path $distLogoPath)) {
    Write-Host "❌ Error: El logo no se copió al directorio dist" -ForegroundColor Red
    Write-Host "   Verificando archivos en public\images\logos\..." -ForegroundColor Yellow
    Get-ChildItem "public\images\logos\" | Format-Table Name, Length, LastWriteTime
    exit 1
}

Write-Host "✅ Logo verificado en dist\" -ForegroundColor Green

# Desplegar a Cloudflare
Write-Host "🚀 Desplegando a Cloudflare Pages..." -ForegroundColor Yellow
npx wrangler pages deploy dist --project-name=vinylstation

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✅ Logo del hero: ARREGLADO" -ForegroundColor Green
    Write-Host "✅ Logo del header: ARREGLADO" -ForegroundColor Green
    Write-Host "✅ Efectos visuales de fondo: ACTIVADOS" -ForegroundColor Green
    Write-Host "✅ Animaciones de colores: ACTIVADAS" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu sitio debería estar actualizado en:" -ForegroundColor Cyan
    Write-Host "   https://vinylstation.pages.dev" -ForegroundColor White
    Write-Host ""
    Write-Host "⏰ Los cambios pueden tardar 1-2 minutos en propagarse." -ForegroundColor Yellow
    Write-Host "💡 Si no ves los cambios inmediatamente, limpia la caché del navegador (Ctrl+F5)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Error en el despliegue. Revisa la configuración de Wrangler." -ForegroundColor Red
    exit 1
}
