#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Debug de la aplicación..."

echo ""
echo "=== Estado de la DB ==="
flyctl status --app zimple-cumplehub-db

echo ""
echo "=== Estado de la App ==="
flyctl status --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "=== Últimos logs de la App ==="
flyctl logs --app zimple-cumplehub-frosty-frost-1528 2>&1 | tail -100

echo ""
echo "=== Verificar si DATABASE_URL está configurado ==="
flyctl ssh console --app zimple-cumplehub-frosty-frost-1528 -C "echo DATABASE_URL is set: \$DATABASE_URL" 2>&1 || echo "No se pudo conectar a la app"

echo ""
echo "✅ Debug completado"