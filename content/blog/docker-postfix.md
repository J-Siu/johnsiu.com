---
type: "blog"
date: 2020-06-07T01:00:58-04:00
author: "John Siu"
title: "Docker Postfix"
description: "Docker Postfix"
tags: ["docker","postfix","sasl2"]
draft: false
---
Docker - Postfix with sasldb2 support
<!--more-->
### Build

```sh
git clone https://github.com/J-Siu/docker_compose.git
cd docker/postfix
docker build -t jsiu/postfix .
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

Container will automatically exit if no configuration volume (`${POSTFIX_CNF}`), or if configuration volume is empty.

The permission and ownership of `${POSTFIX_CNF}` is not important. Container `start.sh` copies `/postfix` to `/etc/` and applies ownership and permission to `/etec/postfix` accordingly.

Postfix configuration come with Alpine package install is included in the container at `/postfix.pkg.tgz`. Retrieve it with following commands:

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

If sasldb2 is to be used, `sasldb2` and `smtpd.conf` should be placed in `${POSTFIX_CNF}/sasl2/`. Container `start.sh` script will copy them to `/etc/sasl2/`.

Sample `smtpd.conf` content:

```ini
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
```

#### Logs

There are two ways to log to journald.

##### /dev/log

Mount host `/dev/log` to container `/dev/log` to enable postfix logs to host logging system.

##### /dev/stdout

To have postfix log to stdout:

Add following to `master.cf`

```ini
postlog   unix-dgram n  -       n       -       1       postlogd
```

Add following to `main.cf`

```ini
maillog_file = /dev/stdout
```

Show postfix log from journald:

```sh
journalctl -t <postfix container name>
journalctl -t postfix
```

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
docker run --rm jsiu/postfix cat /docker-compose.yml > docker-compose.yml
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
- 1.1
  - Dockerfile remove apk update
  - start.sh
    - Use exec so start.sh can exit
- 3.5.3-r0
  - Adopt Postfix version
  - Postfix version 3.5.3-r0

### License

The MIT License

Copyright (c) 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
