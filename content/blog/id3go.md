---
type: "blog"
date: 2019-09-14
author: "John Siu"
title: "Id3go - ID3v2 Command Line Editor"
description: "id3go provide easy viewing and updating of media file tags from command line."
tags: ["id3v2","cli","lib"]
---
Provide easy viewing and updating of media file tags from command line.
<!--more-->

### Features

- Minimalistic output for easy batch processing
- Support file list, wildcard filename(shell globing)
- Support unicode through TagLib
- Display and update following tags
  - Album
  - Artist
  - Comments
  - Title
  - Track
  - Year

### Dependencies

#### Alpine

```sh
apk add taglib-dev libc-dev
```

#### MacOS

```sh
brew install taglib
```

#### Ubuntu

```sh
apt-get install libtagc0-dev
```

### Install

```sh
go get github.com/J-Siu/id3go
```

### Usage

#### Get

Display tags of files.

```sh
id3go get <files>
```

Examples:

```sh
id3go get media.mp3
id3go get *.mp3
```

#### Set

Set tags of files.

```sh
id3go set [flags] <files>
```

Flags:

short|long|usage
---|---|---
-S|--Save|save to file. Without this flag, `set` will not writing to files (dry run).
-A|--album string|set album
-a|--artist string|set artist
-c|--comment string|set comments
-h|--help|help for set
-t|--title string|set title
-T|--track string|set track
-y|--year string|set year

Examples:

```sh
# Set artist="me", title="A song title", in dry run mode (default)
id3go set -a me -t "A song title" song.mp3

# Set artist="me", title="A song title", and saving (-S) to file
id3go set -a me -t "A song title" -S song.mp3

# Set album="My Record" to all mp3 in current dir, dry run only
id3go set --album "My Record" *.mp3
```

### Repository

- [id3go](https://github.com/J-Siu/id3go)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Changelog

- 1.0
  - Initial release

### License

The MIT License

Copyright (c) 2020 John Siu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.