---
author: "John Siu"
date: 2022-05-13T15:12:40-04:00
description: "How to create Golang Module/package v2 and after? With Example"
tags: ["golang"]
title: "Go Module/Package v2 and after"
type: "blog"
---
Create Golang Module/package v2 and after with example.
<!--more-->
### Sample Package

We will start with example project [go-mod-v2@v0.0.0](https://github.com/J-Siu/go-mod-v2/tree/v0.0.0) hosted on Github.

```sh
go-mod-v2
├── LICENSE
├── README.md
├── go.mod
├── lib
│   └── output.go
└── main.go
```

`go.mod`:
```go
module github.com/J-Siu/go-mod-v2

go 1.18
```

`main.go`:
```go
package main

import "github.com/J-Siu/go-mod-v2/lib"

func main() {
	lib.Output()
}
```

`output.go`:
```go
package lib

import "fmt"

func Output() {
	fmt.Println("This is go-mod-v2: v0.0.0")
}
```

### Updating Version for Go Package

#### Before v2.0.0

Upgrade/tagging the package from v0.0.0 to v1.0.0:
- no change is required for `main.go` and `go,mod`
- `lib/output.go` was updated for output only.

This will hold true for all tagging before v2.x.x.

#### v2.0.0 and After

Releasing Go package v2.0.0 and above, extra steps are required for each major releases.

Steps:

1. Add `/v<major version>` to the end of module line inside `go.mod`.

    In `go.mod`:
    ```go
    module github.com/J-Siu/go-mod-v2/v2
    ```
    For v2.x.x, `v2` is added.

2. If package is importing it own subfolder, those `import` lines need to be update accordingly.

    In `main.go`:
    ```go
    import "github.com/J-Siu/go-mod-v2/v2/lib"
    ```

These steps need to be repeated every time the major version increases.

The example repository has up to [v3.0.0](https://github.com/J-Siu/go-mod-v2/tree/v3.0.0).

### Using V2 and Above

Similar rules apply when importing modules/libraries that are version two or above. For example, to use version 2 of `lib` from the sample package, we have to add `v2` in `go get`:

```sh
go get github.com/J-Siu/go-mod-v2/v2
```

And the import line will be same as above:

```go
import "github.com/J-Siu/go-mod-v2/v2/lib"
```
