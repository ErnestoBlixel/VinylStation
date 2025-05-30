@echo off
echo 💪 FUERZA BRUTA - ENCABEZADOS GIGANTES
echo.
echo ✅ Aplicando selectores ultra específicos:
echo   - H2: 2.8rem (ENORME)
echo   - H3: 2.3rem (ENORME)
echo   - Múltiples selectores CSS de respaldo
echo   - display: block !important
echo.

if exist "dist" rmdir /s /q "dist"
npm run build
start http://localhost:4321/noticias/el-asombroso-giro-en-el-caso-de-un-hombre-que-paso-38-anos-tras-las-rejas-por-un-crimen-que-no-cometio
npm run dev
