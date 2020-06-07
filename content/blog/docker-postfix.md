---
type: "blog"
date: 2020-06-07T01:00:58-04:00
author: "John Siu"
title: "Docker Postfix"
description: "Docker Postfix"
tags: ["docker","postfix","email"]
draft: false
---
Docker - postfix with sasldb2 support
<!--more-->

### Build

```sh
git clone https://github.com/J-Siu/docker_compose.git
cd docker/postfix
docker build -t jsiu/postfix
```

### Usage

#### Host Directories and Volume Mapping

Host|Inside Container|Mapping Required|Usage
---|---|---|---
${POSTFIX_CNF}|/postfix|Yes|postfix configuration volume
${POSTFIX_HOSTNAME}|hostname|no|hostname inside container
${TZ}|${P_TZ}|no|time zone

#### Postfix Configuration

##### Configuration Volume

Container will automatically exit if no configuration volumn (`${POSTFIX_CNF}`), or if configuration volumn is empty.

The permission and ownership of `${POSTFIX_CNF}` is not important. Container `start.sh` copys `/postfix` to `/etc/` and applys ownership and permission to `/etec/postfix` accordingly.

Postfix configuration come with Alpine package install is included in the container at `/postfix.pkg.tgz`. Retrive it with following commands:

```docker
docker run -d -it --rm --name tmp jsiu/postfix sh
docker cp tmp:/postfix.pkg.tgz .
docker stop tmp
```

##### aliases

If `aliases` is used, it should be placed at `${POSTFIX_CNF}/aliases`. Container `start.sh` script will execute `newaliases`.

In `main.cf`:

```ini
alias_maps = hash:/etc/postfix/aliases
alias_database = hash:/etc/postfix/aliases
```

##### sasldb2

If saasldb2 is to be used, `sasldb2` and `smtpd.conf` should be placed in `${POSTFIX_CNF}/sasl2/`. Container `start.sh` script will copy them to `/etc/sasl2/`.

Sample `smtpd.conf` content:

```ini
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
```

#### Logs

Mount host `/dev/log` to container `/dev/log` to enable postfix logs to host logging system.

#### Run

```docker
docker run \
-d \
-e P_TZ=America/New_York \
-v /home/jsiu/postfix:/postfix \
-v /dev/log:/dev/log
-p 25 \
-p 587 \
jsiu/postfix
```

#### Compose

Get docker-compose template from image:

```docker
docker run --rm jsiu/postifx cat /docker-compose.yml > docker-compose.yml
docker run --rm jsiu/postfix cat /env > env
```

Fill in `.env` according to your environment.

```sh
docker-compose up
```

### Repository

- [docker_compose](https://github.com/J-Siu/docker_compose)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 1.0
  - Initial commit.