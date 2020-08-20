---
type: "blog"
date: 2020-06-03T12:03:34-04:00
author: "John Siu"
title: "Text File Encode/Charset Conversion"
description: "Linux text file encoding / charset conversion."
tags: ["linux","iconv","uchardet","command-line"]
---
From time to time we get files with garbage characters.
<!--more-->

### Garbage Text

Take following example:

```sh
$cat test.txt
���ؐ��Γy�����p���@�␼�k
```

### iconv

There is tool call `iconv` to fix that:

```sh
$ iconv --help                                                                                                                                                          64 ↵
Usage: iconv [OPTION...] [FILE...]
Convert encoding of given files from one encoding to another.

 Input/Output format specification:
  -f, --from-code=NAME       encoding of original text
  -t, --to-code=NAME         encoding for output

 Information:
  -l, --list                 list all known coded character sets

 Output control:
  -c                         omit invalid characters from output
  -o, --output=FILE          output file
  -s, --silent               suppress warnings
      --verbose              print progress information

  -?, --help                 Give this help list
      --usage                Give a short usage message
  -V, --version              Print program version

Mandatory or optional arguments to long options are also mandatory or optional
for any corresponding short options.

For bug reporting instructions, please see:
<https://bugs.launchpad.net/ubuntu/+source/glibc/+bugs>.
```

Minimum we have to supply `-f, --from-code=NAME` and `-t, --to-code=NAME`. Obvious choice for `-t` is `UTF8`. But what about `-f`?

### uchardet

`uchardet` is "Universal Charset Detector".

```sh
uchardet <file.txt>
```

Using it on example above:

```sh
$ uchardet test.txt
SHIFT_JIS
```

This tell us `test.txt` content is using `SHIFT_JIS`, a common encoding for Japanese text files and websites.

### Combine

Putting everything together:

```sh
$ uchardet test.txt
SHIFT_JIS
$ iconv -f SHIFT_JIS -t UTF8 test.txt
金木水火土中日英美法俄西北
```

We can put above in a script:

`iconv_cat`:

```sh
#!/bin/sh
iconv -f $(uchardet $1) -t UTF8 $1
```

Example:

```sh
iconv_cat test.txt
金木水火土中日英美法俄西北
```