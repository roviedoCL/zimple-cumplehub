#!/bin/bash

# Script para simplificar railway.json

echo "🚀 Simplificando railway.json..."

# Agregar cambios
git add railway.json
git add railway.json.bak

# Hacer commit
git commit -m "fix: simplify railway.json to use only Dockerfile

- Remove startCommand to let Railway use CMD from Dockerfile
- Remove deploy config to use Railway defaults
- Backup old config in railway.json.bak"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería usar solo el Dockerfile."