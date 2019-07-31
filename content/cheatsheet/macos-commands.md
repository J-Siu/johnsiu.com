---
type: "Cheat Sheet"
date: 2019-07-30T22:01:30-04:00
author: "John Siu"
title: "Mac OS Commands"
description: "Mac OS command cheat sheet."
tags: ["macos","cheat sheet"]
draft: false
---
Some Mac OS commands.
<!--more-->
#### Plist content

```sh
plutil -p <filename>
```

#### Launch Control

```sh
launchctl list # List services
launchctl load <plist file> # Start service
launchctl unload <plist file> # Stop service
```

##### System Service Files

- `/Library/LaunchDaemons/`
- `/System/Library/LaunchDaemons/`