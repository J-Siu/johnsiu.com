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
