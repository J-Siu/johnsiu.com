---
type: "blog"
date: 2020-06-17T18:03:23-04:00
author: "John Siu"
title: "Docker Hugo"
description: "Docker - Hugo site generator used in CI/CD."
tags: ["docker","hugo"]
draft: false
---

Docker - Hugo site generator used in CI/CD.

<!--more-->

This is used in my [blog automation](/jenkins-blog-automation/).

---

### Build

```sh
git clone https://github.com/J-Siu/docker_compose.git
cd docker/hugo
docker build -t jsiu/hugo .
```

### Usage

#### Environment Variable and Volume Mapping

Host|Inside Container|Mapping Required|Default|Usage
---|---|---|---|---
${TZ}|${MY_TZ}|no|n/a|time zone
${WWW_VOL}|/www|yes|n/a|Base dir/volume Hugo publish to
${MY_GIT_DIR}|${MY_GIT_DIR}|no|/hugo|Git pull location
${MY_GIT_URL}|${MY_GIT_URL}|yes|n/a|Hugo will work inside this dir
${MY_GIT_SUB}|${MY_GIT_SUB}|no|n/a|If defined(not empty), pull git sub-module
${MY_PUB_DIR}|${MY_PUB_DIR}|no|n/a|If defined(not empty), public will be copied here.

If `${MY_GIT_DIR}` is defined:

- If `${MY_GIT_DIR}/.git` exist, do git pull, exist if failed.
- If `${MY_GIT_DIR}` exist
	- If empty, do git clone. exit if failed.
	- If not empty, if git remote match, do git pull, exit if failed.
  - If not empty, not a repo, exit.
- If `${MY_GIT_DIR}` does not exist, do git clone, exist if failed.

#### Run

PS: All arguments will past to `hugo` in `start.sh`.

```docker
docker run --rm \
-v ${WWW_VOL}:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=${MY_GIT_URL} \
-e MY_GIT_SUB=true \
jsiu/hugo
```

In following example fresh git clone each run, and copy `public` into `/www/johnsiu.com` at the end.

```sh
docker run --rm \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_PUB_DIR=/www/johnsiu.com \
jsiu/hugo
```

In following example will clone only if needed, else pull, no `public` copy at the end.

```sh
docker run --rm \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_GIT_DIR=/www/johnsiu.com \
jsiu/hugo
```

#### Compose

Get `REAME.md` from image:

```docker
docker run --rm jsiu/hugo cat /README.md > README.md
```

### Repository

- [docker_compose](https://github.com/J-Siu/docker_compose)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 1.0
	- Initial commit.

### License

The MIT License

Copyright (c) 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.