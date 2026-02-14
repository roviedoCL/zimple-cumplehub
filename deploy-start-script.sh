#!/bin/bash

# Script para agregar script de inicio y simplificar configuración

echo "🚀 Agregando script de inicio..."

# Agregar cambios
git add start.sh
git add Dockerfile
git add railway.json
git add railway.json.backup2

# Hacer commit
git commit -m "fix: add start.sh script and simplify railway.json

- Add start.sh script for better control over container startup
- Update Dockerfile to use start.sh instead of direct node command
- Simplify railway.json to empty object to let Railway auto-detect
- Add debugging output to startup process"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería redeployar."