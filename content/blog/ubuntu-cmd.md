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

### systemd-resolver

Ubuntu/Systemd use systemd-resolver for dns lookup and /etc/resolve.conf no longer show the actual upstream dns. Use following to check and change.

#### Show DNS Settings

```sh
resolvectl
```

#### Change DNS

```sh
resolvectl dns <interface> <dns1> <dns2> ...
resolvectl dns enp0s2 8.8.8.8 8.8.4.4 1.1.1.1
```

#### Change Search Domain

```sh
resolvectl domain <interface> <domain>
resolvectl domain enp0s2 johnsiu.com
```

### Disable CPU mitigations

> Do this at your own risk.

`/etc/default/grub`

```ini
GRUB_CMDLINE_LINUX_DEFAULT="noibrs noibpb nopti nospectre_v2 nospectre_v1 l1tf=off nospec_store_bypass_disable no_stf_barrier mds=off mitigations=off"
```

Update GRUB

```sh
update-grub
grub-install <boot disk>
grub-install /dev/sda
```

### Update Initramfs

This is needed if module used during boot is changed.

```sh
update-initramfs -u
```