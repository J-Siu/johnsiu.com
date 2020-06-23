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

### Dockerfile

#### Alpine Base

`apk update` is not necessary if `apk --no-cache add ...` is used for pulling packages.

#### Common Steps

If creating a lot of Dockerfile with similar base packages like `tzdata`, `ca-certificates`, they should be moved to the top and separate from container specific steps.

### Container & Startup Script

#### GID/UID

1. Environment Variables

    ```sh
    #!/bin/ash

    PUSR=mpd
    PHOME=/${PUSR}

    echo PGID:${PGID}
    echo PUID:${PUID}

    if [ "${PUID}" -lt "1000" ]
    then
      echo PUID cannot be \< 1000
      exit 1
    fi

    if [ "${PGID}" -lt "1000" ]
    then
      echo PGID cannot be \< 1000
      exit 1
    fi

    addgroup -g ${PGID} ${PUSR}
    adduser -D -h ${PHOME} -G ${PUSR} -u ${PUID} ${PUSR}
    ```

    Full example [here](https://github.com/J-Siu/docker_compose/tree/master/docker/mpd_lite).

2. Docker Option

    ```sh
    -u, --user string        Username or UID (format: <name|uid>[:<group|gid>])
    ```

#### Time Zone

There are multiple ways to set time zone inside container. Following are 2:

1. Environment Variables

    In `Dockerfile`, install `tzdata`.

    Pass `P_TZ=America/New_York` into container.

    In start up script:

    ```sh
    echo P_TZ:${P_TZ}
    if [ "${#P_TZ}" -gt "0" ]; then
      TZ="/usr/share/zoneinfo/${P_TZ}"
      if [ -f "${TZ}" ]; then
        cp ${TZ} /etc/localtime
        echo "${P_TZ}" >/etc/timezone
      else
        echo "${P_TZ}" not available.
      fi
    fi
    ```

    This is more reliable if no control of hosting OS, like cloud or Windows.

2. Direct Mapping

    Use:

    ```sh
    -v /etc/localtime:/etc/localtime \
    -v /etc/timezone:/etc/timezone
    ```

    This is simpler if Linux host is guaranteed and always follow host's time zone.

#### Exec

If shell script is used in `CMD` or `ENTRYPOINT` to setup container environment, use `exec` to execute the final command so the shell can exit.

```sh
#!/bin/sh

# Preparation
  ...
# Done

exec <cmd>
```

This work for `su <cmd>` also.

#### Command Check

```sh
#!/bin/sh

# Run cmd with error check
RUN_CMD() {
	CMD=$1
	$CMD
	RTN=$?
	if [ ${RTN} -ne 0 ]; then
		echo \"$CMD\" error:${RTN}
		exit ${RTN}
	fi
	return ${RTN}
}

RUN_CMD "git submodule update --init --recursive"
```

Full example [here](https://github.com/J-Siu/docker_compose/tree/master/docker/hugo).

### Docker Compose

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

All process stdout/stderr inside container go into docker log. To have that log into journald:

`/etc/docker/daemon.json`

```json
{
  "log-driver": "journald"
}
```

`/dev/log`

For processes(eg. postfix) that write to system log, map `/dev/log`:

```sh
-v /dev/log:/dev/log
```

In compose

```yml
volumes:
  - /dev/log:/dev/log
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