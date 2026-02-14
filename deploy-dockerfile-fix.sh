#!/bin/bash

echo "=== Deploy Dockerfile Fix ==="
echo ""

# Add the changes
git add Dockerfile

# Commit
git commit -m "fix(docker): Add default ENCRYPTION_KEY to Dockerfile

Added ENV ENCRYPTION_KEY to Dockerfile as a default value.
This ensures the backend can start even if Railway doesn't
inject the environment variable correctly.

Note: In production, you should override this with a secure
key via Railway's environment variables."

# Push
git push origin main

echo ""
echo "=== Fix deployed! ==="
echo ""
echo "Railway should automatically redeploy."