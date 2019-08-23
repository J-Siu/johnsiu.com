---
type: "Cheat Sheet"
date: 2019-07-30T18:06:06-04:00
author: "John Siu"
title: "Docker Commands"
description: "Docker command cheat sheet."
tags: ["docker","cheat sheet"]
draft: true
---
<!--more-->
# Docker

## Install

```sh
apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] http://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt update
apt install docker-ce docker-ce-cli containerd.io
```

Allow non-root user to manage docker:
`Ubuntu`

```sh
sudo adduser <user> docker
```

## Create Image

1. Create dockerfile

## Private Repository

## Images

`Run image`

`Moving image manually between servers`

Method 1

```sh
docker save -o <path for generated tar file> <image name>
docker load -i <path to image tar file>
```

Method 2

Push from source to target.

```sh
docker save <image> | bzip2 | ssh user@host 'bunzip2 | docker load'
```

OR

```sh
docker save <image> | bzip2 | pv | ssh user@host 'bunzip2 | docker load'
```

Pull from source

```sh
ssh target_server 'docker save image:latest | bzip2' | pv | bunzip2 | docker load
```

## Services

docker-compose.yml
