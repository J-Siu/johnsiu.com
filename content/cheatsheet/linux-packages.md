---
type: "cheatsheet"
date: 2019-07-30T12:52:01-04:00
author: "John Siu"
title: "Linux Packages"
description: "Linux packages I used."
tags: ["alpine","linux"]
draft: false
---
Linux packages I used.
<!--more-->

### Alpine

#### System

```sh
apk add \
  dropbear \        # ssh daemon.
  openssh-client \  # scp support. dropbear-scp only work for incoming.
  avahi \           # mDNS support.
  dbus \            # avahi dependency.
  sudo              # sudoer.
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
  mpeg123 \       # Audio player.
  mpd \           # Music Player Daemon.
  mpc             # mpd cli client.
```

### Development

- [gogs](https://gogs.io) - WebGui Git repository.

```sh
apk add \
  git \ # Git
  zsh   # zsh shell
```