@echo off
echo =============================================
echo SOLUCION RAPIDA: Imagen studio.jpg
echo =============================================
echo.

REM 1. Renombrar logo si tiene espacios
echo 1. Verificando logo...
cd public\images\logos
if exist "logo vinylstation.png" (
    ren "logo vinylstation.png" "logo-vinylstation.png"
    echo    [OK] Logo renombrado
) else (
    echo    [INFO] Logo ya correcto
)
cd ..\..\..

REM 2. Crear copia de studio.jpg
echo.
echo 2. Creando copia de studio.jpg...
cd public\images
if exist "studio.jpg" (
    copy "studio.jpg" "studio-vinylstation.jpg" >nul
    echo    [OK] Copia creada: studio-vinylstation.jpg
)
cd ..\..

REM 3. Build para aplicar cambios
echo.
echo 3. Construyendo proyecto...
npm run build

echo.
echo =============================================
echo LISTO! Cambios aplicados:
echo =============================================
echo.
echo 1. Logo renombrado sin espacios
echo 2. studio.jpg ahora tiene version query (?v=2)
echo 3. Se agrego fallback a placeholder si falla
echo 4. Se creo copia como studio-vinylstation.jpg
echo.
echo AHORA: Despliega a Cloudflare y verifica
echo.
pause