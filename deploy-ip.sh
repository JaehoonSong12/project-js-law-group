#!/bin/bash
set -e


# CONFIGURATION VARIABLES
# ==============================================================================
# DOKKU VERSION
# ==============================================================================
export DOKKU_VERSION="v0.34.6"
# ==============================================================================
# APP CONFIGURATION
# ==============================================================================
export APP_NAME="jslawgroup-ip"                             # A different app name to verify independently of the production one
export OCI_SERVER_IP="152.70.198.43"                        # The public IP address of the OCI server
export APP_DOMAINS="app.$OCI_SERVER_IP.sslip.io"            # Magic Domain: This resolves to 152.70.198.43 automatically. We prefix 'app' so it becomes app.152.70.198.43.sslip.io
export LETSENCRYPT_EMAIL="info.jslawgroup.bot@gmail.com"    # Email for SSL certificate (Let's Encrypt works with sslip.io!)
export SSH_PRIVATE_KEY="ssh-key-amd-e2-ubuntu.key"          # SSH Key for Client Deployment (Relative to project root)


echo "=============================================================================="
echo " DOKKU CLIENT DEPLOY: $APP_NAME"
echo " Target: $OCI_SERVER_IP (sslip.io)"
echo "=============================================================================="

# Resolve SSH Key Path
KEY_PATH=""
if [ -f "$SCRIPT_DIR/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$SCRIPT_DIR/$SSH_PRIVATE_KEY"
elif [ -f "$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(pwd)/$SSH_PRIVATE_KEY"
elif [ -f "$(cd "$SCRIPT_DIR/../../" 2>/dev/null && pwd)/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(cd "$SCRIPT_DIR/../../" && pwd)/$SSH_PRIVATE_KEY"
fi

if [ -n "$KEY_PATH" ]; then
    echo ">> Found SSH Key: $KEY_PATH"
    chmod 600 "$KEY_PATH" 2>/dev/null || true 
    export GIT_SSH_COMMAND="ssh -i "$KEY_PATH" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
else
    echo ">> Warning: SSH Key not found. Deployment may fail."
fi

# Git Remote Setup
REMOTE_NAME="dokku-ip"
if git remote | grep -q "^$REMOTE_NAME$"; then
    git remote remove $REMOTE_NAME
fi

echo ">> Adding git remote '$REMOTE_NAME' -> dokku@$OCI_SERVER_IP:$APP_NAME"
git remote add $REMOTE_NAME "dokku@$OCI_SERVER_IP:$APP_NAME"

# Commit Changes
echo ">> Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "Auto-commit: ready for IP deployment"
fi

# Deploy
echo ">> Deploying to OCI..."
git push $REMOTE_NAME main:master

echo "=============================================================================="
echo " DEPLOYMENT COMPLETE"
echo " Access your app at: http://$APP_DOMAINS"
echo "=============================================================================="
