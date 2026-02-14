#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 PASO 1: Destruyendo base de datos existente..."
flyctl apps destroy zimple-cumplehub-db --yes || echo "No existe o ya fue destruida"

echo ""
echo "🚀 PASO 2: Esperando 10 segundos..."
sleep 10

echo ""
echo "🚀 PASO 3: Creando nueva base de datos..."
flyctl postgres create \
  --name zimple-cumplehub-db \
  --region iad \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1

echo ""
echo "🚀 PASO 4: Esperando 30 segundos para que la DB inicie..."
sleep 30

echo ""
echo "🚀 PASO 5: Verificando status de la DB..."
flyctl status --app zimple-cumplehub-db

echo ""
echo "🚀 PASO 6: Adjuntando base de datos a la app..."
flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 PASO 7: Verificando variables de entorno..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 PASO 8: Forzando redeploy..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Proceso completado!"