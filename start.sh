#!/bin/sh

# Script de inicio para Railway
set -e

echo "Starting Zimple CumpleHub API..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Verificar que los archivos existen
echo "Checking backend files..."
ls -la backend/dist/ | head -10

echo "Checking frontend files..."
ls -la frontend/dist/ | head -10

# Iniciar la aplicación
echo "Starting Node.js application..."
exec node backend/dist/main.js