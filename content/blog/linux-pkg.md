---
author: "John Siu"
date: 2019-07-30T12:52:01-04:00
description: "Linux packages that I use."
tags: ["linux","alpine-linux","cheatsheet"]
title: "Linux Packages"
type: blog
---
Linux packages I use.
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

- [avahi-alias](//github.com/airtonix/avahi-aliases) - Allow multiple avahi cname aliases.

### Development

- [gogs](//gogs.io) - Web GUI git repository.

```sh
apk add \
  git \        # Git.
  bash \       # Require on gogs server.
  build-base   # gcc, g++, libc-dev, etc. System compiler tool chain.
```

### Multi-ISO USB Boot

- [ventoy](//github.com/ventoy/Ventoy) - Open source tool to create bootable USB drive for ISO files.