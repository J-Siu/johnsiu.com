---
author: "John Siu"
date: 2020-06-17T18:04:07-04:00
description: "Blog automation using Jenkins."
tags: ["jenkins","cicd","gohugo","hugo"]
title: "Jenkins Blog Automation"
type: "blog"
---
Automate site generation with Jenkins.
<!--more-->

### In The Past

My blog workflow is as follow:

1. Write articles
2. Proof read
3. Git commit and push remote
4. Execute Hugo
5. Rsync Hugo **public** to my VPS

Though I used to have aa single zsh function for step 4 and 5 taking care of permission, change directory, and eliminate potential fat finger, it no longer fit with the new docker setup on the VPS server.

I want them automated whenever I push to Github.

### Preparation

- [Hugo Container](/blog/docker-hugo/) I need a docker container to pull my blog repository, execute Hugo and update my web server docker volume.
- [Webhook](/blog/jenkins-webhook/) The webhook trigger my Jenkins project.
- [Jenkins SSH Site](/blog/jenkins-sshkey-old-format/) Setup Jenkins ssh site for my VPS.

### The Build Step

Once the above are ready, I created a **Freestyle project**:

- Source Code Management, select **Git** and put in my site repository information
- Build Triggers, select **GitHub hook trigger for GITScm polling** to enabled webhook
- Build Step, choose **Execute shell script on remote host using ssh**, select my web server in **SSH site** drop down
- Command:

  ```sh
  docker run --rm --name ${JOB_NAME}_${BUILD_NUMBER} --network host \
  -v CADDY_WWW:/www \
  -e P_TZ=America/New_York \
  -e MY_GIT_URL=https://github.com/J-Siu/johnsiu.com.git \
  -e MY_GIT_SUB=true \
  -e MY_GIT_DIR=/www/repo/johnsiu.com \
  -e MY_PUB_DIR=/www/site/johnsiu.com \
  jsiu/hugo --cleanDestinationDir --minify
  ```

  I use git sub-module for theme. If you don't have sub-module, you can remove line 5.

### Caddy Setup

`docker-compose.yml`

```yml
version: "3.7"

services:
  caddy:
    restart: unless-stopped
    logging:
      options:
        tag: "{{.Name}}"
    image: caddy
    container_name: caddy
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./caddyfile:/etc/caddy/Caddyfile
      - CADDY_DAT:/data
      - CADDY_WWW:/www:ro
volumes:
  CADDY_DAT:
    external: true
  CADDY_WWW:
    external: true
```

`caddyfile`

```json
johnsiu.com {
	root * /www/johnsiu.com/public
	file_server
}
```

### Conclusion

So far this is running smoothly and the article you are reading now also went through this workflow.

This also mark the completion of my VPS dockerization project. Cheers everyone!