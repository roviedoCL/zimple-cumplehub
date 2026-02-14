#!/bin/bash

# Script para forzar redeploy en Fly.io

echo "🚀 Forzando redeploy en Fly.io..."

# Agregar flyctl al PATH
export PATH="$HOME/.fly/bin:$PATH"

# Agregar cambios
git add Dockerfile

# Hacer commit
git commit -m "chore: force rebuild for Fly.io

- Update timestamp in Dockerfile to invalidate cache
- Ensure latest main.ts changes are included"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados."
echo ""
echo "Ahora ejecuta:"
echo "  export PATH=\"\$HOME/.fly/bin:\$PATH\""
echo "  flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache"
echo ""
echo "Para verificar las variables de entorno:"
echo "  flyctl secrets list --app zimple-cumplehub-frosty-frost-1528"