#!/bin/bash
set -e

# ==============================================================================
# CONFIGURATION
# ==============================================================================
export DOKKU_VERSION="v0.34.6"
export APP_NAME="jslawgroup-ip"
export OCI_SERVER_IP="152.70.198.43"
export APP_DOMAINS="app.$OCI_SERVER_IP.sslip.io"
export LETSENCRYPT_EMAIL="info.jslawgroup.bot@gmail.com"
export SSH_PRIVATE_KEY="ssh-key-amd-e2-ubuntu.key"

echo "=============================================================================="
echo " DOKKU CLIENT DEPLOY: $APP_NAME"
echo " Target: $OCI_SERVER_IP (sslip.io)"
echo "=============================================================================="

# 1. Generate app.json (Auto-configure Ports)
# ------------------------------------------------------------------------------
echo ">> Generating app.json to configure Nginx ports (80->5000)..."
cat > app.json <<EOF
{
  "name": "$APP_NAME",
  "description": "Flask App auto-configured for Dokku",
  "dokku": {
    "proxy": {
      "map": [
        {
          "scheme": "http",
          "container_port": 5000,
          "host_port": 80
        },
        {
          "scheme": "https",
          "container_port": 5000,
          "host_port": 443
        }
      ]
    }
  }
}
EOF

# 2. Resolve SSH Key Path
# ------------------------------------------------------------------------------
KEY_PATH=""
if [ -f "$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(pwd)/$SSH_PRIVATE_KEY"
elif [ -f "$(dirname "$0")/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(dirname "$0")/$SSH_PRIVATE_KEY"
elif [ -f "$(cd "$(dirname "$0")/../../" 2>/dev/null && pwd)/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(cd "$(dirname "$0")/../../" && pwd)/$SSH_PRIVATE_KEY"
fi

if [ -n "$KEY_PATH" ]; then
    echo ">> Found SSH Key: $KEY_PATH"
    chmod 600 "$KEY_PATH" 2>/dev/null || true 
    export GIT_SSH_COMMAND="ssh -i \"$KEY_PATH\" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
else
    echo ">> Warning: SSH Key not found. Deployment may fail."
fi

# 3. Git Remote Setup
# ------------------------------------------------------------------------------
REMOTE_NAME="dokku-ip"
if git remote | grep -q "^$REMOTE_NAME$"; then
    git remote remove $REMOTE_NAME
fi

echo ">> Adding git remote '$REMOTE_NAME' -> dokku@$OCI_SERVER_IP:$APP_NAME"
git remote add $REMOTE_NAME "dokku@$OCI_SERVER_IP:$APP_NAME"

# 4. Commit Changes (app.json + others)
# ------------------------------------------------------------------------------
echo ">> Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo ">> Auto-committing changes (including app.json)..."
    git add .
    git commit -m "Auto-commit: deployment updates (added app.json)"
fi

# 5. Deploy
# ------------------------------------------------------------------------------
echo ">> Deploying to OCI..."
git push $REMOTE_NAME main:master

echo "=============================================================================="
echo " DEPLOYMENT COMPLETE"
echo " Access your app at: http://$APP_DOMAINS"
echo "=============================================================================="
