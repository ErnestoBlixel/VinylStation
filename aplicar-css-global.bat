@echo off
echo 🎨 APLICANDO ESTILOS GLOBALES PARA ENCABEZADOS GRANDES
echo.
echo ✅ CAMBIOS REALIZADOS:
echo   1. Agregado CSS global en public/styles/global.css
echo   2. Importado en MainLayout.astro
echo   3. H2: 3.5rem (GIGANTES)
echo   4. H3: 2.8rem (GIGANTES) 
echo   5. H4: 2.3rem (GRANDES)
echo   6. Múltiples selectores para forzar aplicación
echo.
echo 🔄 Aplicando cambios...

if exist "dist" rmdir /s /q "dist"
if exist ".astro" rmdir /s /q ".astro"

npm run build
start http://localhost:4321/noticias/el-asombroso-giro-en-el-caso-de-un-hombre-que-paso-38-anos-tras-las-rejas-por-un-crimen-que-no-cometio
npm run dev
