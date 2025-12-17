# Git Commands Cheat Sheet

This document lists **practical Git commands you actually need** for daily development, organized by workflow stage. It is not every Git command ever, but the complete *useful* set.

---

## 1. Configuration

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
```

View config:
```bash
git config --list
git config user.name
```

---

## 2. Repository Setup

```bash
git init
git clone <repo-url>
git clone <repo-url> <directory>
```

---

## 3. Basic Workflow (Most Used)

```bash
git status
git add <file>
git add .
git commit -m "message"
git commit -am "message"   # tracked files only
git push
git pull
```

---

## 4. Staging Area Control

```bash
git reset <file>        # unstage
git restore --staged <file>
git restore <file>      # discard working changes
git diff
git diff --staged
```

---

## 5. Branching

```bash
git branch
git branch <name>
git checkout <branch>
git checkout -b <branch>
git switch <branch>
git switch -c <branch>
git branch -d <branch>
git branch -D <branch>
```

---

## 6. Merging & Rebasing

```bash
git merge <branch>
git rebase <branch>
git rebase -i HEAD~n
git merge --abort
git rebase --abort
git rebase --continue
```

---

## 7. Remote Repositories

```bash
git remote -v
git remote add origin <url>
git remote remove origin
git fetch
git fetch --all
git pull origin main
git push origin main
git push -u origin <branch>
```

---

## 8. Commit History & Inspection

```bash
git log
git log --oneline --graph --decorate --all
git show <commit>
git blame <file>
```

---

## 9. Undoing Things (Very Important)

### Amend last commit
```bash
git commit --amend
```

### Reset
```bash
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

### Revert (safe for shared branches)
```bash
git revert <commit>
```

---

## 10. Stashing

```bash
git stash
git stash push -m "message"
git stash list
git stash pop
git stash apply
git stash drop
git stash clear
```

---

## 11. Tags & Releases

```bash
git tag
git tag v1.0.0
git tag -a v1.0.0 -m "release"
git push origin v1.0.0
git push --tags
```

---

## 12. Cleaning & Maintenance

```bash
git clean -n
git clean -f
git gc
git fsck
```

---

## 13. Submodules (If Needed)

```bash
git submodule add <repo>
git submodule update --init --recursive
git submodule foreach git pull
```

---

## 14. Cherry-Picking & Advanced

```bash
git cherry-pick <commit>
git reflog
git bisect start
git bisect good <commit>
git bisect bad <commit>
git bisect reset
```

---

## 15. Credentials & Auth

```bash
git config --global credential.helper store
git config --global --unset credential.helper
git credential reject
```

---

## 16. Aliases (Optional but Recommended)

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate --all"
```

---

## 17. Typical Daily Command Set (Minimal)

```bash
git status
git add .
git commit -m "msg"
git pull --rebase
git push
git log --oneline --graph
```

---

## 18. Emergency Commands You Should Remember

```bash
git reflog
git reset --hard
git checkout -- <file>
git clean -fd
```

---

## Summary

If you know **Sections 3, 5, 6, 8, 9, and 10**, you know Git well enough for professional work.

This file is suitable as a printable `.md` Git cheat sheet.

