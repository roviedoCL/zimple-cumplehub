#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🔄 Cambiando a conexión DIRECTA de Supabase (puerto 5432)..."

# IMPORTANTE: Reemplaza esto con tu DATABASE_URL de Supabase
# Usa la conexión DIRECTA (Transaction Mode), no el pooler
# Formato: postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

read -p "Pega tu DATABASE_URL de Supabase (puerto 5432, SIN pgbouncer=true): " DB_URL

echo ""
echo "📝 Configurando DATABASE_URL..."
flyctl secrets set DATABASE_URL="$DB_URL" --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "🚀 Redeployando la app..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Deploy completado! Verifica los logs con: flyctl logs --app zimple-cumplehub-frosty-frost-1528"
