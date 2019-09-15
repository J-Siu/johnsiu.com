---
type: blog
date: 2019-07-30T22:01:30-04:00
author: "John Siu"
title: "Mac OS Commands"
description: "Mac OS command cheat sheet."
tags: ["macos","apple","cheatsheet"]
aliases:
  - /cheatsheet/macos-commands
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

##### System Service Location

- `/Library/LaunchDaemons/`
- `/System/Library/LaunchDaemons/`

#### Change Hostname

```sh
sudo scutil --set HostName <hostname>
```

#### Mouse Speed

- Get Current

```sh
defaults read -g com.apple.mouse.scaling
```

- Set New value

```sh
defaults write -g com.apple.mouse.scaling your_mouse_speed
```

> May need reboot.