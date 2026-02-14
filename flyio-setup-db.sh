#!/bin/bash

# Script para configurar base de datos en Fly.io

echo "🚀 Configurando base de datos para Fly.io..."
echo ""

# Agregar flyctl al PATH
export PATH="$HOME/.fly/bin:$PATH"

echo "1. Listando tus apps en Fly.io:"
flyctl apps list
echo ""

echo "2. Si no tienes una base de datos, crea una con:"
echo "   flyctl postgres create --name zimple-cumplehub-db"
echo ""

echo "3. Después de crear la DB, adjúntala a tu app:"
echo "   flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528"
echo ""

echo "O si prefieres, puedo crear todo automáticamente."
echo "¿Deseas crear la base de datos ahora? (y/n)"
read -r response

if [ "$response" = "y" ]; then
    echo "Creando base de datos..."
    flyctl postgres create --name zimple-cumplehub-db --region iad --vm-size shared-cpu-1x
    
    echo "Adjuntando base de datos a la app..."
    flyctl postgres attach zimple-cumplehub-db --app zimple-cumplehub-frosty-frost-1528
    
    echo "Redeployando la app..."
    flyctl deploy --app zimple-cumplehub-frosty-frost-1528
else
    echo "Operación cancelada."
fi