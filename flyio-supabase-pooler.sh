#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Configurando Supabase con Pooler en Fly.io..."

# El DATABASE_URL con pooler
SUPABASE_DB_URL="postgresql://postgres.sfjjasqhtxwwmwxhkahh:ZimpleCumpleHub2024!@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

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