---
type: "blog"
date: 2019-08-13T11:13:25-04:00
author: "John Siu"
title: "Docker on Mac"
description: "Running Docker on Mac OS"
tags: ["docker","mac","apple"]
draft: false
---
Running Docker on Mac and create first container.
<!--more-->
There are multiple ways to install docker on Mac. We will use [Homebrew for Mac](https://brew.sh/).

### Get Homebrew

Follow instruction on brew website:

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Install Docker

As Docker require system level privileges, we will install docker with brew `cask`:

```sh
brew cask install docker
brew install docker-compose
```

Start Docker app from launcher.

### Check Installation & Hello-World

After Docker app is up, open terminal:

```sh
docker --version
```

Output:

```sh
Docker version 19.03.1, build 74b1e89
```

Get hello-world example:

```sh
docker run hello-world
```

Output:

```sh
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:6540fc08ee6e6b7b63468dc3317e3303aae178cb8a45ed3123180328bcc1d20f
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

More details can be found in Docker Doc[^1].

### Build Unbound Container

Pull my unbound example from github:

```sh
git clone https://github.com/J-Siu/unbound-dot.git
```

`unbound`[^2] is a lightweight dns server supporting dns-over-tls(DoT). This example use `alpine linux` as base and install unbound using package manager to install unbound within the container.

Building the example:

```sh
cd unbound-dot
docker build -t unbound-dot .
```

Output:

```sh
Sending build context to Docker daemon  65.02kB
Step 1/5 : FROM alpine:latest
latest: Pulling from library/alpine
050382585609: Pull complete
Digest: sha256:6a92cd1fcdc8d8cdec60f33dda4db2cb1fcdcacf3410a8e05b3741f44a9b5998
Status: Downloaded newer image for alpine:latest
 ---> b7b28af77ffe
Step 2/5 : RUN apk --no-cache add unbound ca-certificates-cacert
 ---> Running in 6826226270d7
fetch http://dl-cdn.alpinelinux.org/alpine/v3.10/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.10/community/x86_64/APKINDEX.tar.gz
(1/6) Installing dns-root-hints (2019031302-r1)
(2/6) Installing dnssec-root (20190225-r0)
(3/6) Installing libevent (2.1.10-r0)
(4/6) Installing expat (2.2.7-r0)
(5/6) Installing unbound-libs (1.9.1-r2)
(6/6) Installing unbound (1.9.1-r2)
Executing unbound-1.9.1-r2.pre-install
Executing busybox-1.30.1-r2.trigger
OK: 13 MiB in 20 packages
Removing intermediate container 6826226270d7
 ---> 8feb62cbd80e
Step 3/5 : COPY unbound.conf /etc/unbound/
 ---> 46ce212c3c2b
Step 4/5 : EXPOSE 53
 ---> Running in 25929a9c9619
Removing intermediate container 25929a9c9619
 ---> f98d94795f86
Step 5/5 : CMD ["unbound","-d"]
 ---> Running in b831324d182a
Removing intermediate container b831324d182a
 ---> aa13f9e6d595
Successfully built aa13f9e6d595
```

> You can inspect the `Dockerfile` to see how it is done. More details of Docketfile can be found at DockerFile reference[^3].

List docker images:

```sh
docker images
```

Output:

```sh
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
unbound-dot         latest              aa13f9e6d595        8 minutes ago       13.1MB
alpine              latest              b7b28af77ffe        4 weeks ago         5.58MB
hello-world         latest              fce289e99eb9        7 months ago        1.84kB
```

Running unbound-dot:

```sh
docker run -d \
  -p 53:53/udp \
  -p 53:53/tcp \
  unbound-dot
```

Show running container:

```sh
docker container ls
```

Output:

```sh
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                                    NAMES
260ee2c31f37        unbound-dot         "unbound -d"        33 seconds ago      Up 31 seconds       0.0.0.0:53->53/tcp, 0.0.0.0:53->53/udp   brave_feistel
```

Stop the container using container id:

```sh
docker container stop 260ee2c31f37
```

### Reference

[^1]: [Docker Getting Started](https://docs.docker.com/get-started/)

[^2]: [unbund-dot](https://github.com/J-Siu/unbound-dot)

[^3]: [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
