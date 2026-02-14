bash flyio-update-db-url.sh#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Actualizando DATABASE_URL con los nuevos valores..."

# La nueva DB tiene estos valores:
# Username: postgres
# Password: AfkT2LMXs5jXXnL
# Hostname: zimple-cumplehub-db.internal
# Flycast: fdaa:47:cade:0:1::3
# Proxy port: 5432

# Usar el connection string proporcionado
NEW_DB_URL="postgres://postgres:AfkT2LMXs5jXXnL@zimple-cumplehub-db.flycast:5432"

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