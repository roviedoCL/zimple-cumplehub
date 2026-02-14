#!/bin/bash

# Script para hacer deploy del fix de archivos estáticos

echo "🚀 Haciendo commit del fix de archivos estáticos..."

# Agregar cambios
git add Dockerfile
git add backend/src/main.ts

# Hacer commit
git commit -m "fix: serve frontend static files from backend

- Add NestExpressApplication type for static file serving
- Configure static assets middleware to serve frontend dist
- Add SPA fallback handler for client-side routing
- Fix frontend path resolution for Docker container structure"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería redeployar automáticamente."