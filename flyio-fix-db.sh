#!/bin/bash

# Script para reparar base de datos en Fly.io

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Reparando base de datos..."

echo "1. Reiniciando base de datos..."
flyctl machines list --app zimple-cumplehub-db

echo ""
echo "2. Intentando iniciar la base de datos..."
flyctl machines start d890d61b734e28 --app zimple-cumplehub-db || echo "No se pudo iniciar"

echo ""
echo "3. Esperando 10 segundos..."
sleep 10

echo ""
echo "4. Verificando status de la base de datos..."
flyctl status --app zimple-cumplehub-db

echo ""
echo "5. Adjuntando base de datos a la app..."
flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528 || echo "No se pudo adjuntar"

echo ""
echo "6. Verificando variables..."
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528