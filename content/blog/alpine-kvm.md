---
type: "blog"
date: 2019-07-21T18:15:55-04:00
author: "John Siu"
title: "Alpine KVM"
description: "Install and manage KVM on a remote Alpine server."
tags: ["Alpine", "KVM"]
draft: false
---
Setup libvirt/KVM on a remote [Alpine Linux](https://alpinelinux.org/about/) server. Connect `virsh`/`virt-manager` from local machine to Alpine server. Alpine server is assumed to have no GUI capability. All steps are done through remote connection.
<!--more-->

## Install KVM

> **Note:**
>
> - This part is a streamline version of [Alpine KVM wiki page](https://wiki.alpinelinux.org/wiki/KVM).
> - No `virt-manager` on remote Alpine server. You only need it on your local machine.
> - Assume VMs bridge-mode using `macvtap`. `bridge` package not required.
> - Use `root` or `sudo` for all commands in this section.

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

## Remote Management

`virsh` and `virt-manager` can be used to manage KVM remotely.

`virsh` is the command line tool that can manage libvirt/KVM directly on the host or from remote.

`virt-manager` is the gui interface.

### Local connection (on Alpine server)

From `libvirt` group user:

Interactive mode:

```sh
virsh -c qemu:///system
```

Command line / batch mode

```sh
virsh -c qemu:///system net-list --all
```

### Remote connection

> **NOTE:** `user@hostname` will be the same string for ssh to the `libvirt` group user on Alpine host. SSH key should be setup already.

#### Linux

```sh
virt-manager -c qemu+ssh://user@hostname/system

virsh -c qemu+ssh://user@hostname/system

virsh -c qemu+ssh://user@hostname/system net-list --all
```

#### MacOS

Use [brew](https://brew.sh/) and install `libvirt` and [homebrew-virt-manager](https://github.com/jeffreywildman/homebrew-virt-manager)

```sh
brew tap jeffreywildman/homebrew-virt-manager
brew install virt-manager virt-viewer libvirt
```

We have to append `?socket=/var/run/libvirt/libvirt-sock` to the connection string:

```sh
virt-manager -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock'

virsh -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock'

virsh -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock' net-list --all
```

## Bonus

If you want to manage KVM from a Mac and using `zsh`, add following to the end of `.zshrc`:

```zsh
kvm(){
  REMOTE=$1
  shift
  virsh -c "qemu+ssh://${REMOTE}/system?socket=/var/run/libvirt/libvirt-sock" $@
}

kvm-list(){
  kvm $1 "list --all"
}

kvm-stop(){
  kvm $1 shutdown $2
}

kvm-start(){
  kvm $1 start $2
}

kvm-manager(){
  nohup virt-manager -c "qemu+ssh://$1/system?socket=/var/run/libvirt/libvirt-sock" &
}
```

Usage:

```zsh
kvm user@hostname # virsh connect to remote host and enter interactive mode
kvm user@hostname list --all # virsh connect to remote host and do 'list --all'

kvm-list user@hostname # same as above
kvm-stop user@hostname vm-name # virsh connect to remote host and shutdown vm-name
kvm-start user@hostname vm-name # virsh connect to remote host and start vm-name

kvm-manager user@hostname # start virt-manager connect to remote host
```