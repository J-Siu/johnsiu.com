---
author: "John Siu"
date: 2025-07-28T03:55:15-04:00
description: ""
tags: ["linux"]
title: "Avahi and Multiple Alias"
type: "blog"
---
Configure Avahi to broadcast multiple names.
<!--more-->

Ref:
- [Configure Zeroconf to broadcast multiple names - answer](https://serverfault.com/a/986437/138643)
- [Avahi alias systemd service](https://gist.github.com/tomslominski/9d507acd4036952d65b2364d3750fb36)

### Configuration Files

Create the two files below.

`/etc/systemd/system/avahi-alias@.service`:

```sh
[Unit]
Description=Publish %I as alias for %H via mdns

[Service]
Type=simple
ExecStart=/bin/bash -c "/etc/systemd/system/avahi-alias.sh %I"
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/avahi-alias.sh`:

```sh
#!/usr/bin/bash

mdns_domain="local"
IP=$(avahi-resolve -4 -n $(hostname -s).$(mdns_domain) | cut -f2)
ALIAS=$1

if [ $IP != "127.0.0.1" ]
then
	echo "Aliasing $IP as $ALIAS."
	avahi-publish -a -R $ALIAS $IP
else
	echo "Exiting, local address is $IP."
	exit 1
fi
```

### Enable Alias

```sh
systemctl enable --now avahi-alias@<alias>.local.service
```
