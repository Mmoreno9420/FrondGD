# Script PowerShell para crear archivos .gitkeep en directorios de Laravel storage
# Ejecutar este script desde la raíz del proyecto Laravel

Write-Host "🔧 Creando archivos .gitkeep para Laravel storage..." -ForegroundColor Cyan
Write-Host ""

# Directorio base de storage
$STORAGE_DIR = "storage"

# Función para crear directorio y archivo .gitkeep
function Create-GitKeep {
    param(
        [string]$Path
    )
    
    $directory = Split-Path $Path -Parent
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    
    New-Item -ItemType File -Path $Path -Force | Out-Null
    Write-Host "✅ Creado: $Path" -ForegroundColor Green
}

# Crear archivos .gitkeep
Create-GitKeep "$STORAGE_DIR\app\public\.gitkeep"
Create-GitKeep "$STORAGE_DIR\framework\cache\.gitkeep"
Create-GitKeep "$STORAGE_DIR\framework\cache\data\.gitkeep"
Create-GitKeep "$STORAGE_DIR\framework\sessions\.gitkeep"
Create-GitKeep "$STORAGE_DIR\framework\testing\.gitkeep"
Create-GitKeep "$STORAGE_DIR\framework\views\.gitkeep"
Create-GitKeep "$STORAGE_DIR\logs\.gitkeep"

Write-Host ""
Write-Host "✨ ¡Archivos .gitkeep creados exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verifica que los archivos se hayan creado: Get-ChildItem storage\app\public"
Write-Host "   2. Agrega los archivos a Git: git add storage/"
Write-Host "   3. Haz commit: git commit -m 'Add .gitkeep files for storage directories'"
Write-Host "   4. Despliega nuevamente en Railway"



