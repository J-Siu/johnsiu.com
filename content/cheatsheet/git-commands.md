---
type: "Cheat Sheet"
date: 2019-07-30T18:05:58-04:00
author: "John Siu"
title: "Git Commands"
description: "Git commands cheat sheet"
tags: ["git","cheat sheet"]
draft: false
---
Some git commands.
<!--more-->
#### Push master

```sh
git push -u origin master
git push -u <name> master
```

#### Remote show

```sh
git remote -v
```

#### Remote remote

```sh
git remote remove origin
git remote remove <name>
```

#### Add/stage

```sh
git add . # Add everything in current dir tree. This include sub-dir recursively.
git add <file/dir>...
```

#### Remove from stage

```sh
git rm <file/dir>...
```

#### Commit staged changes

```sh
git commit -m '<comment>'
git commit -a # Commit all staged files.
git commit <file/dir> # Commit files directly even not staged.
```

#### Tag

```sh
git tag # List tags
git tag <version> # Light weight tag
git tag -a v0.1 -m "Version 0.1"
git tag -a <version> -m '<comment>'
git show <version> # Show tagged commit
```

#### Push tag

```sh
git push --tags
```

#### Submodule add

```sh
submodule add https://github.com/J-Siu/binario themes/binario
submodule add <url> <path>
```

#### Submodule update

```sh
git submodule update --recursive --remote
```

#### Status

```sh
git status
```

#### Log show

```sh
git log
git reflog
```

#### Revert

```sh
git revert b68bc59
git revert <ref#>
```