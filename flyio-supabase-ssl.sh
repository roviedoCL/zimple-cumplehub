#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Configurando SSL para Supabase..."

# Agregar secreto para habilitar SSL
flyctl secrets set DB_SSL="true" --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Verificando secretos..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Redeployando la app con cambios de SSL..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Configuración completada! Verifica los logs con: flyctl logs --app zimple-cumplehub-frosty-frost-1528"