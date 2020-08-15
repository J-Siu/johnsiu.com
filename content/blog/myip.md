---
type: "blog"
date: 2019-11-19T16:47:26-05:00
author: "John Siu"
title: "How to Find My Public IP"
description: "Find your public ip with Linux command line."
tags: ["cheatsheet","command-line","myip"]
---
Using Linux command line.
<!--more-->

### IPv4

```sh
curl https://myip4.johnsiu.com/
curl https://myip4.jsiu.dev/
curl -4 https://myip.jsiu.dev/

curl ifconfig.me
curl ipecho.net/plain
```

### IPv6

```sh
curl https://myip6.johnsiu.com/
curl https://myip6.jsiu.dev/
curl -6 https://myip.jsiu.dev/

curl icanhazip.com
curl ifconfig.co
dig TXT +short o-o.myaddr.l.google.com @ns1.google.com
```
