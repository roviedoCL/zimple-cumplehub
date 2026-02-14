#!/bin/bash

export PATH="$HOME/.fly/bin:$PATH"

echo "🚀 Verificando logs de la base de datos..."
flyctl logs --app zimple-cumplehub-db 2>&1 | tail -50