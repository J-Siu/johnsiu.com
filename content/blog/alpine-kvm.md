---
type: "blog"
date: 2019-07-21T18:15:55-04:00
author: "John Siu"
title: "Alpine KVM"
description: "Install and manage KVM on a remote Alpine server."
tags: ["alpine","kvm","macos","command-line","how-to"]
---
Setup libvirt/KVM on a remote Alpine Linux server and connect __virsh__/__virt-manager__ from remote.
<!--more-->

Alpine server is assumed to have no GUI capability. All steps are done through remote connection.

---

### Install KVM

> **Note:**
>
> - This part is a streamline version of [Alpine KVM wiki page](//wiki.alpinelinux.org/wiki/KVM).
> - No __virt-manager__ on remote Alpine server. You only need it on your local machine.
> - Assume VMs bridge-mode using __macvtap__. __bridge__ package not required.
> - Use __root__ or __sudo__ for all commands in this section.

Add KVM packages:

```sh
apk add libvirt-daemon qemu-img qemu-system-x86_64 polkit
rc-update add libvirtd
```

Add `user` to group `libvirt`:

```sh
addgroup <user> libvirt
```

Allow `libvirt` group to access `/var/run/libvirt/libvirt-sock`:

```sh
mkdir -p /etc/polkit-1/localauthority/50-local.d
```

Create `/etc/polkit-1/localauthority/50-local.d/50-libvirt-ssh-remote-access-policy.pkla` with following content:

```ini
[Remote libvirt SSH access]
 Identity=unix-group:libvirt
 Action=org.libvirt.unix.manage
 ResultAny=yes
 ResultInactive=yes
 ResultActive=yes
```

At this point virt-manager and virsh can connect from remote and takeover completely.

### Remote Management

`virsh` and `virt-manager` can be used to manage KVM remotely.

`virsh` is the command line tool that can manage libvirt/KVM directly on the host or from remote.

`virt-manager` is the GUI interface.

#### Local connection (on Alpine server)

From `libvirt` group user:

Interactive mode:

```sh
virsh -c qemu:///system
```

Command line / batch mode

```sh
virsh -c qemu:///system net-list --all
```

#### Remote connection

> **NOTE:** `user@hostname` will be the same string for ssh to the `libvirt` group user on Alpine host. SSH key should be setup already.

##### Linux

```sh
virt-manager -c qemu+ssh://user@hostname/system

virsh -c qemu+ssh://user@hostname/system

virsh -c qemu+ssh://user@hostname/system net-list --all
```

##### MacOS

Check out [MacOS Connect to KVM Client Desktop](/blog/macos-kvm-remote-connect/) for running virt-manager to remote manage and connect KVM on MacOS.
