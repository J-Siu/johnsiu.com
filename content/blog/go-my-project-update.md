---
author: "John Siu"
date: 2022-05-10T02:06:53-04:00
description: "Golang Project Update"
tags: ["golang"]
title: "My Golang Project Update"
type: "blog"
---
This is a recap of my new and updated golang projects
<!--more-->

### Go-MyGit

This is a replacement for my [mygit](/blog/mygit), which I wanted to do it for a long time. Though bash is more than capable for the job, using golang made the process 10x more enjoyable. Using `cobra` and 2 of my own libraries allow a very structure code and command line layout.

Right now it support the following features:

- Configuration File
  - [x] remotes
  - [x] groups
  - [x] secrets
- Selector for git servers
  - [x] -g/--group
  - [x] -r/--remote
- Base(git) Commands
  - [x] init
  - [x] push
  - [x] remote
    - [x] add
    - [x] list
    - [x] remove
- repository(api)
  - [x] list all repo on server
  - [x] create repo on server
  - [x] get/set
    - [x] description
    - [x] private
    - [x] public key(get only)
    - [x] secret
    - [x] topic
    - [x] visibility
  - [x] delete
    - [x] repository
    - [x] secret

All repo and base commands support processing multiple repos/dirs, with the exception of `description` and `topic`.

A minor drawback is the binary is 11M vs 15k for [mygit](/blog/mygit). :face_palm:

Github: https://github.com/J-Siu/go-mygit

Releases: https://github.com/J-Siu/go-mygit/releases

### Go-Crypto

This is a baby project to do NACL box seal anonymous from command line.

I created this for my final version of bash `mygit` to set github action secret.

Github: https://github.com/J-Siu/go-crypto

Releases: https://github.com/J-Siu/go-crypto/releases

### Go-GitApi

This is the actual api library of [go-mygit](#go-mygit). It was a fun project to do and the final product support `middleware` behavior, which bring back memory from javascript.

Example:
```go
apiP := gitapi.GitApiNew(... snip ...)
// Set Github header
apiP.HeaderGithub()
// Do POST
apiP.Post()
// Check status
var success bool = apiP.Res.Ok()

helper.ReportStatus(success, apiP.Repo + "(" + apiP.Name + ")", true)
```
Can be written as follow:
```go
apiP := gitapi.GitApiNew(... snip ...).HeaderGithub().Post().Res.Ok()

helper.ReportStatus(success, apiP.Repo + "(" + apiP.Name + ")", true)
```

Of course this is not good coding style, especially golang doesn't support the dot notation like javascript does. Following is how javascript format will look like:

```js
var success = gitapi
  .GitApiNew(... snip ...)
  .HeaderGithub()
  .Post()
  .Res.Ok()

helper.ReportStatus(success, apiP.Repo + "(" + apiP.Name + ")", true)
```

Github: https://github.com/J-Siu/go-gitapi

### Go-Helper

This package expand a lot due to `go-gitapi` and `go-mygit`. It grow from a single file for [go-png2ico](/blog/go-png2ico) to 8 like following:

File|Description
---|---
common.go|Debug flag
crypto.go|Crypto function
debug.go|Debug functions
file.go|File/directory functions
gitCmd.go|Git functions
myCmd.go|exec.Command shell wrapper
report.go|report/log functions auto detect and apply json marshal indent
string.go|string/array functions

It really save me tones of time, especially `report.go`, when dealing with output in `go-mygit`.

Github: https://github.com/J-Siu/go-helper