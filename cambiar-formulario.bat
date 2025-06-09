@echo off
echo.
echo === CAMBIAR VERSIÓN DE FORMULARIO ===
echo.
echo 1. Usar formulario CON Gravity Forms (requiere credenciales)
echo 2. Usar formulario SIMPLE sin Gravity Forms (funciona inmediatamente)
echo.
set /p choice="Elige una opción (1 o 2): "

if "%choice%"=="1" (
    echo.
    echo Cambiando a versión CON Gravity Forms...
    copy /Y src\pages\index.astro src\pages\index-simple-backup.astro >nul 2>&1
    copy /Y src\pages\index-con-gravity.astro src\pages\index.astro >nul 2>&1
    if exist src\pages\index-con-gravity.astro (
        echo ✅ Cambiado a versión CON Gravity Forms
        echo.
        echo IMPORTANTE: Asegúrate de actualizar las credenciales en:
        echo src\pages\api\gravity-form.ts
    ) else (
        echo ❌ No se encontró el archivo index-con-gravity.astro
        echo Usando la versión actual
    )
) else if "%choice%"=="2" (
    echo.
    echo Cambiando a versión SIMPLE sin Gravity Forms...
    copy /Y src\pages\index.astro src\pages\index-con-gravity.astro >nul 2>&1
    copy /Y src\pages\index-sin-gravity-forms.astro src\pages\index.astro >nul 2>&1
    echo ✅ Cambiado a versión SIMPLE
    echo.
    echo Esta versión funciona inmediatamente sin configuración adicional.
    echo Los mensajes se guardan temporalmente en localStorage.
) else (
    echo.
    echo ❌ Opción no válida
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul