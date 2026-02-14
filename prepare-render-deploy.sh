#!/bin/bash

# Script para preparar deploy en Render

echo "🚀 Preparando deploy en Render..."

# Renombrar render-docker.yaml a render.yaml
cp render-docker.yaml render.yaml

# Agregar cambios
git add render-docker.yaml
git add DEPLOY_RENDER.md
git add render.yaml

# Hacer commit
git commit -m "chore: prepare for Render deployment

- Add render-docker.yaml for Docker-based deployment
- Add DEPLOY_RENDER.md with deployment instructions
- Update render.yaml to use Docker runtime"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Listo para deploy en Render!"
echo ""
echo "Sigue las instrucciones en DEPLOY_RENDER.md"
echo "o ve directamente a: https://dashboard.render.com/blueprints"