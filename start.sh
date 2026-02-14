#!/bin/sh

# Script de inicio para Railway/Fly.io
set -e

echo "=========================================="
echo "Starting Zimple CumpleHub API..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV}"
echo "=========================================="

# Verificar que los archivos existen
echo "Checking backend files..."
ls -la backend/dist/ | head -10

echo "Checking frontend files..."
ls -la frontend/dist/ | head -10

# Verificar main.js existe
echo "Checking main.js..."
if [ -f "backend/dist/main.js" ]; then
    echo "main.js exists!"
    echo "First 20 lines of main.js:"
    head -20 backend/dist/main.js
else
    echo "ERROR: main.js not found!"
    exit 1
fi

# Iniciar la aplicación
echo "=========================================="
echo "Starting Node.js application on port ${PORT:-3000}..."
echo "=========================================="
exec node backend/dist/main.js