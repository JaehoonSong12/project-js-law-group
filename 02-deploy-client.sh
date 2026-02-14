#!/bin/bash
set -e

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

echo "=============================================================================="
echo " DOKKU CLIENT DEPLOY: $APP_NAME"
echo " Target: $OCI_SERVER_IP"
echo "=============================================================================="

# 1. Configure Git Remote
# ------------------------------------------------------------------------------
echo ">> Configuring git remote 'dokku'..."

# Resolve SSH Key Path
# Check valid locations for the key
KEY_PATH=""
if [ -f "$SCRIPT_DIR/$SSH_PRIVATE_KEY" ]; then
    # Scenario 1: Script and Key are in the same directory (e.g., Project Root)
    KEY_PATH="$SCRIPT_DIR/$SSH_PRIVATE_KEY"
elif [ -f "$SSH_PRIVATE_KEY" ]; then
    # Scenario 2: Key is in current working directory
    KEY_PATH="$(pwd)/$SSH_PRIVATE_KEY"
elif [ -f "$(cd "$SCRIPT_DIR/../../" 2>/dev/null && pwd)/$SSH_PRIVATE_KEY" ]; then
    # Scenario 3: Script is in scripts/dokku/, Key is in Project Root
    KEY_PATH="$(cd "$SCRIPT_DIR/../../" && pwd)/$SSH_PRIVATE_KEY"
fi

if [ -n "$KEY_PATH" ]; then
    echo ">> Found SSH Key: $KEY_PATH"
    # On Windows (Git Bash/WSL), permissions are tricky, but try to be safe
    chmod 600 "$KEY_PATH" 2>/dev/null || true 
    # Use the absolute path for safety
    export GIT_SSH_COMMAND="ssh -i \"$KEY_PATH\" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
else
    echo ">> Warning: SSH Key '$SSH_PRIVATE_KEY' not found."
    echo "   Ensure your SSH key is available or configured in ~/.ssh/config."
fi

# Check if we are in a git repo
if [ ! -d ".git" ]; then
    echo "Error: Current directory is not a git repository."
    echo "Please run this script from the root of your application repository."
    exit 1
fi

# Remove existing remote if it exists to avoid errors
if git remote | grep -q "^dokku$"; then
    echo "Removing existing 'dokku' remote..."
    git remote remove dokku
fi

# Add new remote
git remote add dokku "dokku@$OCI_SERVER_IP:$APP_NAME"
echo "Remote 'dokku' added: dokku@$OCI_SERVER_IP:$APP_NAME"

# 2. Deploy
# ------------------------------------------------------------------------------
echo ">> Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo ">> Auto-committing changes before deployment..."
    git add .
    git commit -m "Auto-commit: deployment updates"
else
    echo ">> No changes to commit."
fi

echo ">> Deploying to OCI (pushing main to master)..."
echo "Note: If you are using a different branch, modify the push command."
git push dokku main:master

echo "=============================================================================="
echo " DEPLOYMENT INITIATED"
echo "=============================================================================="
