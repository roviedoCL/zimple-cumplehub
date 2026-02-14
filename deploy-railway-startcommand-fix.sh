#!/bin/bash

# Script para hacer deploy del fix de startCommand en Railway

echo "🚀 Haciendo commit del fix de startCommand..."

# Agregar cambios
git add railway.json

# Hacer commit
git commit -m "fix: add explicit startCommand with shell wrapper

- Use 'sh -c' wrapper to ensure the command runs in a shell
- This fixes 'The executable cd could not be found' error"

# Hacer push
echo "🚀 Pushing cambios a GitHub..."
git push origin main

echo "✅ Cambios pusheados. Railway debería redeployar automáticamente."