#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Corrigiendo conexión a base de datos..."

# Usar el hostname .internal en lugar de flycast
# Esto es más confiable para la comunicación entre apps en Fly.io
NEW_DB_URL="postgres://postgres:AfkT2LMXs5jXXnL@zimple-cumplehub-db.internal:5432/postgres"

echo "Nueva DATABASE_URL: $NEW_DB_URL"

echo ""
echo "🚀 Configurando el nuevo secreto..."
flyctl secrets set DATABASE_URL="$NEW_DB_URL" --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Verificando variables..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Reiniciando la app..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Proceso completado!"