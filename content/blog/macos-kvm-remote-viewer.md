---
type: "blog"
date: 2015-11-18T18:47:44Z
author: "John Siu"
title: "MacOS direct connect to KVM client desktop"
description: "MacOS connect to KVM with remote-viewer."
tags: ["macos","kvm","virt-manager","virt-viewer","remote-viewer","spice","how-to"]
aliases:
  - /blog/os-x-direct-connect-to-kvm-client-desktop
  - /index.php/2015/11/18/os-x-direct-connect-to-kvm-client-desktop
  - /index.php/os-x-direct-connect-to-kvm-client-desktop
  - /os-x-direct-connect-to-kvm-client-desktop
---

Recently I have been experimenting with a tiny KVM setup. Everything is good till I want to use my Mac Mini to connect to the client desktop.
<!--more-->

I spend so much time trying and the most successful setup is through Linux running inside VirtualBox.

However that seems overkill and take up a lot of resource on the Mac Mini. I continue to push with other solution and finally come up with a satisfying setup.

### Issue with OS X connecting to KVM client

The most common way to KVM client running graphical interface is through KVM manager. Though that will work locally on the KVM host out of the box, it proves to be difficult even from another Linux server, and require a lot of research and tweaking for people new to KVM. However there is a easy solution for OS X.

### Home-brew, XQuartz and virt-viewer

Homebrew allow Linux package to be installed and ran on OS X system. Follow instruction on [Homebrew](http://brew.sh):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

To use virt-viewer, you will need to install XQuartz also. Package can be obtain [here](http://www.xquartz.org).

Then install virt-viewer with following command

`brew install virt-viewer`

Use following command to start the viewer

`remote-viewer`

Once it is started, you can even pin it to the dock. Problem solved!!!

![remote-viewer](https://raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/remote-viewer.png)

### MacOS Mojave

Check out [MacOS Connect to KVM Client Desktop](/blog/macos-kvm-remote-connect/) for updated instructions for MacOS Mojave, which contain instructions for running virt-manager to remote manage KVM.
