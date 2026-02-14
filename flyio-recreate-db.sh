#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Destruyendo base de datos existente..."
flyctl apps destroy zimple-cumplehub-db --yes || echo "No se pudo destruir o no existe"

echo ""
echo "🚀 Creando nueva base de datos..."
flyctl postgres create \
  --name zimple-cumplehub-db \
  --region iad \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1

echo ""
echo "🚀 Adjuntando base de datos a la app..."
flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "✅ Base de datos recreada y adjunta!"