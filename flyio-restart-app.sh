#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Reiniciando aplicación..."

# Reiniciar la app
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "⏳ Esperando 20 segundos para que la app inicie..."
sleep 20

echo ""
echo "🚀 Verificando estado..."
flyctl status --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Verificando logs..."
flyctl logs --app zimple-cumplehub-frosty-frost-1528 --tail 50

echo ""
echo "✅ Proceso completado!"