---
type: "blog"
date: 2019-07-25T00:51:36-04:00
author: "John Siu"
title: "Use Github/Gogs Api To Create Repo"
description: "Gogs implemented Github api. The only different is the URL."
tags: ["github","gogs","api","zsh"]
draft: false
---

Gogs implemented Github api. The only different is the URL.
<!--more-->

### Token

No matter you are using Gogs or Github, you have to login your account and generate a token.

#### Gogs

Go into ***Settings*** -> ***Applications***, then click ***Generate New Token***.

#### Github

Go into ***Settings*** -> ***Developer settings*** -> ***Personal access tokens***, then click ***Generate new token***.

In both cases, copy&paste the token into a file right away. We will need it in our script/function below.

### zsh function

```zsh
create_new_repo(){

  REPO=$1

  TOK="Your token here"

  # Gogs url
  #URL="https://<your gogs domain>/api/v1"

  # Github url
  #URL="https://api.github.com"

  REQ="{\"name\":\"${REPO}\"}"

  curl \
  -H "Content-Type: application/json" \
  -H "Authorization: token ${TOK}" \
  -d "${REQ}" \
  ${URL}/user/repos
}
```

The only difference between gogs and github is the `URL`. Gogs need `/api/v1` in its url, while github uses `api` sub-domain. Uncomment the one you want to use.

Add function in `.zshrc` and use as follow:

```zsh
create_new_repo <repo_name>
```