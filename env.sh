# Configuration for Dokku Automation

# ==============================================================================
# APP CONFIGURATION
# ==============================================================================
# The name of the Dokku app
export APP_NAME="jslawgroup247"

# The domain(s) for the application (space separated)
export APP_DOMAINS="24-7autoaccidents.com www.24-7autoaccidents.com"

# Email for SSL certificate (Let's Encrypt)
export LETSENCRYPT_EMAIL="info.jslawgroup.bot@gmail.com"

# The public IP address of the OCI server
# You should update this if it changes or retrieve it dynamically
export OCI_SERVER_IP="152.70.198.43"

# SSH Key for Client Deployment (Relative to project root or absolute)
export SSH_PRIVATE_KEY="ssh-key-amd-e2-ubuntu.key"

# ==============================================================================
# DOKKU VERSION
# ==============================================================================
export DOKKU_VERSION="v0.34.6"
