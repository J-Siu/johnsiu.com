---
type: blog
date: 2019-07-30T18:05:58-04:00
author: "John Siu"
title: "Git Commands"
description: "Git commands cheat sheet"
tags: ["git","cheatsheet"]
aliases:
  - /cheatsheet/git-commands
draft: false
---
Some git commands.
<!--more-->
#### Push Master

```sh
git push -u origin master
git push -u <name> master
```

#### Remote Show

```sh
git remote -v
```

#### Remote Remove

```sh
git remote remove origin
git remote remove <name>
```

#### Add/Stage

```sh
git add . # Add everything in current dir tree. This include sub-dir recursively.
git add <file/dir>...
```

#### Remove From Stage

```sh
git rm <file/dir>...
```

#### Commit Staged Changes

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

#### Submodule Add

```sh
submodule add https://github.com/J-Siu/binario themes/binario
submodule add <url> <path>
```

#### Submodule Update

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

#### Config User

```sh
git config --global user.name "<Full Name>"
git config --global user.email "<email>"
```

#### Config List

```sh
git config -l
git config --global -l
```

#### Tag Date

```sh
git log --tags --simplify-by-decoration --pretty="format:%ai %d" | cat
```
