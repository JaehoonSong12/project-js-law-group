#!/bin/bash
# Error Handler: check if repo
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: you are not in a Git repository..."
    exit 0
fi
# Error Handler: check for arguments
if [ "$#" -lt 1 ]; then
  echo "Usage: ../git03-branch+push.sh <branch_name> [commit_message]"
  exit 1
fi
# Variables
BRANCH_NAME=$1
COMMIT_MESSAGE=${2:-"Commit from $USER on $(date)"}
TEMP_BRANCH="temp-branch-$(date +%s)"
############################################
########## Shell Script (Scripts) ##########
############################################
echo "========= STATUS REFERENCE ========="
echo "(1) - temporary branch created (fetching...)"
echo "(2) - deleting local/remote branch (if exists)"
echo "(3) - branch created"
echo "(4) - temporary branch cleanup"
echo "(5) - commit"
echo "(6) - push to remote"
echo "===================================="
echo ""

# Move to a temporary branch with all local work
git fetch origin # Downloads remote changes. Does not modify your working directory or current branch.
echo "Status (1) Creating and switching to temporary branch: $TEMP_BRANCH"
git checkout -b $TEMP_BRANCH
# Check if the branch name exists locally and delete it, then switch to the branch
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
  echo "Status (2) Branch $BRANCH_NAME exists locally. Deleting it."
  git branch -D $BRANCH_NAME
fi
if git ls-remote --exit-code --heads origin $BRANCH_NAME > /dev/null; then
  echo "Status (2) Remote branch $BRANCH_NAME exists. Deleting it."
  git push origin --delete $BRANCH_NAME
fi
echo "Status (3) Creating and switching to branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME
# Delete the temporary branch
echo "Status (4) Deleting temporary branch: $TEMP_BRANCH"
git branch -D $TEMP_BRANCH
# Commit all the changes
echo "Status (5) Staging and committing changes with message: '$COMMIT_MESSAGE'"
git add .
git commit -m "$COMMIT_MESSAGE"
# Push the branch to the remote repository
echo "Status (6) Pushing branch $BRANCH_NAME to origin..."
git push -u origin $BRANCH_NAME





# --- prerequisites ---
command -v gh >/dev/null 2>&1 || { echo "ERROR: gh not installed" >&2; exit 1; }

# --- auth: only if not logged in (uses GH_TOKEN env var) ---
if ! gh auth status >/dev/null 2>&1; then
  if [[ -n "${GH_TOKEN:-}" ]]; then
    printf "%s" "$GH_TOKEN" | gh auth login --with-token
    # # reduce exposure
    # unset GH_TOKEN
    # echo "Authenticated via GH_TOKEN"
  else
    echo "Not authenticated and GH_TOKEN not set. Set GH_TOKEN or run 'gh auth login' in PowerShell/cmd." >&2
    echo "or this might be your network issue, check it out." >&2
    exit 2
  fi
else
  echo "gh already authenticated"
fi

# --- create PR ---
gh pr create --fill --title "$COMMIT_MESSAGE" --body "Automated pull request for branch $BRANCH_NAME."


echo "Branch $BRANCH_NAME is created, committed, and pushed successfully!"
echo "Done! You can now create a pull request on GitHub."