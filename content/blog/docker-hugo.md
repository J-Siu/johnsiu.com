---
author: "John Siu"
date: 2020-06-17T18:03:23-04:00
description: "Docker - Hugo site generator used in CI/CD."
tags: ["docker","cicd","lib","gohugo","hugo"]
title: "Docker Hugo"
type: "blog"
---

Docker - Hugo site generator used in CI/CD.

<!--more-->

This is used in my [blog automation](/blog/jenkins-blog-automation/).

### Build

```sh
git clone https://github.com/J-Siu/docker_hugo.git
cd docker_hugo
docker build -t jsiu/hugo .
```

### Usage

#### Environment Variable and Volume Mapping

Host|Inside Container|Mapping Required|Default|Usage
---|---|---|---|---
${TZ}|${MY_TZ}|no|n/a|time zone
${WWW_VOL}|/www|yes|n/a|Base dir/volume Hugo publish to
${MY_GIT_DIR}|${MY_GIT_DIR}|no|/hugo|Git clone/pull destination.
${MY_GIT_URL}|${MY_GIT_URL}|yes|n/a|Git will clone/pull from this URL.
${MY_GIT_SUB}|${MY_GIT_SUB}|no|n/a|If defined(not empty), pull git sub-module
${MY_GIT_SUB_REMOTE}|${MY_GIT_SUB_REMOTE}|no|n/a|If defined(not empty), pull git sub-module with `--remote`
${MY_HUG_DIR}|${MY_HUG_DIR}|no|n/a|Relative path to ${MY_GIT_DIR}, default empty.
${MY_PUB_DIR}|${MY_PUB_DIR}|no|n/a|Override publish directory. Hugo default `public` or defined in site config(`publishDir`).
${MY_THM_DIR}|${MY_THM_DIR}|no|/theme|Hugo theme clone/pull destination.
${MY_THM_URL}|${MY_THM_URL}|no|n/a|Hugo theme repo url.

Clone/pull of `${MY_GIT_URL}` flow:

- If `${MY_GIT_DIR}/.git` exist, do git pull, exit(1) if failed.
- If `${MY_GIT_DIR}` exist
  - If empty, do git clone. exit(1) if failed.
  - If not empty, if git remote match, do git pull, exit(1) if failed.
  - If not empty, not a repo, exit(1).
- If `${MY_GIT_DIR}` does not exist, do git clone, exit(1) if failed.

If `${MY_THM_URL}` is defined:

- Go through the same flow as `${MY_GIT_URL}`
- `--destination` will be added to hugo command
- Defining `${MY_THM_DIR}` and `${MY_THM_URL}` will not use theme automatically. Please see examples below.

#### Run

> All arguments will past to `hugo` in `start.sh`. See last example below.

```docker
docker run --rm --name hugo \
-v ${WWW_VOL}:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=${MY_GIT_URL} \
jsiu/hugo
```

Fresh git clone each run, publish to `/www/johnsiu.com` at the end.

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_PUB_DIR=/www/johnsiu.com \
jsiu/hugo
```

Clone if needed, else pull.

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_GIT_DIR=/www/johnsiu.com \
jsiu/hugo
```

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_GIT_DIR=/www/git/johnsiu.com \
-e MY_PUB_DIR=/www/site/johnsiu.com \
jsiu/hugo
```

Pass `--cleanDestinationDir` to hugo command.

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_SUB=true \
-e MY_GIT_DIR=/www/git/johnsiu.com \
-e MY_PUB_DIR=/www/site/johnsiu.com \
jsiu/hugo --cleanDestinationDir
```

Replacing theme and hugo command.

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_DIR=/www/git/johnsiu.com \
-e MY_PUB_DIR=/www/site/johnsiu.com \
-e MY_THM_URL=https://github.com/J-Siu/hugo-theme-sk3.git \
jsiu/hugo --theme theme --themesDir /
```

```sh
docker run --rm --name hugo \
-v CADDY_WWW:/www \
-e P_TZ=America/New_York \
-e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
-e MY_GIT_DIR=/www/git/johnsiu.com \
-e MY_PUB_DIR=/www/site/johnsiu.com \
-e MY_THM_DIR=/www/themes/sk3 \
-e MY_THM_URL=https://github.com/J-Siu/hugo-theme-sk3.git \
jsiu/hugo --theme sk3 --themesDir /www/themes
```

#### Extract

Get `README.md` from image:

```docker
docker run --rm jsiu/hugo cat /README.md > README.md
```

### Repository

- [docker_hugo](https://github.com/J-Siu/docker_hugo)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Change Log

- 1.0
  - Initial commit.
- 1.1
  - Add README.md example.
  - Add `${MY_GIT_DIR}`, `${MY_GIT_PUB}`.
  - Fix cd into repository bug.
- 0.72.0-r0
  - Adopt Hugo version
  - Hugo 0.72.0-r0
- 0.72.0-r0-p1
  - Removed
    - ${MY_HUG_PUB}
  - Added
    - ${MY_THM_DIR}
    - ${MY_THM_DIR}
- 0.73.0-r0
  - Auto update to 0.73.0-r0
- 0.74.1-r0
  - Auto update to 0.74.1-r0
- 0.74.2-r0
  - Auto update to 0.74.2-r0
- 0.74.2-r0-p1
  - Add `MY_GIT_SUB_REMOTE` option
- 0.74.3-r0
  - Auto update to 0.74.3-r0
- 0.76.5-r0
  - Auto update to 0.76.5-r0
- 0.77.0-r0
  - Auto update to 0.77.0-r0
- 0.78.0-r0
  - Auto update to 0.78.0-r0
- 0.78.1-r0
  - Auto update to 0.78.1-r0
- 0.78.2-r0
  - Auto update to 0.78.2-r0
- 0.79.1-r0
  - Auto update to 0.79.1-r0
- 0.81.0-r0
  - Auto update to 0.81.0-r0
- 0.82.0-r0
  - Auto update to 0.82.0-r0
- 0.83.1-r0
  - Auto update to 0.83.1-r0
- 0.83.1-r1
  - Auto update to 0.83.1-r1
- 0.85.0-r0
  - Auto update to 0.85.0-r0
- 0.97.3-r0
  - Auto update to 0.97.3-r0
- 0.97.3-r0-p1
  - Add docker push github workflow
- 0.98.0-r0
  - Auto update to 0.98.0-r0
- 0.99.0-r0
  - Auto update to 0.99.0-r0
<!--CHANGE-LOG-END-->

The MIT License

Copyright (c) 2022

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
OFTWARE.
