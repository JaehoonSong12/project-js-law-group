#!/bin/bash
# List of protected branches
ROOT_BRANCHES=( 
    "main" 
    # "master" 
    "develop" 
    "release"
)
# Error Handler: check if inside a Git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: you are not in a Git repository..."
    exit 1
fi

############################################
########## Shell Script (Scripts) ##########
############################################

# Fetch the latest changes from the remote repository
echo "Fetching remote branches..."
git fetch --prune

# List all remote branches (excluding the current branch)
echo "Available remote branches for deletion:"
REMOTE_BRANCHES=$(git branch -r | grep -v '\->' | sed 's/origin\///')
if [ -z "$REMOTE_BRANCHES" ]; then
    echo "No remote branches found."
    exit 0
fi

echo "$REMOTE_BRANCHES"

# Prompt the user to input the branch name to delete
read -p "Enter the name of the branch to delete (or press Enter to cancel): " BRANCH_NAME

# Validate input
if [ -z "$BRANCH_NAME" ]; then
    echo "No branch name provided. Operation cancelled."
    exit 1
fi

# Check if the branch is protected
if [[ " ${ROOT_BRANCHES[@]} " =~ " $BRANCH_NAME " ]]; then
    echo "Error: '$BRANCH_NAME' is a protected branch and cannot be deleted."
    exit 1
fi

# Check if the branch exists remotely
if ! echo "$REMOTE_BRANCHES" | grep -qw "$BRANCH_NAME"; then
    echo "Error: Remote branch '$BRANCH_NAME' does not exist."
    exit 1
fi

# Confirm deletion
read -p "Are you sure you want to delete the remote branch '$BRANCH_NAME'? [y/N]: " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Delete the remote branch
echo "Deleting the remote branch '$BRANCH_NAME'..."
git push origin --delete "$BRANCH_NAME"

# Check if the same-named local branch exists and delete it
if git branch --list | grep -qw "$BRANCH_NAME"; then
    echo "Deleting the local branch '$BRANCH_NAME'..."
    git branch -D "$BRANCH_NAME" 
    # Use -D instead of -d if you want to force delete
else
    echo "Local branch '$BRANCH_NAME' does not exist. Skipping local branch deletion."
fi

echo "Done! The branch '$BRANCH_NAME' has been cleaned up."