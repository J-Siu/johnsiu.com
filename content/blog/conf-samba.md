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

#### [global]
```ini
[global]
workgroup = MYGROUP
server string = %m
server role = standalone
max log size = 50
dns proxy = no
```

Add following line to `[global]` section if samba printer sharing is not required.

```ini
disable spoolss = yes
```

Add following lines to debug connection issue.

```ini
log file = /var/log/samba/log.%m
log level = 9
```

#### [homes]

Add a `[homes]` section if sharing home directories of Linux users.

Change `path` if `home` directory is not at standard location (eg. `/data/home`).

`browerable` should always be `no`, else the directory `homes` will show up as network share, which is extremely annoying and confusing.

```ini
[homes]
comment = Home Directories
browseable = no
writable = yes
path = /home/%S
valid users = %S
force create mode = 0600
force directory mode = 0700
```

### User Setup

> User cannot connect without this step.

Users connecting to samba share, including `homes` share, must be setup with `smbpasswd`.

```sh
smbpasswd -a <username>
```

### Disable NetBIOS (Alpine Linux)

Comment out `nmbd` related options in `/etc/conf.d/samba`

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