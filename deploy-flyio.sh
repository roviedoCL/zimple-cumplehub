#!/bin/bash

# Script para deployar en Fly.io

echo "🚀 Configurando Fly.io..."

# Agregar flyctl al PATH para esta sesión
export PATH="$HOME/.fly/bin:$PATH"

# Verificar instalación
echo "Verificando flyctl..."
flyctl version

echo ""
echo "🚀 Iniciando deploy en Fly.io..."
echo ""
echo "Sigue estos pasos:"
echo ""
echo "1. Login en Fly.io:"
echo "   flyctl auth login"
echo ""
echo "2. Crear la app (solo la primera vez):"
echo "   flyctl launch"
echo ""
echo "3. Crear base de datos PostgreSQL:"
echo "   flyctl postgres create --name zimple-cumplehub-db"
echo ""
echo "4. Configurar secretos:"
echo "   flyctl secrets set ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
echo "   flyctl secrets set JWT_SECRET=\$(openssl rand -hex 32)"
echo ""
echo "5. Deploy:"
echo "   flyctl deploy"
echo ""
echo "O ejecuta todos los comandos automáticamente:"
echo "   export PATH=\"\$HOME/.fly/bin:\$PATH\""
echo "   flyctl auth login"
echo "   flyctl launch --name zimple-cumplehub --region iad --no-deploy"
echo "   flyctl postgres attach zimple-cumplehub-db"
echo "   flyctl secrets set ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
echo "   flyctl deploy"