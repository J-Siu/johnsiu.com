---
author: "John Siu"
date: 2015-11-18T18:47:44Z
description: "MacOS connect to KVM with remote-viewer."
tags: ["macos","kvm","qemu","virt-manager","virt-viewer","remote-viewer","spice","how-to"]
title: "MacOS Direct Connect To KVM Client Desktop"
type: "blog"
---

Recently I have been experimenting with a tiny KVM setup. Everything is good till I want to use my Mac Mini to connect to the client desktop.
<!--more-->

I spend so much time trying and the most successful setup is through Linux running inside VirtualBox.

However that seems overkill and take up a lot of resource on the Mac Mini. I continue to push with other solution and finally come up with a satisfying setup.

### Issue with OS X connecting to KVM client

The most common way to KVM client running graphical interface is through KVM manager. Though that will work locally on the KVM host out of the box, it proves to be difficult even from another Linux server, and require a lot of research and tweaking for people new to KVM. However there is a easy solution for MacOS.

### Homebrew

Homebrew allow Linux package to be installed and ran on OS X system. Follow instruction on [Homebrew](//brew.sh):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### virt-viewer/remote-viewer

Though homebrew core include `virt-manager`, it does not have `virt-viewer`. We need to add a tap from `jeffreywildman`:

```sh
brew tap jeffreywildman/homebrew-virt-manager
```

Then install virt-viewer with following command

`brew install virt-viewer`

There are two ways to use `virt-viewer`: `virt-viewer` and `remote-viewer`.

#### virt-viewer

The command `virt-viewer` can connect through the virt framework, make it easy to connect to vm with NAT network. This requires a connection string and the vm name. Connecting from MacOS, the connection string is in following format:

```sh
qemu+ssh://<user@hostname>/system?socket=/var/run/libvirt/libvirt-sock
```

The full command will be as follow:

```sh
virt-viewer --connect 'qemu+ssh://<user@hostname>/system?socket=/var/run/libvirt/libvirt-sock' <vm name>
```

Replace `<user@hostname>` and `<vm name>` for your environment.

#### remote-viewer

In contra to `virt-viewer`, the command `remote-viewer` has a gui and make direct connection to target vm.

![remote-viewer](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/remote-viewer.png)

### XQuartz

XQuartz is no longer required for virt-viewer. However, if you find your MacOS / OS X still need it, obtain it [here](//www.xquartz.org).

### MacOS virt-manager

Check out [MacOS Connect to KVM Client Desktop](/blog/macos-kvm-remote-connect/) for using `virt-manager` on MacOS to manage and connect remote KVM.
