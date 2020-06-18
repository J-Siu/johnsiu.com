---
type: blog
date: 2019-07-30T22:01:30-04:00
author: "John Siu"
title: "Mac OS Commands"
description: "Mac OS command cheat sheet."
tags: ["macos","cheatsheet"]
aliases:
  - /cheatsheet/macos-commands
---
Some Mac OS commands.
<!--more-->

### Play audio file

```sh
afplay <file>
```

### Plist content

```sh
plutil -p <file>
```

### Launch Control

```sh
launchctl list # List services
launchctl load <plist file> # Start service
launchctl unload <plist file> # Stop service
```

#### System Service Location

- `/Library/LaunchDaemons/`
- `/System/Library/LaunchDaemons/`

### Change Hostname

```sh
sudo scutil --set HostName <hostname>
```

### Mouse Speed

- Get Current

```sh
defaults read -g com.apple.mouse.scaling
```

- Set New value

```sh
defaults write -g com.apple.mouse.scaling your_mouse_speed
```

> May need reboot.

### dns-sd(mdns)

Get address of hostname

```sh
dns-sd -G v4v6 <hostname>
```

### Kernel Extension

- List all kernel extension

```sh
kextstat
```

- List all non-Apple extension

```sh
kextstat | grep -v com.apple
```

### Safe Mode

Hold down <kbd>Shift</kbd> during boot.

Using command line:

```sh
sudo nvram boot-args="-x"
sudo nvram boot-args="-x -v"
```

Change back to normal:

```sh
sudo nvram boot-args=""
```

### Toggle Hidden File in Finder

- <kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>

### Network Setup Command

Help

```sh
networksetup
```

List all network service

```sh
networksetup -listallnetworkservices
```

Turn network service on/off

```sh
networksetup -setnetworkserviceenabled <networkservice> <on off>
networksetup -setnetworkserviceenabled Ethernet off
networksetup -setnetworkserviceenabled Ethernet on
```
