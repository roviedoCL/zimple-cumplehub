#!/bin/bash

# Script para corregir y redeployar en Fly.io

echo "🚀 Corrigiendo configuración para Fly.io..."

# Agregar cambios
git add backend/src/main.ts

# Hacer commit
git commit -m "fix: listen on 0.0.0.0 for Fly.io compatibility

- Change app.listen to use '0.0.0.0' instead of default localhost
- This allows the container to accept connections from outside
- Required for Fly.io, Railway, and other container platforms"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados."
echo ""
echo "Ahora ejecuta:"
echo "  export PATH=\"\$HOME/.fly/bin:\$PATH\""
echo "  flyctl deploy --app zimple-cumplehub-frosty-frost-1528"
echo ""
echo "Para configurar la base de datos:"
echo "  flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528"