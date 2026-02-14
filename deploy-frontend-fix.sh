#!/bin/bash

echo "=== Deploy Frontend Fix to Railway ==="
echo ""

# Add all changes
echo "Adding changes to git..."
git add frontend/Dockerfile
git add frontend/nginx.conf
git add frontend/vite.config.ts
git add frontend/.env.example
git add railway-frontend.json
git add deploy-frontend-fix.sh

# Commit changes
echo "Committing changes..."
git commit -m "fix(frontend): Fix Railway deployment configuration

- Remove proxy to backend from nginx (not needed in Railway)
- Remove test configuration from vite.config.ts (file didn't exist)
- Add build argument VITE_API_URL to Dockerfile
- Create .env.example for frontend environment variables
- Create railway-frontend.json for Railway-specific config

This fixes the 'Application failed to respond' error by ensuring
nginx serves the static files correctly without trying to proxy
to a non-existent backend service."

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Changes pushed successfully! ==="
echo ""
echo "Next steps:"
echo "1. Go to Railway dashboard: https://railway.app/dashboard"
echo "2. Select your frontend service"
echo "3. Go to Variables and add:"
echo "   VITE_API_URL=https://zimple-cumplehub-api-production.up.railway.app"
echo "4. Deploy will start automatically"
echo ""
echo "Note: Make sure to use your actual backend Railway URL"