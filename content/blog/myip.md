---
author: "John Siu"
date: 2019-11-19T16:47:26-05:00
description: "Find public ip with command line."
tags: ["cheatsheet","command-line","myip","ip","how-to"]
title: "How To Find My Public IP From Command Line"
type: "blog"
---
Using Linux command line.
<!--more-->

### IPv4

```sh
curl https://myip4.johnsiu.com/
curl https://myip4.jsiu.dev/

curl ifconfig.me
curl ipecho.net/plain
```

### IPv6

```sh
curl https://myip6.johnsiu.com/
curl https://myip6.jsiu.dev/

curl icanhazip.com
curl ifconfig.co
dig TXT +short o-o.myaddr.l.google.com @ns1.google.com
```

### Web Base

- [https://johnsiu.com/home/myip/](/home/myip/)
- [https://myip.jsiu.dev/](/home/myip/)