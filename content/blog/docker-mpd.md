---
type: "blog"
date: 2019-08-25T19:16:21-04:00
author: "John Siu"
title: "Docker MPD"
description: "Docker MPD with UID/GID handling."
tags: ["docker","mpd"]
draft: false
---
Docker MPD with UID/GID handling.
<!--more-->
### Build

```sh
git clone https://github.com/J-Siu/docker_mpd.git
cd docker_mpd
docker build -t jsiu/docker_mpd:0.21.14
```

### Usage

#### Host Directories and Volume Mapping

Host|Inside Container|Mapping Required|Usage
---|---|---|---
${MPD_PATH_CONF}|/mpd.conf|Optional|MPD configuration file
${MPD_PATH_MPD}|/mpd/.mpd|Yes|Contain playlists folder, state file, database file
${MPD_PATH_MUSIC}|/mpd/music|Yes|MPD audio file folder
${MPD_PORT}|6000/tcp|Yes|MPD listening port
${MPD_SND}||Yes|MPD output device

Create playlists director inside ${MPD_PATH_MPD} if not exist yet.

```sh
mkdir -p ${MPD_PATH_MPD}/playlists
```

#### HOST_UID / HOST_GID

ENV VAR|Usage
---|---
MPD_HOST_UID|UID of ${MPD_PATH_MPD},${MPD_PATH_MUSIC} owner
MPD_HOST_GID|GID of ${MPD_PATH_MPD},${MPD_PATH_MUSIC} owner

#### Run

```docker
docker run \
-d \
-e MPD_HOST_UID=${MPD_HOST_UID} \
-e MPD_HOST_GID=${MPD_HOST_GID} \
-p ${MPD_PORT}:6600/tcp \
-v ${MPD_PATH_MPD}:/mpd/.mpd \
-v ${MPD_PATH_MUSIC}:/mpd/music \
--device ${MPD_SND} \
jsiu/docker_mpd:${MPD_TAG}
```

Example:

If ${MPD_PATH_MPD} and ${MPD_PATH_MUSIC} owner's UID=1001 and GID=1002:

```docker
docker run \
-d \
-e MPD_HOST_UID=1001 \
-e MPD_HOST_GID=1002 \
-p 6600:6600/tcp \
-v /home/jsiu/MPD:/mpd/.mpd \
-v /home/jsiu/Music:/mpd/music \
--device /dev/snd \
jsiu/docker_mpd:0.21.14
```

#### Debug / Custom Config

Get config from image:

```docker
docker run --rm jsiu/docker_mpd:0.21.14 cat /mpd.conf > mpd.conf
```

Change mpd.conf log_level to verbose:

```conf
log_level  "verbose"
```

Run with mpd.conf mapping:

```docker
docker run \
-e MPD_HOST_UID=1001 \
-e MPD_HOST_GID=1002 \
-p 6600:6600/tcp \
-v /home/jsiu/mpd.conf:/mpd.conf \ # Map mpd.conf into container
-v /home/jsiu/MPD:/mpd/.mpd \
-v /home/jsiu/Music:/mpd/music \
--device /dev/snd \
jsiu/docker_mpd:0.21.14
```

#### Compose

Get docker-compose template from image:

```docker
docker run --rm jsiu/docker_mpd:0.21.14 cat /docker-compose.yml > docker-compose.yml
docker run --rm jsiu/docker_mpd:0.21.14 cat /.env > .env
```

Fill in `.env` according to your environment.

```sh
docker-compose up
```

### Repository

- [docker_mpd](https://github.com/J-Siu/docker_mpd)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 0.21.14
  - Matching mpd version number
  - Base image: alpine:edge
  - mpd version: 0.21.14

### License

The MIT License

Copyright (c) 2019

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
