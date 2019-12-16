---
type: "blog"
date: 2019-11-19T16:47:26-05:00
author: "John Siu"
title: "How to Find My Public IP"
description: "Find your public ip with Linux command line."
tags: ["cheatsheet"]
draft: false
---
Using Linux command line.
<!--more-->

### IPv4

```sh
curl ifconfig.me
curl ipecho.net/plain
```

### IPv6

```sh
curl icanhazip.com
curl ifconfig.co
dig TXT +short o-o.myaddr.l.google.com @ns1.google.com
```
