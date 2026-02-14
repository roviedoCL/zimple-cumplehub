#!/bin/bash

# Script para corregir el deploy en Fly.io

echo "🚀 Corrigiendo deploy en Fly.io..."

# Agregar flyctl al PATH
export PATH="$HOME/.fly/bin:$PATH"

echo "1. Listando apps existentes..."
flyctl apps list

echo ""
echo "2. Verificando si existe la base de datos..."
flyctl status --app zimple-cumplehub-db || echo "Base de datos no encontrada"

echo ""
echo "3. Si la base de datos existe, adjuntándola a la app..."
flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528 || echo "No se pudo adjuntar (puede que ya esté adjunta o no exista)"

echo ""
echo "4. Verificando variables de entorno..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "5. Forzando redeploy SIN caché..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Proceso completado!"