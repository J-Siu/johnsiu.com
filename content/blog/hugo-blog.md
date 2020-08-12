---
author: "John Siu"
date: 2019-07-21T18:28:57-04:00
description: "My Hugo blog zsh workflow."
tags: ["hugo","blog","zsh"]
title: "Hugo Blog"
type: "blog"
---

Finally get my Hugo Blog workflow iron out.
<!--more-->

### Ghost, Hugo and Markdown

Early 2017 I switched my blogging package from WordPress to Ghost.

I was attracted to Ghost due to its simplicity, low resource requirement, and most importantly the markdown syntax.

I started using markdown with GitHub. Nowadays I create all my documentation, notes in markdown. Typing them up in VSCode, I don't need the web GUI interface in Ghost.

Late last year I come across the term `static site generator`. After experimenting with different packages, I picked [Hugo](//gohugo.io/).

### Workflow

Hugo is a command line tool. There is no online/web GUI. It does have a steep learning curve during initial setup. However once I lock down my directory structure, theme, and all the commands I need, it become smooth and easy.

Following is the workflow in plan commands:

1. Create skeleton markdown file.

        cd <blog dir>
        hugo new blog/<new-postname>.md

2. Edit blog post in VSCode.

3. Test in browser

        hugo server -D

4. Publish to web server

        hugo
        rsync --stats -haz --delete public user@host:/home/user

#### zsh function

I put the publishing steps with a few enhancement into my zsh function:

```zsh
my-blog-deploy () {
  BLOG=<local blog dir>
  PUB=public # Unless you change your hugo config
  SSH_HOST=<user@host>
  SSH_HOME=</home/user>

  start_dir=$(pwd)

  echo --- Dir: ${BLOG}
  cd ${BLOG}

  hugo

  echo --- Fix ${PUB} permission
  chmod -R 750 ${PUB}
  find ${PUB} -type f -exec chmod ugo-x {} \;

  echo --- Rsync start
  rsync --stats -haz --delete ${PUB} ${SSH_HOST}:${SSH_HOME}

  echo
  echo --- Rsync done

  cd ${start_dir}
}
```

### Theme

It is always a pain to pick a new theme when switching packages. I finally settle on the current one, and modified it with AdSense. Following are the original and my fork:

- Original: [https://github.com/Vimux/Binario](https://github.com/Vimux/Binario)
- With AdSense: [https://github.com/J-Siu/Binario](https://github.com/J-Siu/Binario)

### Conclusion

The switch gives me a chance to review my blog writing, technique and post structure. It was a good experience, but not sure if I want another one anytime soon.
