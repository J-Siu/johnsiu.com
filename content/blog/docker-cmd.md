---
type: blog
date: 2019-07-30T18:06:06-04:00
author: "John Siu"
title: "Docker Commands"
description: "Docker misc."
tags: ["docker","cheatsheet"]
draft: false
aliases:
  - /cheatsheet/docker-commands
---
Docker misc.
<!--more-->

---

### Install

#### Alpine

```sh
apk add docker docker-compose
```

#### Ubuntu

```sh
apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] http://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt update
apt install docker-ce docker-ce-cli containerd.io
```

---

### Non-root

```sh
sudo adduser <user> docker
```

---

### Import/Export Image

#### Manual

```sh
docker save -o <output tar> <image name>
docker load -i <tar file>
```

#### Push

Push from source to target.

```sh
docker save <image> | bzip2 | ssh user@host 'bunzip2 | docker load'
```

OR

```sh
docker save <image> | bzip2 | pv | ssh user@host 'bunzip2 | docker load'
```

#### Pull

```sh
ssh target_server 'docker save image:latest | bzip2' | pv | bunzip2 | docker load
```

---

### docker-compose

#### Specify compose file

```sh
docker-compose -f <filename> up
```

#### Daemon mode

```sh
docker-compose -f <filename> up -d
```

This will also start compose container if docker is auto start during reboot.

#### Enter shell of running compose container

```sh
docker-compose -f <filename> exec <appname> sh
```

### Docker Daemon URI

#### TCP

To enable remote/tcp docker daemon access, edit **docker.server**

```sh
systemctl edit docker.service
```

with following content:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://127.0.0.1:2345 --containerd=/run/containerd/containerd.sock
```

IPv6 use:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://[::1]:2345 --containerd=/run/containerd/containerd.sock
```

#### Unix Socket

Docker API socket is at **/var/run/docker.sock**

### Data Root

**--data-root**, used to be **-g**, **--graph**, default to **/var/lib/docker**

Override in Systemd

```sh
systemctl edit docker.service
```

with following content:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --data-root /new/location
```

Override with `/etc/docker/daemon.json`

```json
{
  "data-root":"/new/location"
}
```

### Log to Journald

**/etc/daemon.json**

```json
{
  "log-driver": "journald"
}
```

### daemon.json

From: https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file

```json
{
  "authorization-plugins": [],
  "data-root": "",
  "dns": [],
  "dns-opts": [],
  "dns-search": [],
  "exec-opts": [],
  "exec-root": "",
  "experimental": false,
  "features": {},
  "storage-driver": "",
  "storage-opts": [],
  "labels": [],
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file":"5",
    "labels": "somelabel",
    "env": "os,customer"
  },
  "mtu": 0,
  "pidfile": "",
  "cluster-store": "",
  "cluster-store-opts": {},
  "cluster-advertise": "",
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 5,
  "default-shm-size": "64M",
  "shutdown-timeout": 15,
  "debug": true,
  "hosts": [],
  "log-level": "",
  "tls": true,
  "tlsverify": true,
  "tlscacert": "",
  "tlscert": "",
  "tlskey": "",
  "swarm-default-advertise-addr": "",
  "api-cors-header": "",
  "selinux-enabled": false,
  "userns-remap": "",
  "group": "",
  "cgroup-parent": "",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "init": false,
  "init-path": "/usr/libexec/docker-init",
  "ipv6": false,
  "iptables": false,
  "ip-forward": false,
  "ip-masq": false,
  "userland-proxy": false,
  "userland-proxy-path": "/usr/libexec/docker-proxy",
  "ip": "0.0.0.0",
  "bridge": "",
  "bip": "",
  "fixed-cidr": "",
  "fixed-cidr-v6": "",
  "default-gateway": "",
  "default-gateway-v6": "",
  "icc": false,
  "raw-logs": false,
  "allow-nondistributable-artifacts": [],
  "registry-mirrors": [],
  "seccomp-profile": "",
  "insecure-registries": [],
  "no-new-privileges": false,
  "default-runtime": "runc",
  "oom-score-adjust": -500,
  "node-generic-resources": ["NVIDIA-GPU=UUID1", "NVIDIA-GPU=UUID2"],
  "runtimes": {
    "cc-runtime": {
      "path": "/usr/bin/cc-runtime"
    },
    "custom": {
      "path": "/usr/local/bin/my-runc-replacement",
      "runtimeArgs": [
        "--debug"
      ]
    }
  },
  "default-address-pools":[
    {"base":"172.80.0.0/16","size":24},
    {"base":"172.90.0.0/16","size":24}
  ]
}
```