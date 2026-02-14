#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Verificando redes..."

# Ver las organizaciones y redes
echo ""
echo "=== Organizaciones ==="
flyctl orgs list

echo ""
echo "=== Apps y sus redes ==="
flyctl apps list

echo ""
echo "=== Verificando si la app está en la misma organización que la DB ==="
echo "App: zimple-cumplehub-frosty-frost-1528"
echo "DB: zimple-cumplehub-db"

echo ""
echo "=== Probando conexión a la DB desde la app ==="
# Usar fly ssh para conectarse a la app y probar la conexión
flyctl ssh console --app zimple-cumplehub-frosty-frost-1528 -C "nc -zv zimple-cumplehub-db.internal 5432" || echo "No se pudo conectar"

echo ""
echo "🚀 Verificando el hostname de la DB..."
flyctl status --app zimple-cumplehub-db

echo ""
echo "🚀 Intentando conexión con psql..."
# Intentar conectarse usando el connection string
flyctl ssh console --app zimple-cumplehub-frosty-frost-1528 -C "psql 'postgres://postgres:AfkT2LMXs5jXXnL@zimple-cumplehub-db.internal:5432/postgres' -c '\l'" || echo "Conexión fallida"

echo ""
echo "✅ Verificación completada"