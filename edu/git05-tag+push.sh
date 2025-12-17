#!/bin/bash

# Fetch tags from the remote repository
git fetch --tags

# Get the latest tag or fall back to "v0.0.0" if no tags are found
latest_tag=$(git tag --sort=-v:refname | head -n 1)
latest_tag=${latest_tag:-v0.0.0}

# Output the latest tag
echo "Latest tag: $latest_tag"

# Parse the version components
IFS='.' read -r major minor patch <<<"${latest_tag#v}"

# Prompt for user input
echo "What type of release would you like to create?"
echo "Options: [major, minor, patch, none]"
read -p "Enter your choice: " choice

# Decide which version to bump
case "$choice" in
  major)
    new_tag="v$((major + 1)).0.0"
    ;;
  minor)
    new_tag="v$major.$((minor + 1)).0"
    ;;
  patch)
    new_tag="v$major.$minor.$((patch + 1))"
    ;;
  none)
    echo "No changes made. Exiting."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Confirm the new tag
echo "Creating new tag: $new_tag"
read -p "Are you sure? [y/N]: " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted. No changes made."
  exit 0
fi

# Create and push the tag
git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

echo "Tag $new_tag pushed successfully! release your software product!"