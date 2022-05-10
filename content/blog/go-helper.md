---
author: "John Siu"
date: 2022-05-10T01:16:50-04:00
description: "Simple helper functions for GO program."
tags: ["golang","lib"]
title: "Go-Helper Library"
type: "blog"
---
Simple helper functions for Golang program.
<!--more-->

### Features

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

### Usage

```go
import	"github.com/J-Siu/go-helper"

func main() {
	helper.Debug = true
	helper.DebugLog("debug msg")
}
```

### Test

```sh
go test -v file_test.go file.go
```
```sh
go test -v gitCmd_test.go common.go report.go string.go file.go gitCmd.go myCmd.go
```
```sh
go test -v report_test.go common.go report.go string.go
```

### Used By Project

- [go-gitapi](https://github.com/J-Siu/go-gitapi)
- [go-mygit](https://github.com/J-Siu/go-mygit)

### Repository

- [go-helper](https://github.com/J-Siu/go-helper)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 0.0.1
  - Initial Commit
- 0.9.0
  - Function update
- 0.9.1
  - Fix git command args
- v0.9.1
  - Add prefix v for version number
- v0.9.2
  - Fix MyCmdRunWg() missing wgP.Done()
- v0.9.3
  - ReportTStringP():
    - fix using wrong var when handling *[]byte
    - add []byte case
- v0.9.4
  - Report support SingleLine mode
- v0.9.5
  - Fix ReportT.SpringP() output
- v0.9.6
  - Fix ReportT.SpringP() skip empty output
- v0.9.8
  - Fix ReportT.SpringP() logical bug
  - Add report_test.go
- v0.9.9
  - Add workpath support for gitCmd and myCmd
  - Add GitRoot(), GitRootSubmodule(), GitExecExist(), GitExecPath()
  - Add test
- v1.0.0
  - file.go
    - Add FullPath()
    - All func return *string
  - gitCmd.go
    - GitPush() correct optionP param type
  - myCmd.go
    - MyCmd.Run() improve debug output
    - MyCmdInit() use fullpath for WorkDir
  - report.go
    - ReportT.StringP()
      - Add *[]string case
      - case []string, *[]string
        - fix bug only print last line
        - no longer remove empty line
  - string.go
    - StrArrayPtrRemoveEmpty() return new array
    - StrPToArrayP no longer remove empty line
    - func name StrPToArrayP -> StrPtrToArrayPtr

### License

The MIT License

Copyright (c) 2022 John Siu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.