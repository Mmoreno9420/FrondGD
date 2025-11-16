@echo off
REM Script para crear archivos .gitkeep en directorios de Laravel storage (Windows)
REM Ejecutar este script desde la raíz del proyecto Laravel

echo Creando archivos .gitkeep para Laravel storage...
echo.

REM Directorio base de storage
set STORAGE_DIR=storage

REM Crear directorios y archivos .gitkeep
if not exist "%STORAGE_DIR%\app\public" mkdir "%STORAGE_DIR%\app\public"
type nul > "%STORAGE_DIR%\app\public\.gitkeep"
echo Creado: %STORAGE_DIR%\app\public\.gitkeep

if not exist "%STORAGE_DIR%\framework\cache" mkdir "%STORAGE_DIR%\framework\cache"
type nul > "%STORAGE_DIR%\framework\cache\.gitkeep"
echo Creado: %STORAGE_DIR%\framework\cache\.gitkeep

if not exist "%STORAGE_DIR%\framework\cache\data" mkdir "%STORAGE_DIR%\framework\cache\data"
type nul > "%STORAGE_DIR%\framework\cache\data\.gitkeep"
echo Creado: %STORAGE_DIR%\framework\cache\data\.gitkeep

if not exist "%STORAGE_DIR%\framework\sessions" mkdir "%STORAGE_DIR%\framework\sessions"
type nul > "%STORAGE_DIR%\framework\sessions\.gitkeep"
echo Creado: %STORAGE_DIR%\framework\sessions\.gitkeep

if not exist "%STORAGE_DIR%\framework\testing" mkdir "%STORAGE_DIR%\framework\testing"
type nul > "%STORAGE_DIR%\framework\testing\.gitkeep"
echo Creado: %STORAGE_DIR%\framework\testing\.gitkeep

if not exist "%STORAGE_DIR%\framework\views" mkdir "%STORAGE_DIR%\framework\views"
type nul > "%STORAGE_DIR%\framework\views\.gitkeep"
echo Creado: %STORAGE_DIR%\framework\views\.gitkeep

if not exist "%STORAGE_DIR%\logs" mkdir "%STORAGE_DIR%\logs"
type nul > "%STORAGE_DIR%\logs\.gitkeep"
echo Creado: %STORAGE_DIR%\logs\.gitkeep

echo.
echo Archivos .gitkeep creados exitosamente!
echo.
echo Proximos pasos:
echo    1. Verifica que los archivos se hayan creado: dir storage\app\public
echo    2. Agrega los archivos a Git: git add storage/
echo    3. Haz commit: git commit -m "Add .gitkeep files for storage directories"
echo    4. Despliega nuevamente en Railway

pause



