---
author: "John Siu"
date: 2022-05-13T00:00:00-04:00
description: "A simple script to generate markdown list from Go source code"
tags: ["golang"]
title: "Go function list to Markdown"
type: "blog"
---
A simple script to generate markdown list from Go source code.
<!--more-->

### GoDoc and Go Doc

Golang has `godoc` and `go doc` that can generate documentation from comments. `go doc` can generate documentation in plain text by default, while `godoc` can generate doc website. The [pkg.go.dev](https://pkg.go.dev/) is base on `godoc` function.

For open source projects, we can rely on `pkg.go.dev` to do the documentation and just supply a link in our README.md file. But what if we want to generate some "light" info, something like a function list, to put into README.md?

### Function List

`go doc` can generate a function list as follow:

```txt
func StrArrayPtrPrintln(saP *[]string)
func StrArrayPtrPrintlnSp(saP *[]string) *string
func StrArrayPtrRemoveEmpty(saP *[]string) *[]string
func StrPtrToArrayPtr(sP *string) *[]string
type MyCmd struct{ ... }
    func GitInit(workpathP *string) *MyCmd
    func GitPush(workpathP *string, optionsP *[]string) *MyCmd
    func GitRemoteAdd(workpathP *string, name string, git string) *MyCmd
    func GitRemoteRemove(workpathP *string, name string) *MyCmd
```

But missing structure methods. We can do it one by one: `go doc MyCmd`:

```txt
package helper // import "."

type MyCmd struct {
        ArgsP   *[]string    `json:"ArgsP"`  // Command args
        CmdName string       `json:"Name"`   // Command name
        WorkDir string       `json:"Dir"`    // Command working dir
        Ran     bool         `json:"Ran"`    // Out: Set to true by Run()
        CmdLn   string       `json:"CmdLn"`  // Out: Command Line
        Err     error        `json:"Err"`    // Out: run error
        Stdout  bytes.Buffer `json:"Stdout"` // Out: Stdout
        Stderr  bytes.Buffer `json:"Stderr"` // Out: Stderr
}
    A exec.Cmd wrapper

func GitInit(workpathP *string) *MyCmd
func GitPush(workpathP *string, optionsP *[]string) *MyCmd
func GitRemoteAdd(workpathP *string, name string, git string) *MyCmd
func GitRemoteRemove(workpathP *string, name string) *MyCmd
func MyCmdInit(name string, argsP *[]string, workpathP *string) *MyCmd
func MyCmdRun(cmdName string, argsP *[]string, workpathP *string) *MyCmd
func MyCmdRunWg(cmdName string, argsP *[]string, workpathP *string, title *string, ...) *MyCmd
func (self *MyCmd) ExitCode() int
func (self *MyCmd) Run() error
```

Or `go doc -all` to get everything in one shot:

```txt
type ReportT struct {
        Data       any    `json:"Data"`       // Data to be printed
        Title      string `json:"Title"`      // Title of print out
        ModeStatus bool   `json:"ModeStatus"` // bool to "OK/Failed"
        SkipEmpty  bool   `json:"SkipEmpty"`  // Return empty string if Data is empty
        SingleLine bool   `json:"SingleLine"` // No need line after title
}

func ReportNew(data any, title string, skipEmpty bool, singleLine bool) *ReportT
    Setup ReportT with data(optional/nil), title(optional/""), <skipEmpty>,
    <singleLine>. Return the ReportT pointer.

func (self *ReportT) String() string
    Print self.Data, self.Title to string If self.SkipEmpty is true, will not
    print self.Title if self.Data is empty. If self.SingleLine is true,
    self.Data will not start on new line.
```

However, this is not what we are looking for and contain too much info. Moreover, we need to manually add markdown format in readme.

How can we get just a line by line list of function, structure, and global var for the readme file, with markdown formate?

### Bash Script

Thanks to Go standardize format, it is actually easy to grep all those lines from source file using `grep`. With some tinkering, I came up with the following script:

`go-func2md.sh`
```sh
#!bash

TITLE_PREFIX="####"

for FILENAME in ${@}; do
	echo ${TITLE_PREFIX} ${FILENAME}
	FUNC=$(grep -e ^func -e ^var -e ^type ${FILENAME})

	while IFS= read -r LINE; do
		echo "-" ${LINE%% \{}
	done <<<${FUNC}

done
```

Running that against [report.go](https://github.com/J-Siu/go-helper/blob/master/report.go),
`go-func2md.sh report.go` give following:

```txt
#### report.go
- type ReportT struct
- func Report(data any, title string, skipEmpty bool, singleLine bool)
- func ReportDebug(data any, title string, skipEmpty bool, singleLine bool)
- func ReportSp(data any, title string, skipEmpty bool, singleLine bool) *string
- func ReportSpDebug(data any, title string, skipEmpty bool, singleLine bool) *string
- func ReportStatus(data bool, title string, singleLine bool)
- func ReportStatusSp(data bool, title string, singleLine bool) *string
- func ReportNew(data any, title string, skipEmpty bool, singleLine bool) *ReportT
- func (self *ReportT) String() string
- func (self *ReportT) StringDebug() string
- func (self *ReportT) StringP() *string
- func (self *ReportT) StringPDebug() *string
```

Above can be copy and paste directly into readme file.

Mission accomplished!!