#!/bin/bash

echo "=== Deploy Encryption Module Fix ==="
echo ""

# Add the fix
git add backend/src/infrastructure/encryption/encryption.module.ts

# Commit
git commit -m "fix(encryption): Add ConfigModule import to EncryptionModule

The EncryptionService was using ConfigService but ConfigModule was not
imported, causing ENCRYPTION_KEY to be undefined in production.

This fixes the 'ENCRYPTION_KEY environment variable is required' error
when deploying to Railway."

# Push
git push origin main

echo ""
echo "=== Fix deployed! ==="
echo ""
echo "Railway should automatically redeploy the backend."