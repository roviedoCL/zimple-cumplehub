#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Configurando Supabase en Fly.io..."

# El DATABASE_URL de Supabase
SUPABASE_DB_URL="postgresql://postgres:ZimpleCumpleHub2024!@db.sfjjasqhtxwwmwxhkahh.supabase.co:5432/postgres"

echo "Usando DATABASE_URL: $SUPABASE_DB_URL"

echo ""
echo "🚀 Configurando secreto..."
flyctl secrets set DATABASE_URL="$SUPABASE_DB_URL" --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Verificando secretos..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Redeployando la app..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Configuración completada! Verifica los logs con: flyctl logs --app zimple-cumplehub-frosty-frost-1528"