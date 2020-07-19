---
type: "blog"
date: 2020-07-06T21:49:56-04:00
author: "John Siu"
title: "Shell - Bash"
description: "My bash cheat sheet"
tags: ["bash","cheatsheet"]
draft: false
---
Bash cheat sheet.
<!--more-->

### Current directory

```sh
echo ${PWD##*/}
```

### String Comparison

```sh
if [ "$str" = "string" ]; then ...
```

### bash/zsh Numeric Comparison

```sh
if [[ ${A} = 3 ]]; then echo yes; fi
```

### Echo Multiple Lines

```sh
STR="Line 1
Line2"

# This will output all in one line
echo $STR
Line 1 Line 2

# Use ""
echo "$STR"
Line 1
Line 2
```

### Cut Prefix

Cut shortest match:

```sh
$ a=b/c/d/e
$ echo ${a#*/}
c/d/e
```

Cut longest match:

```sh
$ a=b/c/d/e
$ echo ${a##*/}
e
```

### Cut Suffix

Cut shortest match:

```sh
$ a=b/c/d/e
$ echo ${a%/*}
b/c/d
```

Cut longest match:

```sh
$ a=b/c/d/e
$ echo ${a%%/*}
b
```

### Search/Replace

`${string/<search>/<replace with>}`

```sh
a="This is a test."
b=" is a "
c=" is not a "
d=${a/$b/$c}
echo ${d}
This is not a test.
```

### Substring

`${string:<position>:<length>}`. If no `:<length>`, default till end of string.

```sh
   0123
a="This"
echo ${a:2}
is
```

### Calculation

```sh
a=1
((a=a+1))
echo $a
2
```

### Read Line By Line

```sh
file=test.txt
while IFS= read -r line; do
...
done <${file}
```

- `IFS=` change delimiter to new line (`\n`).
- `IFS` default: `$' \t\n'`