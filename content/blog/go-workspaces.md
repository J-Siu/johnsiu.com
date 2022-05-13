---
author: "John Siu"
date: 2022-05-11T21:21:38-04:00
description: "How to use golang workspaces go.work? And What problem does it solve?"
tags: ["golang"]
title: "Go Workspaces"
type: "blog"
---
How to use golang workspaces(go.work)? And What problem does it solve?
<!--more-->

> Need Go > 1.18

### The Issue

Take my own projects as example:

- [go-mygit](/blog/go-mygit/)
- [go-gitapi](/blog/go-gitapi/)
- [go-helper](/blog/go-helper/)

`go-mygit` is a command line tool using `go-gitapi` and `go-helper` as libraries. When I was developing `go-mygit`, I was constantly changing `go-gitapi` and expanding `go-helper`. In the past, I had two choices:

1. Move `go-gitapi` and `go-helper` into `go-mygit` and split them later.
2. Keep updating them separately, keep doing `git` `tag`, `push` and `go get -u` for every single change.

Both methods work, but very cumbersome.

### How To

This new Go feature changed all of that. With workspaces setup, `go build` and other Go tools will use `go-gitapi` and `go-helper` source tree when dealing with `go-mygit`.

With directory layout:

```sh
.
├── go-gitapi/
├── go-helper/
└── go-mygit/
```

Do following:

```sh
cd go-mygit
go work init
```

This creates a new fille, `go.work`. To add current directory:

```sh
go work use .
```

Then add library:
```sh
go work use ../go-gitapi
go work use ../go-helper
```

From now on, doing `go build` inside `go-mygit` folder will compile with code from `../go-gitapi` and `../go-helper`, not package cache.

We no longer have to tag/push libraries before testing with the main project. And more importantly, VS Code Go extension is doing syntax checking accordingly!!!