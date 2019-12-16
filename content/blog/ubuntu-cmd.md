---
type: blog
date: 2019-08-23T00:10:00-04:00
author: "John Siu"
title: "Ubuntu Commands"
description: "Ubuntu commands."
tags: ["ubuntu","cheatsheet"]
aliases:
  - /cheatsheet/ubuntu-commands
draft: false
---
Misc. Ubuntu commands.
<!--more-->
### Remove Pre-installed

> If you don't know what they are ...

```sh
apt purge cloud-* snapd whoopsie* unattended-upgrades ubuntu-advantage-tools
```

> If not using LVM, LXC/LXD

```sh
apt purge lvm2 lxd lxcfs
```

> If completely rely on journald.

```sh
apt purge rsyslog libestr0 libfastjson4
```

### Get Version

```sh
lsb_release -r
```

### Change Timezone

```sh
dpkg-reconfigure tzdata
```

### Check Upstream DNS

> Ubuntu/Systemd use systemd-resolver for dns lookup and /etc/resolve.conf no longer show the actual upstream dns. Use following to check.

```sh
systemd-resolve --status
```