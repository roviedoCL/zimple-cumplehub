#!/bin/bash

echo "=== Deploy Encryption Fix v2 ==="
echo ""

# Add the changes
git add backend/src/infrastructure/encryption/encryption.service.ts
git add backend/src/infrastructure/encryption/encryption.module.ts

# Commit
git commit -m "fix(encryption): Use process.env directly for ENCRYPTION_KEY

Changed EncryptionService to use process.env.ENCRYPTION_KEY directly
instead of ConfigService to avoid dependency injection issues.

This ensures the environment variable is accessible in Railway
without requiring ConfigModule to be imported.

Added debug logging to help troubleshoot environment variable issues."

# Push
git push origin main

echo ""
echo "=== Fix deployed! ==="
echo ""
echo "Railway should automatically redeploy the backend."