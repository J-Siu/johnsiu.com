---
author: "John Siu"
date: 2022-05-10T01:15:54-04:00
description: "A command line tool for crypto function."
tags: ["golang","command-line"]
title: "Go-Crypto Command Line"
type: "blog"
---
A command line tool for crypto function.
<!--more-->
> This tool is not a crypto currency tool.
### Purpose

Provide crypto function for command line scripting, eg. [mygit](https://github.com/J-Siu/mygit). Currently only box seal anonymous is implemented, which is used for calculating github repository secret.

Open an issue here or in [go-helper](https://github.com/J-Siu/go-helper) if you need additional crypto functions.

### Usage

```sh
$ go-crypto box sealanonymous -h
x/crypto box seal anonymous. Output is base64 encoded

Usage:
  go-crypto box sealanonymous [flags]

Flags:
  -h, --help         help for sealanonymous
  -k, --key string   (required) base64 encoded public key
  -m, --msg string   (required) plain text message
```

### Example

```sh
$ go run main.go box sealanonymous -k 'z492di80U5FuJfY8VH2M26Cnzg4UfRRxlqTXMHSWfyY=' -m "This is a test"
F4XDi4ZPCwRAizgVry3CbBLaX9GDbwGXkf/SRoLCEX2veSZKdHtIFMSDGPwIB/h/V0Vodu4k1h0FSMdksD0=
```

### Repository

- [go-crypto](https://github.com/J-Siu/go-crypto)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 1.0.0
  - Implement box seal anonymous
- v1.0.1
  - Fix goreleaser

### License

The MIT License

Copyright (c) 2022 John Siu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.