---
type: "blog"
date: 2019-08-27T18:20:10-04:00
author: "John Siu"
title: "MacOS Cannot Connect Samba"
description: ""
tags: ["macos","samba"]
draft: false
---
It suddenly stop working ... and luckily I got it fix.
<!--more-->

---

### SMB Connection

From time to time I use Finder ⌘-k __Connect to Server__ to connect to the few Samba folders I have around, and all of them are saved in following format:

```sh
smb://<hostname>/homes
```

Then suddenly they all stopped working. I tried a few different ways:

```sh
smb://<user>@<hostname>/homes
smb://<IP>/homes
...
```

They all refused to connect.

### CIFS:// vs SMB://

I did a lot of searches but they either are old (>1yr) issues or doesn't apply in my situation.

I came across a few neat tricks like using __dtruss__, a system call tracing tools. But I don't want to turn off system integrity protection(required to use dtruss) just because of share folder issue.

Then I tried one last thing, use __cifs://__ instead of __smb://__:

```sh
cifs://<hostname>/homes
```

That works!! I am not sure why __smb://__ suddenly stop working. But I am happy the share drive is connecting again.
