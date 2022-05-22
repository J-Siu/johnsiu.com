---
type: blog
date: 2019-07-30T18:05:58-04:00
author: "John Siu"
title: "Git Commands"
description: "My git command cheat sheet."
tags: ["git","cheatsheet","command-line"]
aliases:
    - /blog/git-cmd
---
Some git commands.
<!--more-->
### Push

#### Branch

```sh
git push -u <name> <branch>
git push -u origin master
git push -u origin main
```

### Remote

#### Show

```sh
git remote -v
```

#### Remove

```sh
git remote remove origin
git remote remove <name>
```

### Add/Stage

```sh
git add . # Add everything in current dir tree. This include sub-dir recursively.
git add <file/dir>...
```

### Remove From Stage

```sh
git rm <file/dir>...
```

### Commit Staged Changes

```sh
git commit -m '<comment>'
git commit -a # Commit all staged files.
git commit <file/dir> # Commit files directly even not staged.
```

### Tag

#### Add

```sh
git tag # List tags
git tag <version> # Light weight tag
git tag -a v0.1 -m "Version 0.1"
git tag -a <version> -m '<comment>'
git show <version> # Show tagged commit
```

#### Push to server

```sh
git push --tags
```

#### Delete

```sh
git tag -d <version>
git tag -d v1.0.1
```

#### Delete from server

Yes, it is a push command.
```sh
git push -d <version>
git push -d v1.0.1
```

### Branch

#### List
```sh
git branch
git branch -l
```
#### Create
```sh
git branch <new branch>
git branch <new branch> <from branch>
git branch <new branch> <from tag>
git branch <new branch> <from commit>
```

#### Switch
```sh
git switch <branch>
# switch & create
git switch -c <branch>
```
### Submodule

#### Add

```sh
git submodule add https://github.com/J-Siu/binario themes/binario
git submodule add <url> <path>
```

#### First Pull

```sh
git submodule update --init --recursive
```

#### Update

```sh
git submodule update --recursive --remote
```

### Status

```sh
git status
```

### Log

`git log` option|Description
---|---
`--name-only`|Show file in commit, following commit line
`--oneline`|(Compact)Show ref and commit message in one line
`<tag>..HEAD`|Show log since \<tag\>
||(Long)Default format

`git reflog`: Compact mode, one commit per line.
### Reset

```sh
git revert --hard [<commit>]
git revert --soft [<commit>]
```

- `--hard` Resets the index and working tree. Any changes to tracked files in the working tree since \<commit\> are discarded.
- `--soft` Does not touch the index file or the working tree at all (but resets the head to \<commit\>, just like all modes do). This leaves all your changed files "Changes to be committed", as git status would put it.

This is prefer over `revert` when backing out from local commit, before pushing to remote.

### Revert

```sh
git revert <ref#>
git revert b68bc59
```

### Config

#### User

```sh
git config --global user.name "<Full Name>"
git config --global user.email "<email>"
```

#### List

```sh
git config -l
git config --global -l
```

### Tag Date

```sh
git log --tags --simplify-by-decoration --pretty="format:%ai %d" | cat
```

### Fork Merge/Sync with upstream

```sh
git remote add upstream <up stream url>
git fetch upstream
git merge upstream/master
```