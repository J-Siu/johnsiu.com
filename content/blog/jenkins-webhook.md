---
author: "John Siu"
date: 2020-06-16T03:32:11-04:00
description: "Jenkins Github/Gogs Webhooks Configuration"
tags: ["jenkins","cicd","webhook","gogs","github"]
title: "Jenkins - Gogs/Github Webhook"
type: "blog"
---
How to set them up.
<!--more-->

### Jenkins Plugins

In `Manage Jenkins` -> `Manage Plugins` -> `Available`, install the required plugins.

Git Platform|Plugins
---|---
Github|GitHub plugin
Gogs|Gogs plugin

### 1. GitHub Webhook

> Before setting up github webhook, check your Jenkins end point(URL) is IPv4 reachable. At the time of this post (2020-06-16), GitHub webhook does not work with IPv6 only URL.

#### 1.1 On Jenkins

- Go to or create your freestyle project
- For existing project, go to `Configure`
- `Source Code Management`, select `Git`
  - `Repositories`: Fill in your repository URL, this can be HTTP(S) with or without `.git` at the end, or `SSH` clone URL.
  - `Credentials`
    - `None` if repo is public and HTTP(S) url is used above.
    - You will need Github token for private repo HTTP(s) url.
    - You will need ssh key for SSH url, even repo is public.
- `Build Triggers`, check mark `GitHub hook trigger for GITScm polling`
- Click `Apply`.

#### 1.2 On GitHub

- Go to your repository
- Go to `Settings`
- Go to `Webhooks`
- Go to `Add webhook`
- Fill in following
  - `Payload URL`: https://\<your jenkins url\>/github-webhook/
  - `Content type`: both `application/json` and `application/x-www-from-urlencoded` work.
  - `Secret`: Leave empty.
  - `Just the push event`: This is properly what you want.
  - `Active`: Should be check marked already.
- Click `Add webhook`

You will be back to `Webhooks` page and see your new webhook listed there. There will be a green check mark if webhook is working.

### 2. Gogs Webhook

#### 2.1 On Jenkins

- Go to or create your freestyle project
- For existing project, go to `Configure`
- `Gogs Webhook`
  - Check mark `Use Gogs secret` and fill in `Secret` if you are going to use secret.
- `Source Code Management`, select `Git`
  - `Repositories`: Fill in your repository URL, this can be HTTP(S) with or without `.git` at the end, or `SSH` clone URL.
  - `Credentials`
    - `None` if repo is public and HTTP(S) url is used above.
    - You will need Gogs token for private repo HTTP(s) url.
    - You will need ssh key for SSH url, even repo is public.
- `Build Triggers`, check mark `Build when a change is pushed to Gogs`
- Click `Apply`.

#### 2.2 On GitHub

- Go to your repository
- Go to `Settings`
- Go to `Webhooks`
- Go to `Add a new webhook:`, choose `Gogs`
- Fill in following
  - `Payload URL`: https://\<your jenkins url\>/gogs-webhook/?job=\<project name / pipeline name\>
    - Gogs webhook will fail without `?job=<project name /pipeline name>`
  - `Content type`: `application/json`. Jenkins Gogs plugin does not support `application/x-www-from-urlencoded`.
  - `Secret`: Fill in same secret as in Jenkins if used.
  - `Just the push event`: This is properly what you want.
  - `Active`: Should be check marked already.
- Click `Add webhook`
- You will be back to `Webhooks` page and see your new webhook listed there. Click the new webhook.
- Click `Test Delivery` to verify.