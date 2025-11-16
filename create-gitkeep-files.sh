#!/bin/bash
# Script para crear archivos .gitkeep en directorios de Laravel storage
# Ejecutar este script desde la raíz del proyecto Laravel

echo "🔧 Creando archivos .gitkeep para Laravel storage..."
echo ""

# Directorio base de storage
STORAGE_DIR="storage"

# Crear directorios y archivos .gitkeep
mkdir -p "$STORAGE_DIR/app/public"
touch "$STORAGE_DIR/app/public/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/app/public/.gitkeep"

mkdir -p "$STORAGE_DIR/framework/cache"
touch "$STORAGE_DIR/framework/cache/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/framework/cache/.gitkeep"

mkdir -p "$STORAGE_DIR/framework/cache/data"
touch "$STORAGE_DIR/framework/cache/data/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/framework/cache/data/.gitkeep"

mkdir -p "$STORAGE_DIR/framework/sessions"
touch "$STORAGE_DIR/framework/sessions/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/framework/sessions/.gitkeep"

mkdir -p "$STORAGE_DIR/framework/testing"
touch "$STORAGE_DIR/framework/testing/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/framework/testing/.gitkeep"

mkdir -p "$STORAGE_DIR/framework/views"
touch "$STORAGE_DIR/framework/views/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/framework/views/.gitkeep"

mkdir -p "$STORAGE_DIR/logs"
touch "$STORAGE_DIR/logs/.gitkeep"
echo "✅ Creado: $STORAGE_DIR/logs/.gitkeep"

echo ""
echo "✨ ¡Archivos .gitkeep creados exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Verifica que los archivos se hayan creado: ls -la storage/app/public/"
echo "   2. Agrega los archivos a Git: git add storage/"
echo "   3. Haz commit: git commit -m 'Add .gitkeep files for storage directories'"
echo "   4. Despliega nuevamente en Railway"



