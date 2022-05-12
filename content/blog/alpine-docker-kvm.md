---
author: "John Siu"
date: 2019-07-22T02:32:06-04:00
description: "Install docker machine on Alpine using KVM driver."
tags: ["alpine-linux","kvm","docker","how-to"]
title: "Alpine Docker-Machine KVM Driver"
type: "blog"
---

It is easy to install Docker in Alpine as packages are readily available. But what about Docker-Machine without VirtualBox?
<!--more-->

---

### Install Docker Machine

Following [official instruction](//docs.docker.com/machine/install-machine/) work perfectly:

```zsh
base=https://github.com/docker/machine/releases/download/v0.16.0 &&
curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine &&
sudo install /tmp/docker-machine /usr/local/bin/docker-machine
```

Check version:

```zsh
$ docker-machine version
docker-machine version 0.16.0, build 702c267f
```

### Docker KVM Driver

Docker site only give VirtualBox example:

```zsh
docker-machine create --driver virtualbox myvm
```

There is a [driver list](//docs.docker.com/machine/drivers/) if you dig deeper but none is for KVM. [dhiltgen](//github.com/dhiltgen/docker-machine-kvm) on github created one but stopped maintaining it, and it has issue[^1] with the latest docker image used by docker machine. The current working driver is from [tdilauro's fork](//github.com/tdilauro/docker-machine-kvm) and you can install it as below:

```zsh
curl -L https://github.com/tdilauro/docker-machine-kvm/releases/download/v0.10.1/docker-machine-driver-kvm-alpine3.4 > /usr/local/bin/docker-machine-driver-kvm

chmod +x /usr/local/bin/docker-machine-driver-kvm
```

This fork added the `--kvm-nic-type` option to allow one to specify `virtio` during the creation process. Then you can create docker machine like this:

```zsh
docker-machine create --driver kvm --kvm-nic-type virtio myKvm
```

[^1]: [Original KVM driver issue on github](//github.com/dhiltgen/docker-machine-kvm/issues/72)
