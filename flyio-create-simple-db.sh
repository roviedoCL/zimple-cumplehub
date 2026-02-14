#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Creando base de datos simple..."

# Destruir la DB existente si hay problemas
echo ""
echo "=== Destruyendo DB existente (si aplica) ==="
flyctl apps destroy zimple-cumplehub-db --yes 2>/dev/null || echo "No existe o ya destruida"

echo ""
echo "⏳ Esperando..."
sleep 5

echo ""
echo "=== Creando nueva DB con configuración mínima ==="
flyctl postgres create \
  --name zimple-cumplehub-db \
  --region iad \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1 \
  --org personal

echo ""
echo "✅ Base de datos creada!"