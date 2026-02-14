#!/bin/bash

# Script final para redeploy forzando rebuild del backend

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Desplegando con rebuild completo..."
flyctl deploy --app zimple-cumplehub-frosty-frost-1528 --no-cache

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "Verifica los logs:"
echo "  flyctl logs --app zimple-cumplehub-frosty-frost-1528"
echo ""
echo "Verifica el status:"
echo "  flyctl status --app zimple-cumplehub-frosty-frost-1528"