---
author: "John Siu"
date: 2019-11-19T16:47:26-05:00
description: "Find my public ip with command line."
tags: ["cheatsheet","command-line","myip","ip","how-to"]
title: "My IP From Command Line"
type: "blog"
---
Using Linux command line.
<!--more-->

### IPv4

```sh
curl https://myip4.johnsiu.com/
curl https://myip4.jsiu.dev/
```

Alias
```sh
alias my_ip4="echo \$(curl -s https://myip4.jsiu.dev)"
```

### IPv6

```sh
curl https://myip6.johnsiu.com/
curl https://myip6.jsiu.dev/
```

Alias
```sh
alias my_ip6="echo \$(curl -s https://myip6.jsiu.dev)"
```

### Web Base

- [johnsiu.com/home/myip](/home/myip/)
- [myip.jsiu.dev](/home/myip/)