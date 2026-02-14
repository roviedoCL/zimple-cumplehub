#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Iniciando base de datos..."

# Iniciar la máquina de la base de datos
flyctl machine start e2861057a30938 --app zimple-cumplehub-db

echo ""
echo "⏳ Esperando 30 segundos para que la DB inicie..."
sleep 30

echo ""
echo "🚀 Verificando estado..."
flyctl status --app zimple-cumplehub-db

echo ""
echo "🚀 Verificando health checks..."
flyctl checks list --app zimple-cumplehub-db

echo ""
echo "✅ Base de datos iniciada"