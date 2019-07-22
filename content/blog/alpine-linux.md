---
type: "blog"
date: 2019-07-21T16:47:21-04:00
author: "John Siu"
title: "Alpine Linux"
description: "Random notes from a long time Ubuntu / Red Hat user whose Alpine installation count is going up."
tags: ["Alpine","Linux"]
draft: false
---
Random notes from a long time Ubuntu / Red Hat user whose Alpine installation count is going up.
<!--more-->

[Alpine Linux](https://alpinelinux.org/about/) initial released in 2005. From [Wikipedia page](https://en.wikipedia.org/wiki/Alpine_Linux):

> Alpine Linux is a Linux distribution based on musl and BusyBox, designed for security, simplicity, and resource efficiency. It uses a hardened kernel and compiles all user space binaries as position-independent executables with stack-smashing protection.
>
> Because of its small size, it's heavily used in containers providing quick boot up times.

As one of the most favorite base image of docker due to its small size, it is also a capable desktop and server OS. However due to its use of `musl` instead of `glibc`, there are some difference with other Linux distributions like Ubuntu, Debian or Red Hat.

## Experience as a Ubuntu User

### Installation

Unlike Ubuntu, Debian and many other distros, Alpine installation is command line driven with helper script.

### Minimalistic Base

Alpine base installation mainly install `busybox` utilities. Following are some packages I installed manually:

- `avahi` - Avahi mDNS/DNS-SD daemon.
- `dbus` - `avahi` dependency but did not pull in. Install manually.
- `drill` - `dig` replacement.
- `findutils` - Install this if you want `locate`.
- `openssh-client` - For `scp`.
- `samba-common-tools` - `samba` tools.
- `samba` - File sharing.
- `sudo` - Yes, you have to install sudo yourself.
- `util-linux` - For `uuidgen` if you don't want to use `dbus-uuidgen`.
- `wpa_supplicant` - For wi-fi connection.

PS: Alpine packages don't bundle with man page. You have to install them separately.

### Work Differently

Alpine use [busybox](https://www.busybox.net/) to provide most command line utilities. As aa result many commands don't work the same as other distros. Following are a few examples:

- `dropbear` - `openssh` drop-in replacement. Do not support ed25519 keys.
- `nslookup` - No interactive mode.
- `top` - No color. Different hot-keys.

### Not Available or Don't Work

- `mdns` - Due to current limitation of [musl library](https://www.musl-libc.org/), Alpine does not support multicast-dns resolution. Running `avahi-daemon` only allow other devices to find the Alpine server.
- `w`, `last` - User accounting not working.

## Conclusion

Each Linux distribution has its own characteristics. Alpine Linux standout for its simplicity and minimalistic approach of package building. This is not an exhaustion list nor about good or bad of Alpine, but some random notes from a long time Ubuntu / Red Hat user whose Alpine installation count is going up.
