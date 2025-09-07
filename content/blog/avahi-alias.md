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
- [Configure ZeroConf to broadcast multiple names - answer](https://serverfault.com/a/986437/138643)
- [Avahi alias systemd service](https://gist.github.com/tomslominski/9d507acd4036952d65b2364d3750fb36)

### Configuration Files

Create the two files below.

`/etc/systemd/system/avahi-alias4@.service`:

```sh
[Unit]
Description=Publish %I as alias for %H via mdns (IPv4)

[Service]
Type=simple
ExecStart=/bin/bash -c "/etc/systemd/system/avahi-alias.sh 4 %I"
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/avahi-alias6@.service`:

```sh
[Unit]
Description=Publish %I as alias for %H via mdns (IPv6)

[Service]
Type=simple
ExecStart=/bin/bash -c "/etc/systemd/system/avahi-alias.sh 6 %I"
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/avahi-alias.sh`:

```sh
#!/usr/bin/bash

ALIAS=$2
IP_VER=$1

MDNS_DOMAIN="vms.local"
HOSTNAME=$(hostname -s).$MDNS_DOMAIN

avahi_alias() {
  IP=$(avahi-resolve -$IP_VER -n $HOSTNAME | cut -f2)
  echo "IPv$IP_VER=$IP"
  if [ $IP != "127.0.0.1" ] && [ $IP != "::1" ]; then
    echo "Aliasing $ALIAS -> $IP."
    avahi-publish -a -R $ALIAS.$MDNS_DOMAIN $IP
  else
    echo "Exiting, local address is $IP."
    exit 1
  fi
}

avahi_alias
```

### Enable Alias

Enable Alias for IPv4
```sh
systemctl enable --now avahi-alias4@<alias>.service
```

Enable Alias for IPv6
```sh
systemctl enable --now avahi-alias6@<alias>.service
```
