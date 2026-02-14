#!/bin/bash

# Script para hacer deploy del fix de configuración de Railway

echo "🚀 Haciendo commit del fix de railway.json..."

# Agregar cambios
git add railway.json

# Hacer commit
git commit -m "fix: remove startCommand from railway.json to use Dockerfile CMD

- Remove explicit startCommand to let Railway use the CMD from Dockerfile
- This ensures the correct working directory and command are used"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería redeployar automáticamente."