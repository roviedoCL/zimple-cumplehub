#!/bin/bash

# Script de preparación para deploy en Render

echo "🚀 Preparando código para deploy en Render..."
echo ""

# 1. Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Rama actual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️ No estás en la rama 'main'"
  read -p "¿Quieres cambiar a 'main'? (y/n): " SWITCH
  if [ "$SWITCH" = "y" ]; then
    git checkout main
  else
    echo "ℹ️ Continuando en la rama '$CURRENT_BRANCH'"
  fi
fi
echo ""

# 2. Verificar archivos críticos
echo "🔍 Verificando archivos críticos..."
FILES_TO_CHECK=(
  "Dockerfile"
  "render.yaml"
  "backend/package.json"
  "frontend/package.json"
  "backend/src/modules/health/health.controller.ts"
)

ALL_GOOD=true
for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - FALTA"
    ALL_GOOD=false
  fi
done
echo ""

if [ "$ALL_GOOD" = false ]; then
  echo "❌ Faltan archivos críticos. Por favor revisa."
  exit 1
fi

# 3. Verificar que no hay archivos .env en el stage
echo "🔒 Verificando seguridad..."
if git ls-files | grep -q "\.env$"; then
  echo "⚠️ ADVERTENCIA: Hay archivos .env en el repositorio"
  echo "   Estos archivos NO deberían estar en GitHub"
  echo ""
  read -p "¿Quieres continuar de todos modos? (y/n): " CONTINUE
  if [ "$CONTINUE" != "y" ]; then
    echo "❌ Deploy cancelado"
    exit 1
  fi
else
  echo "✅ No hay archivos .env en el repositorio"
fi
echo ""

# 4. Mostrar estado de Git
echo "📊 Estado de Git:"
git status --short
echo ""

# 5. Opciones de deploy
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "¿Qué quieres hacer?"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1) Agregar cambios y hacer commit"
echo "2) Solo hacer push (si ya hiciste commit)"
echo "3) Ver guía de deploy en Render"
echo "4) Cancelar"
echo ""
read -p "Selecciona una opción (1-4): " OPTION

case $OPTION in
  1)
    echo ""
    read -p "Mensaje del commit: " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
      COMMIT_MSG="Ready for Render deploy"
    fi
    
    git add .
    git commit -m "$COMMIT_MSG"
    
    echo ""
    read -p "¿Hacer push ahora? (y/n): " DO_PUSH
    if [ "$DO_PUSH" = "y" ]; then
      git push origin $(git branch --show-current)
      echo ""
      echo "✅ Código pusheado a GitHub"
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "🎯 PRÓXIMOS PASOS:"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "1. Ve a https://render.com"
      echo "2. Click en 'New' → 'Blueprint'"
      echo "3. Selecciona tu repositorio"
      echo "4. Render detectará 'render.yaml' automáticamente"
      echo "5. Click en 'Apply'"
      echo ""
      echo "📖 Guía completa: cat DEPLOY_RENDER_COMPLETO.md"
      echo "🔍 Verificar deploy: ./render-verify.sh https://tu-app.onrender.com"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
    ;;
  
  2)
    git push origin $(git branch --show-current)
    echo ""
    echo "✅ Código pusheado a GitHub"
    echo ""
    echo "🎯 Ahora ve a https://render.com y crea tu Blueprint"
    echo "📖 Guía completa: cat DEPLOY_RENDER_COMPLETO.md"
    ;;
  
  3)
    echo ""
    cat DEPLOY_RENDER_COMPLETO.md
    ;;
  
  4)
    echo "❌ Deploy cancelado"
    exit 0
    ;;
  
  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac
