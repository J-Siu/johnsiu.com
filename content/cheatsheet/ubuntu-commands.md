---
type: "Cheat Sheet"
date: 2019-08-23T00:10:00-04:00
author: "John Siu"
title: "Ubuntu Commands"
description: "Ubuntu commands."
tags: ["ubuntu"]
draft: false
---
Misc. Ubuntu commands.
<!--more-->
#### Remove Pre-installed

> If you don't know what they are ...

```sh
apt remove cloud-* snapd whiptail unattended-upgrades ubuntu-advantage-tools
```

#### Get Version

```sh
lsb_release -r
```

#### Change Timezone

```sh
dpkg-reconfigure tzdata
```