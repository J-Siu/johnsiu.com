---
author: "John Siu"
date: 2026-07-03T21:25:53-04:00
description: ""
tags: ["swift","cheatsheet"]
title: "Swift Cheatsheet"
type: "blog"
---

Collection of Swift code snippets.
<!--more-->

#### Int to Hex String

```swift
var ui64: UInt64 = 10
var str: String

str = String(UInt(ui64), radix: 16, uppercase: true)
str = String(format: "%016lX", ui64)
str = String(ui64, radix: 16, uppercase: true)
```
