#!/bin/bash
set -e

# SCRIPT_NAME_TO_RUN="deploy.sh"
# rm -rf $SCRIPT_NAME_TO_RUN && touch $SCRIPT_NAME_TO_RUN  && chmod +x $SCRIPT_NAME_TO_RUN  && nano $SCRIPT_NAME_TO_RUN

# CONFIGURATION VARIABLES
# ==============================================================================
# DOKKU VERSION
# ==============================================================================
export DOKKU_VERSION="v0.34.6"
# ==============================================================================
# APP CONFIGURATION
# ==============================================================================
export OCI_SERVER_IP="152.70.198.43"                        # The public IP address of the OCI server
export SSH_PRIVATE_KEY="ssh-key-amd-e2-ubuntu.key"          # SSH Key for Client Deployment (Relative to project root)
export LETSENCRYPT_EMAIL="info.jslawgroup.bot@gmail.com"    # Email for SSL certificate (Let's Encrypt works with sslip.io!)
export HTTP_EXTERNAL_PORT="80"
export HTTPS_EXTERNAL_PORT="443"
export INTERNAL_PORT="5000"
# 1=production (custom domains), 2=ip (sslip.io, no DNS)
read -r -p "Mode: 1=production, 2=ip [1]: " choice
case "${choice:-1}" in
    1) export APP_NAME="jslawgroup247"
       export APP_DOMAINS="24-7autoaccidents.com www.24-7autoaccidents.com" ;;
    2) export APP_NAME="jslawgroup-ip"
       export APP_DOMAINS="app.$OCI_SERVER_IP.sslip.io" ;;
    *) echo "Invalid choice. Please enter 1 or 2."
       exit 1 ;;
esac











echo "=============================================================================="
echo " DOKKU CLIENT DEPLOY: $APP_NAME"
echo " Target: $OCI_SERVER_IP"
echo "=============================================================================="

# 1. Generate app.json (Auto-configure Ports)
# ------------------------------------------------------------------------------
echo ">> Generating app.json to configure Nginx ports ($HTTP_EXTERNAL_PORT->$INTERNAL_PORT)..."
cat > app.json <<EOF
{
  "name": "$APP_NAME",
  "description": "Flask App auto-configured for Dokku",
  "env": {
    "DOKKU_PROXY_PORT_MAP": "http:$HTTP_EXTERNAL_PORT:$INTERNAL_PORT https:$HTTPS_EXTERNAL_PORT:$INTERNAL_PORT"
  },
  "dokku": {
    "proxy": {
      "map": [
        {
          "scheme": "http",
          "container_port": $INTERNAL_PORT,
          "host_port": $HTTP_EXTERNAL_PORT
        },
        {
          "scheme": "https",
          "container_port": $INTERNAL_PORT,
          "host_port": $HTTPS_EXTERNAL_PORT
        }
      ]
    }
  }
}
EOF

# 2. Configure Git Remote
# ------------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo ">> Configuring git remote 'dokku'..."

KEY_PATH=""
if [ -f "$SCRIPT_DIR/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$SCRIPT_DIR/$SSH_PRIVATE_KEY"
elif [ -f "$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(pwd)/$SSH_PRIVATE_KEY"
elif [ -f "$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)/$SSH_PRIVATE_KEY" ]; then
    KEY_PATH="$(cd "$SCRIPT_DIR/../.." && pwd)/$SSH_PRIVATE_KEY"
fi

if [ -n "$KEY_PATH" ]; then
    echo ">> Found SSH Key: $KEY_PATH"
    chmod 600 "$KEY_PATH" 2>/dev/null || true
    export GIT_SSH_COMMAND="ssh -i \"$KEY_PATH\" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
else
    echo ">> Warning: SSH Key '$SSH_PRIVATE_KEY' not found."
    echo "   Ensure your SSH key is available or configured in ~/.ssh/config."
fi

if [ ! -d ".git" ]; then
    echo "Error: Current directory is not a git repository."
    echo "Please run this script from the root of your application repository."
    exit 1
fi

if git remote | grep -q "^dokku$"; then
    echo "Removing existing 'dokku' remote..."
    git remote remove dokku
fi

git remote add dokku "dokku@$OCI_SERVER_IP:$APP_NAME"
echo "Remote 'dokku' added: dokku@$OCI_SERVER_IP:$APP_NAME"

# 3. Deploy
# ------------------------------------------------------------------------------
echo ">> Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo ">> Auto-committing changes (including app.json)..."
    git add .
    git commit -m "Auto-commit: deployment updates"
else
    echo ">> No changes to commit."
fi

echo ">> Deploying to OCI (pushing main to master)..."
git push dokku main:master

echo "=============================================================================="
echo " DEPLOYMENT COMPLETE"
echo "=============================================================================="
for domain in $APP_DOMAINS; do
    echo " Access your app at: http://$domain"
done
echo "=============================================================================="
