---
author: "John Siu"
date: 2020-08-22T01:10:16-04:00
description: "Some handy regex."
tags: ["cheatsheet","regex"]
title: "Regex Cheat Sheet"
type: "blog"
---
Some regex I used.
<!--more-->

### IPv4

Match IPv4 in digit:

`\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`

Match IPv4 in alphanumeric:

`\w{1,3}\.\w{1,3}\.\w{1,3}\.\w{1,3}`

### URL

With http/https

`https?://[^\[\]()\s]*`

Optional http/https

`(https?:)?//[^\[\]()\s]*`

Internal link

`/[^/][^\[\]()\s]*`

### Markdown link not close with /

Match `](/`...`)`, while `...` don'e contain `)#` and link not closed with `/`.

`](/blog/test)` : Not match

`](/blog/test/)` : Match

`\]\(/[^/][^)#]*[^/]\)`
