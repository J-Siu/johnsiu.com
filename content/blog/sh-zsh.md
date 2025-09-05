---
author: "John Siu"
date: 2019-08-01T20:06:21-04:00
description: "Zsh cheat sheet that I use myself."
tags: ["zsh","cheatsheet"]
title: "Shell - Zsh"
type: blog
---
Zsh cheat sheet.
<!--more-->

### Reload Config

```sh
exec zsh
```

`oh-my-zsh` alias

```sh
omz reload
```

### Split String ${=STR}

Zsh do not auto split string into words like bash.

```sh
STR="line 1
line2"

# The :: is printed once only.
for i in ${STR}; do echo :: ${i}; done
:: line 1
line2

# Add = in front of variable to split it like bash.
for i in ${=STR}; do echo :: ${i}; done
:: line
:: 1
:: line2
```

### Compare [[ (statement) ]]

- [[ ${a} = ${b} ]].
- Space after [[ and before ]].
- Space on both sides of operator =, <, >.

```sh
a=1; b=2

if [[${a} = ${b}]] ... # zsh: no matches found: [[1=2]]
if [[${a}=${b}]] ...   # zsh: bad pattern: [[1
if [[ ${a}=${b} ]] ... # This will always be true. Logical error.

if [[ ${a} = ${b} ]]   # Correct
then
  ...
fi
```

### Evaluate / Math (( ))

```sh
A=2; C=1
((C+=1)) # C = 2
((A=A+C)) # A = 4
echo A:${A} C:${C}
```

### For loop number

- {${i}..${j}}
- NO SPACE after { and before }

```sh
for i in {1..10}; do ...; done
for i in {1..${VAR}}; do ...; done
```

### Associative Array

- typeset -A VAR_NAME
- Array index can be number or string
- Variable can be used in index and will be evaluated.
- Careful with quote inside index.
  - MY_ARRAY[1,abc] != MY_ARRAY[1,"abc"] != MY_ARRAY[1,'abc']

```sh
a=10
b="abc" # This is ok, not inside index.

typeset -A MY_ARRAY

MY_ARRAY[1]=1
MY_ARRAY[${a}]=1          # Index is 10, MY_ARRAY[10]=1
MY_ARRAY[2,${b}]="Hello" # Index is [2,abc], MY_ARRAY[2,abc]="Hello!"
```
