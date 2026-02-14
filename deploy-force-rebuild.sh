#!/bin/bash

# Script para forzar rebuild completo

echo "🚀 Forzando rebuild completo..."

# Agregar cambios
git add Dockerfile
git add railway.json

# Hacer commit
git commit -m "chore: force rebuild with timestamp

- Add timestamp comment to Dockerfile to invalidate cache
- Ensure backend is rebuilt with latest main.ts changes"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería hacer rebuild completo."