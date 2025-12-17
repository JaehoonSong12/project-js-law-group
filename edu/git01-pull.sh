#!/bin/bash
ROOT_BRANCH="main"
ROOT_BRANCHES=(
    "main" 
    "master" 
    "develop" 
    "release"
)
# Error Handler: check if repo
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: you are not in a Git repository..."
    exit 0
fi
############################################
########## Shell Script (Scripts) ##########
############################################
echo "========= STATUS REFERENCE ========="
echo "(1) - branch checkout (origin/main)"
echo "(2) - commit (backup)"
echo "(3) - pull"
echo "===================================="
echo ""
# (1) Go back to main branch
echo "Status (1) going back to 'main' brach..!!"
git checkout $ROOT_BRANCH
git fetch origin
git reset --hard origin/$ROOT_BRANCH

# (2) Save uncommitted changes if any
if git rev-parse --is-inside-work-tree > /dev/null 2>&1 && ! git diff-index --quiet HEAD --; then
    echo "Status (2) Uncommitted changes detected. Staging and committing temporarily..."
    git add .
    TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
    git commit -m "Temporary commit: $TIMESTAMP"
fi
## (3) git-pull (to fetch)
if git rev-parse --is-inside-work-tree > /dev/null 2>&1 && git fetch --all && git pull --all; then
    echo "Status (3) All updates pulled successfully."
fi
# Clean all local branches
ALL_BRANCHES=$(git branch | sed 's/* //g' | sed 's/ //g')
for BRANCH in $ALL_BRANCHES; do
  if [[ ! " ${ROOT_BRANCHES[@]} " =~ " ${BRANCH} " ]]; then
    echo "- Deleting branch: $BRANCH"
    git branch -D $BRANCH
  else
    echo "- Keeping important branch: $BRANCH"
  fi
done