---
type: "blog"
date: 2019-08-26T23:51:14-04:00
author: "John Siu"
title: "MacOS Connect to KVM Client Desktop"
description: "MacOS connect to KVM client with remote-viewer and virt-manager."
tags: ["macos","kvm","virt-manager","virt-viewer","remote-viewer","zsh","how-to"]
---
Updated instruction for MacOS Mojave.
<!--more-->

In [MacOS direct connect to KVM client desktop](/blog/macos-kvm-remove-viewer/) I talked about XQuartz and virt-viewer. This will show you how to run `virt-manager` and `virsh`.

> **NOTE:** The user id \<user\> on KVM host used for ssh should be added to group `libvirt` already. Check out [Alpine KVM](/blog/alpine-kvm/) for preparing KVM for remote management. \<user\>'s ssh key should also be setup.

### Install Homebrew

Homebrew allow Linux package to be installed and ran on MacOS/X system. Follow instruction on [Homebrew](http://brew.sh):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Install virt-manager and virt-viewer

```sh
brew tap jeffreywildman/homebrew-virt-manager
brew install virt-manager virt-viewer libvirt
```

#### Using virt-manager and virsh

On Linux, you can connect to remote KVM host as follow:

```sh
virt-manager -c 'qemu+ssh://user@hostname/system'

virsh -c 'qemu+ssh://user@hostname/system'

virsh -c 'qemu+ssh://user@hostname/system' list

virsh -c 'qemu+ssh://user@hostname/system' net-list --all
```

On Mac, however, we have to append `?socket=/var/run/libvirt/libvirt-sock` to the connection string. `/var/run/libvirt/libvirt-sock` is where the file `libvirt-sock` located on your KVM host. Though unlikely, you may have to modify it according to your environment.

```sh
virt-manager -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock'

virsh -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock'

virsh -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock' list

virsh -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock' net-list --all
```

#### Using virt-viewer

`virt-viewer` is a command line tool to open remote KVM client desktop. It use the same syntax as `virsh` and `virt-manager`.

```sh
virt-viewer -c 'qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock' <vm-name>
```

#### Using remote-viewer

`remote-viewer` is a small GUI interface allow you to connect to remote KVM desktop without using virt-manager. It connect to spice port directly.

```sh
spice://<ip/hostname>:<port>
spice://localhost:5900
spice://192.168.0.10:5901
```

> **Note** If you are not using ssh tunnel for spice port, then you have to configure the client `Display Spice` to listen on `All Interfaces`.

![remote-viewer](https://raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/remote-viewer.png)

### Bonus - ZSH Functions

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
