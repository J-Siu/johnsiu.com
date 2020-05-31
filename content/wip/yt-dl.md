---
type: "blog"
date: 2020-04-25T08:14:00-04:00
author: "John Siu"
title: "Yt Dl"
description: ""
tags: [""]
draft: true
---
<!--more-->

```sh
alias youtube-dl-audio='youtube-dl --ignore-errors --output "%(title)s.%(ext)s" --extract-audio --audio-format mp3 --write-sub --sub-format srt'
```

```sh
youtube-dl \
--extract-audio \
--audio-format mp3 \
--write-sub \
--rm-cache-dir \
-o "%(autonumber)s %(title)s.%(ext)s" \
https://www.youtube.com/watch?list=PLIIOUpOge0LvT-g_LNsfX_2ld0pn-CDSZ
```

```sh
youtube-dl \
--flat-playlist \
https://www.youtube.com/watch?list=PLIIOUpOge0LvT-g_LNsfX_2ld0pn-CDSZ
```

youtube-dl \
--write-sub \
--rm-cache-dir \
-o "%(title)s.%(ext)s" \
https://youtu.be/eXP7ynpk1NY
