:: backup-index.bat
@echo off
echo.
echo === CREANDO BACKUP DE INDEX.ASTRO ===
echo.

:: Crear carpeta de backups si no existe
if not exist "backups" mkdir backups

:: Obtener fecha y hora actual
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "timestamp=%YY%%MM%%DD%_%HH%%Min%"

:: Crear backup
copy "src\pages\index.astro" "backups\index_%timestamp%.astro" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Backup creado: backups\index_%timestamp%.astro
) else (
    echo ❌ Error creando backup
)

echo.
pause