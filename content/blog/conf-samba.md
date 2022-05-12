---
author: "John Siu"
date: 2019-07-30T22:06:28-04:00
description: "Quick samba config to share home directory."
tags: ["samba","cheatsheet"]
title: "Samba Config"
type: blog
aliases:
    - /blog/samba-cfg
---
Quick samba config to share home directory only.
<!--more-->

### smb.config

```ini
[global]
workgroup = MYGROUP
server string = %m
server role = standalone
log file = /usr/local/samba/var/log.%m
max log size = 50
dns proxy = no

# --- Disable printer queue
load printers = no
printing = bsd
printcap name = /dev/null
disable spoolss = yes
# ---

[homes]
comment = Home Directories
browseable = yes
writable = yes
force create mode = 0600
force directory mode = 0700
```

`lpqd` should not start anymore.

### Disable NetBIOS

Comment out `nmbd` related options in `/etc/conf.d/samba` (Alpine Linux):

```sh
# Add "winbindd" to daemon_list if you want start winbind from here as well
#daemon_list="smbd nmbd"
# Use "samba" alone for role based samba4 services (eg: ad-dc).
daemon_list="smbd"

smbd_options="-D"
#nmbd_options="-D"
#winbindd_options=""
#samba_options=""
```