#!/bin/bash

# Verificar apps en Fly.io

export PATH="$HOME/.fly/bin:$PATH"

echo "📊 Apps en tu cuenta de Fly.io:"
flyctl apps list

echo ""
echo "📊 Status de la app principal:"
flyctl status --app zimple-cumplehub-frosty-frost-1528

echo ""
echo "📊 Variables de entorno:"
flyctl secrets list --app zimple-cumplehub-frosty-frost-1528