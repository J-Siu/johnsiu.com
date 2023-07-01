---
author: "John Siu"
date: 2023-07-01T12:39:07-04:00
description: "Docker Helper Script"
draft: true
tags: ["docker"]
title: "Docker Script"
type: "blog"
---
Scripts that make managing docker easier.
<!--more-->

### Compose Refresh
`compose-refresh.sh`:
```sh
docker-compose down;docker-compose up -d%
```

### Update All Images
`update-images.sh`:
```sh
docker images|grep -v ^REPO|cut -d' ' -f1|xargs -L1 docker pull
compose-refresh.sh
docker image prune -f%
```
