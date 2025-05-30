@echo off
echo 📰 ESTILOS APLICADOS SOLO A NOTICIAS INDIVIDUALES
echo.
echo ✅ CAMBIOS REALIZADOS:
echo   - Estilos SOLO para páginas individuales de noticias
echo   - H2: 2.8rem (solo en noticias individuales)
echo   - H3: 1.8rem (más pequeño como pediste)
echo   - H4: 1.6rem 
echo   - Responsive adaptado
echo   - NO afecta otras páginas del sitio
echo.
echo 🔄 Aplicando cambios...

if exist "dist" rmdir /s /q "dist"
if exist ".astro" rmdir /s /q ".astro"

npm run build
start http://localhost:4321/noticias/el-asombroso-giro-en-el-caso-de-un-hombre-que-paso-38-anos-tras-las-rejas-por-un-crimen-que-no-cometio
npm run dev
