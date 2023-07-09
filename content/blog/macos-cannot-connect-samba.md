---
type: "blog"
date: 2019-08-27T18:20:10-04:00
author: "John Siu"
title: "MacOS Cannot Connect Samba"
description: "MacOS Cannot Connect Samba workaround."
tags: ["macos","samba"]
---
It suddenly stop working ... and luckily I got it fix.
<!--more-->

> As of 2023, MacOS 13 (Ventura) samba support is stable and work smoothly by just clicking the network section in finder. If you have issue connecting to a samba share, check [Samba Config](//blog/conf-samba) first.

---

### SMB Connection

From time to time I use Finder ⌘-k __Connect to Server__, or directly from  to connect to the few Samba folders I have around, and all of them are saved in following format:

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

> Following is solution for pre-2020 MacOS and samba setup. Newer samba ( > 4.15.x) may not work with connection using `cifs://` from Finder `Connect to Server` dialog.

I did a lot of searches but they either are old (>1yr) issues or doesn't apply in my situation.

I came across a few neat tricks like using __dtruss__, a system call tracing tools. But I don't want to turn off system integrity protection(required to use dtruss) just because of share folder issue.

Then I tried one last thing, use __cifs://__ instead of __smb://__:

```sh
cifs://<hostname>/homes
```

That works!! I am not sure why __smb://__ suddenly stop working. But I am happy the share drive is connecting again.
