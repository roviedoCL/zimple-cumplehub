#!/bin/bash

# Script para corregir la ruta del frontend

echo "🚀 Corrigiendo ruta del frontend..."

# Agregar cambios
git add backend/src/main.ts

# Hacer commit
git commit -m "fix: correct frontend static files path

- Fix __dirname path resolution for Docker container structure
- Change from '..'/frontend/dist to '../..'/frontend/dist
- __dirname is /app/backend/dist, need to go up 2 levels to reach /app"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería redeployar."