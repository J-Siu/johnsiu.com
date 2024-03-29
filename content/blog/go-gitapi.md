---
author: "John Siu"
date: 2022-05-10T01:16:14-04:00
description: "go-gitapi - A github/gitea api library in golang"
tags: ["golang","lib","git","api","github","gitea"]
title: "Go-Gitapi Library"
type: "blog"
---
go-gitapi - A github/gitea api library in golang
<!--more-->
### Features

- API action
  - [x] Do
  - [x] Get
  - [x] Del
  - [x] Patch
  - [x] Post
  - [x] Put

#### gitApi.go
- type GitApiReq struct
- type GitApiRes struct
- type GitApi struct
- func GitApiNew(
- func (self *GitApi) EndpointUserRepos() *GitApi
- func (self *GitApi) EndpointRepos() *GitApi
- func (self *GitApi) EndpointReposTopics() *GitApi
- func (self *GitApi) EndpointReposSecrets() *GitApi
- func (self *GitApi) EndpointReposSecretsPubkey() *GitApi
- func (self *GitApi) HeaderGithub() *GitApi
- func (self *GitApi) HeaderInit() *GitApi
- func (self *GitApi) Do() *GitApi
- func (self *GitApi) Get() *GitApi
- func (self *GitApi) Del() *GitApi
- func (self *GitApi) Patch() *GitApi
- func (self *GitApi) Post() *GitApi
- func (self *GitApi) Put() *GitApi
- func (self *GitApi) ProcessOutput() *GitApi
- func (self *GitApiReq) UrlValInit()
- func (self *GitApiRes) Ok() bool
#### gitApiDataStruct.go
- type RepoEncryptedPair struct
- func (self *RepoEncryptedPair) StringP() *string
- func (self *RepoEncryptedPair) String() string
- type RepoPublicKey struct
- func (self *RepoPublicKey) StringP() *string
- func (self *RepoPublicKey) String() string
- type RepoPrivate struct
- func (self *RepoPrivate) StringP() *string
- func (self *RepoPrivate) String() string
- type RepoVisibility struct
- func (self *RepoVisibility) StringP() *string
- func (self *RepoVisibility) String() string
- type RepoDescription struct
- func (self *RepoDescription) StringP() *string
- func (self *RepoDescription) String() string
- type RepoTopics struct
- func (self *RepoTopics) StringP() *string
- func (self *RepoTopics) String() string
- type RepoInfo struct
- func (self *RepoInfo) StringP() *string
- func (self *RepoInfo) String() string
- type RepoInfoList []RepoInfo
- func (self *RepoInfoList) StringP() *string
- func (self *RepoInfoList) String() string
- type NilType struct
- func (self *NilType) StringP() *string
- func (self *NilType) String() string
- func Nil() *NilType
- type GitApiInfo interface

### Pro

- Easy to extend
- Small size

### Doc

- https://pkg.go.dev/github.com/J-Siu/go-gitapi

### Dependency

- [go-helper](https://github.com/J-Siu/go-helper)

### Supported git repository services
- gitea
- github
- gogs

### Usage Example

Following is code to create a new repository:

1. Prepare a GitApi data structure
    ```go
    var info gitapi.RepoInfo
    info.Name = "test"
    info.Private = remote.Private
    ```

2. Setup and execute
    ```go
    // Get instance
    gitApi := gitapi.GitApiNew(
      "Test",   // Connection name for debug print out purpose
      "01234567890123456789012345678912", // API token,
      "https://api.github.com", // API entrypoint
      "J-Siu",  // user
      "github", // vendor/brand
      &info)    // data for request
    // Setup endpoint
    gitApi.EndpointRepos()
    // Setup Github header
    gitApi.HeaderGithub()
    // Do post request
    success := gitApi.Post().Res.Ok()
    ```

3. Print out using helper function
    ```go
    helper.ReportStatus(success, gitApi.Name)
    helper.ReportStatus(gitApi.Res.Output, gitApi.Name)
    ```

#### Debug

Enable debug
```go
helper.Debug = true
```

### Used By Project

- [go-mygit](https://github.com/J-Siu/go-mygit)
### Repository

- [go-gitapi](https://github.com/J-Siu/go-gitapi)

### Contributors

- [John, Sing Dao, Siu](https://github.com/J-Siu)

### Change Log

- v1.0.0
  - Feature complete
- v1.0.1
  - Fix data struct *.StringP() output
- v1.1.0
  - Consolidate output processing
- v1.2.0
  - GitApiOut
    - move output from GitApi
    - add Success
    GitApi struct
    - Change Header to non-pointer
    - Use path and url package to handle endpoint and url
    - Add HeaderGithub()
- v1.2.4
  - Update go-helper package for bug fix
- v1.2.5
  - GitApiIn
    - Add UrlVal(url.Values)
- v1.2.6
  - Update go-helper package for bug fix
- v1.3.0
  - All GitApi methods reutrn self pointer
  - Interface GitApiInfo remove type restrictions
  - Member GitApi.In -> GitApi.Req
  - Member GitApi.Out -> GitApi.Res
  - Type GitApiIn -> GitApiReq
  - Type GitApiOut -> GitApiRes
- v1.3.1
  - Improve README.md
- v1.3.2
  - Fix `GitApi.Do()` wiping `GitApi.Req.Data` if `GitApi.Info` is `nil`

### License

The MIT License (MIT)

Copyright © 2022 John, Sing Dao, Siu <john.sd.siu@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
