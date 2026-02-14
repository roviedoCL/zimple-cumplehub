#!/bin/bash

# Script de verificación para Render deploy
# Uso: ./render-verify.sh https://tu-app.onrender.com

if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar la URL de tu app"
  echo "Uso: ./render-verify.sh https://zimple-cumplehub-app.onrender.com"
  exit 1
fi

APP_URL=$1

echo "🔍 Verificando deploy en Render..."
echo "URL: $APP_URL"
echo ""

# 1. Verificar health check
echo "1️⃣ Verificando health check..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health")

if [ "$HEALTH_RESPONSE" = "200" ]; then
  echo "✅ Health check OK (200)"
  curl -s "$APP_URL/api/health" | jq .
else
  echo "❌ Health check FAILED (HTTP $HEALTH_RESPONSE)"
fi
echo ""

# 2. Verificar frontend
echo "2️⃣ Verificando frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/")

if [ "$FRONTEND_RESPONSE" = "200" ]; then
  echo "✅ Frontend OK (200)"
else
  echo "❌ Frontend FAILED (HTTP $FRONTEND_RESPONSE)"
fi
echo ""

# 3. Verificar API docs
echo "3️⃣ Verificando API docs..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api")

if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "301" ] || [ "$API_RESPONSE" = "302" ]; then
  echo "✅ API docs OK (HTTP $API_RESPONSE)"
else
  echo "⚠️ API docs status: HTTP $API_RESPONSE"
fi
echo ""

# 4. Test de latencia
echo "4️⃣ Test de latencia..."
LATENCY=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/api/health")
echo "⏱️ Latencia: ${LATENCY}s"
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$HEALTH_RESPONSE" = "200" ] && [ "$FRONTEND_RESPONSE" = "200" ]; then
  echo "✅ Deploy EXITOSO - La aplicación está funcionando correctamente"
  echo ""
  echo "🔗 URLs:"
  echo "   - App: $APP_URL"
  echo "   - Health: $APP_URL/api/health"
  echo "   - API: $APP_URL/api"
else
  echo "❌ Deploy con PROBLEMAS - Revisa los logs en Render"
  echo ""
  echo "🔧 Troubleshooting:"
  echo "   1. Ve a https://dashboard.render.com"
  echo "   2. Selecciona tu servicio"
  echo "   3. Click en 'Logs' para ver errores"
  echo "   4. Verifica las variables de entorno"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
