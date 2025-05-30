@echo off
echo 🎨 APLICANDO ENCABEZADOS MÁS GRANDES...
echo.
echo 📝 Cambios aplicados:
echo   - H2: 2.4rem (MÁS GRANDE)
echo   - H3: 2.0rem (MÁS GRANDE) 
echo   - H4: 1.7rem (MÁS GRANDE)
echo   - Selectores más específicos
echo   - Efectos visuales mejorados
echo.

if exist "dist" rmdir /s /q "dist"
if exist ".astro" rmdir /s /q ".astro"

npm run build
npm run dev
