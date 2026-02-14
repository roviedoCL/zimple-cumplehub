#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Probando conexión a Supabase desde la app..."

# SSH a la app y ejecuta psql para probar la conexión
flyctl ssh console --app zimple-cumplehub-frosty-frost-1528 -C "psql 'postgresql://postgres.sfjjasqhtxwwmwxhkahh:ZimpleCumpleHub2024!@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true' -c '\\conninfo'"

echo ""
echo "✅ Prueba completada. Si ves 'You are connected to database', funciona. Si hay error, compártelo."