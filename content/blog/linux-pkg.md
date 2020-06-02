---
type: blog
date: 2019-07-30T12:52:01-04:00
author: "John Siu"
title: "Linux Packages"
description: "Linux packages I used."
tags: ["alpine","cheatsheet"]
draft: false
aliases:
  - /cheatsheet/linux-packages
---
Linux packages I used.
<!--more-->

### Alpine

#### System

```sh
apk add \
  dropbear \        # Pick this over openssh during system install.
  openssh-client \  # ssh, scp, sftp, ssh-keygen, etc.
  avahi \           # mDNS support.
  avahi-tools \     # avahi-browse, etc.
  dbus \            # avahi dependency.
  sudo \
  rsync \
  e2fsprogs-extra \ # ext4 fs tools.
  zsh               # Zsh shell.
```

#### File Sharing

```sh
apk add \
  samba-server    # Samba Server.
```

#### Audio

```sh
apk add \
  alsa-utils \    # Linux sound support.
  ffmpeg \        # Audio codec support.
  mpg123 \        # Audio player.
  mpd \           # Music Player Daemon.
  mpc             # mpd cli client.
```

### Network Tools

- [avahi-alias](https://github.com/airtonix/avahi-aliases) - Allow multiple avahi cname aliases.

### Development

- [gogs](https://gogs.io) - Web gui git repository.

```sh
apk add \
  git \        # Git.
  bash \       # Require on gogs server.
  build-base   # gcc, g++, libc-dev, etc. System compiler tool chain.
```

### Multi-ISO USB Boot

- [ventoy](https://github.com/ventoy/Ventoy) - Open source tool to create bootable USB drive for ISO files.