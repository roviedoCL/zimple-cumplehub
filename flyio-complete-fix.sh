#!/bin/bash

# Script completo para reparar todo en Fly.io

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 PASO 1: Reparando base de datos..."
flyctl machines start d890d61b734e28 --app zimple-cumplehub-db || echo "No se pudo iniciar la DB"

echo ""
echo "🚀 PASO 2: Esperando 15 segundos para que la DB inicie..."
sleep 15

echo ""
echo "🚀 PASO 3: Verificando status de la DB..."
flyctl status --app zimple-cumplehub-db

echo ""
echo "🚀 PASO 4: Adjuntando DB a la app (esto configura DATABASE_URL)..."
flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528 || echo "Puede que ya esté adjunta"

echo ""
echo "🚀 PASO 5: Verificando variables de entorno..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 PASO 6: Forzando rebuild completo sin caché..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Proceso completado!"
echo ""
echo "Si sigue sin funcionar, verifica los logs con:"
echo "  flyctl logs --app zimple-cumplehub-frosty-frost-1528"