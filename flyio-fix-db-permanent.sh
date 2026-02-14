#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Solución permanente para la base de datos..."

# Verificar si la DB está corriendo
echo ""
echo "=== Estado actual de la DB ==="
flyctl status --app zimple-cumplehub-db

# Iniciar la DB si está detenida
echo ""
echo "=== Iniciando DB si es necesario ==="
flyctl machine start e2861057a30938 --app zimple-cumplehub-db 2>/dev/null || echo "DB ya iniciada o error"

echo ""
echo "⏳ Esperando 30 segundos..."
sleep 30

echo ""
echo "=== Verificando estado ==="
flyctl status --app zimple-cumplehub-db

echo ""
echo "=== Verificando health checks ==="
flyctl checks list --app zimple-cumplehub-db

echo ""
echo "🚀 Reiniciando la app..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "✅ Proceso completado!"