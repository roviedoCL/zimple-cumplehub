#!/bin/bash

# Script para crear base de datos en Fly.io

echo "🚀 Creando base de datos PostgreSQL en Fly.io..."

# Agregar flyctl al PATH
export PATH="$HOME/.fly/bin:$PATH"

echo "Paso 1: Creando base de datos..."
flyctl postgres create \
  --name zimple-cumplehub-db \
  --region iad \
  --vm-size shared-cpu-1x \
  --volume-size 1

echo ""
echo "Paso 2: Adjuntando base de datos a la app..."
flyctl postgres attach zimple-cumplehub-db \
  --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "Paso 3: Verificando variables de entorno..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "Paso 4: Redeployando la app..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "✅ Proceso completado!"