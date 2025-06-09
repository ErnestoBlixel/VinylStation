@echo off
echo ========================================
echo   VINYLSTATION - DEPLOY A PRODUCCION
echo ========================================
echo.

REM Verificar cambios
echo [1/6] Verificando cambios...
git status
echo.

REM Preguntar si continuar
set /p continuar="¿Deseas continuar con el deploy? (s/n): "
if /i "%continuar%" neq "s" goto :fin

REM Añadir cambios
echo.
echo [2/6] Añadiendo cambios a Git...
git add .

REM Commit
echo.
set /p mensaje="Mensaje del commit: "
echo [3/6] Haciendo commit...
git commit -m "%mensaje%"

REM Push
echo.
echo [4/6] Subiendo a GitHub...
git push origin main

REM Build
echo.
echo [5/6] Construyendo proyecto...
call npm run build

REM Deploy
echo.
echo [6/6] Desplegando a Cloudflare...
call wrangler pages deploy dist/

echo.
echo ========================================
echo   ¡DEPLOY COMPLETADO CON EXITO!
echo ========================================
echo.
echo Tu sitio se está actualizando en Cloudflare.
echo Revisa el progreso en: https://dash.cloudflare.com
echo.
pause
goto :eof

:fin
echo Deploy cancelado.
pause
