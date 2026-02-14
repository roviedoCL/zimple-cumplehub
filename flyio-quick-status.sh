#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Estado rápido..."

echo ""
echo "=== DB Status ==="
flyctl status --app zimple-cumplehub-db 2>&1 | head -10

echo ""
echo "=== App Status ==="  
flyctl status --app zimple-cumplehub-frosty-frost-1528 2>&1 | head -10

echo ""
echo "=== Volúmenes ==="
flyctl volumes list --app zimple-cumplehub-db 2>&1

echo ""
echo "✅ Listo"