#!/bin/bash
NAME="Jaehoon"                                          #### YOUR DATA HERE
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
MESSAGE="$TIMESTAMP updated by $NAME"
# Error Handler: check if repo
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: you are not in a Git repository..."
    exit 0
fi
############################################
########## Shell Script (Scripts) ##########
############################################
## git-commit
git add --all
git commit -a -m "Normal Execution commit: $MESSAGE"
# git push
git push origin main
# Username: <your-new-username>
# Password: <paste your PAT here>
