---
author: "John Siu"
date: 2022-05-12T01:50:44-04:00
description: "Alpine Linux and VS Code remote ssh how-to"
tags: ["alpine-linux","vscode","ssh","how-to","git"]
title: "Alpine Linux and VS Code Remote SSH"
type: "blog"
images: ["//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/alpine-vscode.png"]
---
How to do it in 2022.
<!--more-->

### Back Story

Have been trying to do VS Code remote ssh to alpine box for years. The connection always failed with following error:

> The remote host may not meet VS Code Server's prerequisites for glibc and libstdc++

A few month ago I finally seat down and went through VS Code logs on both ends. The first thing I notice was Alpine box didn't install `wget` nor `curl` by default, and VS Code server need at least one of them. Installing `wget` solved half the problem and I got more logs.

Then I hit on the actual `glibc`/`libstdc++` issue. `libstdc++` was solved by a simple `apk add`. And after some googling, it turned out Alpine had a `gcompat` package that provides glibc function on top of `musl`. Installing it and VS Code remote ssh start working.

### It Works

So it turned out to make VS Code remote ssh to Alpine box is as simple as running following on the Alpine box:

```sh
apk add gcompat libstdc++ curl bash git
```
You can replace `curl` with `wget`. And aside from that, VS Code is also looking for `bash`.

I had the above discovery post in [vscode-remote-release](https://github.com/microsoft/vscode-remote-release/issues/6347#issuecomment-1079430646) back in Mar. But the story didn't end there.

### Dropbear/OpenSSH

`dropbear` is an OpenSSH alternative for ssh server and client. It is simpler and smaller. If you don't need ssh tunnel, sftp/scp to and from the Alpine box, you can just stick with it.

However I was having issues with ssh tunneling, sftp/scp, etc. On the Alpine box, I end up switching out `dropbear` and back to `openssh` server and client.

```sh
apk del dropbear
apk add openssh
```

Unlike Ubuntu, following need to be set manually for `sshd` on Alpine.

`/etc/ssh/sshd-config`

```sh
AllowTcpForwarding yes
PermitTunnel       yes
```

### VS Code and Alpine Git

Though Alpine Linux git install in `/usr/bin/git`, same location as most other Linux and Mac OS, VS Code cannot load the default environment and has to be set manually.

Connect VS Code to the Alpine box, then in settings, open the remote tab(`Remote [SSH: <hostname>]`):

![alpine-vscode-git](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/alpine-vscode.png)

Click upper right icon to open json file, and put following:

```json
{
	"git.path": "/usr/bin/git",
}
```

Git will start working after reconnect.

### BusyBox

`busybox` is another brilliant package that replaces lot of common linux commands with a single binary.

However, if you are doing lot of shell scripting and rely on some "standard" command line options and/or output, you are likely to run into issue.

I installed following in my Alpine box:

```sh
apk add zsh grep curl wget git jq git util-linux-misc procps
```

### Conclusion

Turn out the steps required are not difficult and hope VS Code will one day support ssh-ing to Alpine out of the box.
