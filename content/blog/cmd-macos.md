---
author: "John Siu"
date: 2019-07-30T22:01:30-04:00
description: "John Siu's MacOS command cheat sheet."
tags: ["macos","command-line","cheatsheet"]
title: "MacOS Command Line"
type: blog
aliases:
    - /blog/macos-cmd
---
Some MacOS commands and keyboard shortcuts.
<!--more-->

### Keyboard Shortcut

Shortcut|Description
---|---
<kbd>Command</kbd>+<kbd>,</kbd>|Open preference of most app
<kbd>Command</kbd>+<kbd>.</kbd> or <kbd>ESC</kbd>|Click cancel in dialog
<kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>Left/Right</kbd>|Switch tab in app
<kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>|Show hidden file in finder
<kbd>Command</kbd>+<kbd>`</kbd>|Switch window of the same app
<kbd>Command</kbd>+<kbd>b</kbd>|Toggle sidebar in app
<kbd>Command</kbd>+<kbd>d</kbd>|Click `Don't Save` in dialog
<kbd>Command</kbd>+<kbd>h</kbd>|Hide app (not minimize)
<kbd>Command</kbd>+<kbd>m</kbd>|Minimize app
<kbd>Command</kbd>+<kbd>q</kbd>|Close active app
<kbd>Command</kbd>+<kbd>tab</kbd>|Switch app
<kbd>Command</kbd>+<kbd>w</kbd>|Close active tab of an app
<kbd>Option</kbd>+<kbd>ESC</kbd>|TTS selected text

Desktop Space

Shortcut|Description
---|---
<kbd>Ctrl</kbd>+<kbd>Up Arrow</kbd>|Select space
<kbd>Ctrl</kbd>+<kbd>Down Arrow</kbd>|Return to desktop

Un-minimize

Shortcut|Description
---|---
<kbd>Command</kbd>+<kbd>tab</kbd> -> (do not release <kbd>Command</kbd>) -> <kbd>Command</kbd>+<kbd>option</kbd>+<kbd>return</kbd>|Un-minimize app

### Run Application from Command Line

> Application name is case-sensitive. Use <kbd>tab</kbd> for auto-complete.

```sh
open -a <application>
open -a Google\ Earth\ Pro
```

### Launch Control

- List all services

  ```sh
  launchctl list # List services
  launchctl load <plist file> # Start service
  launchctl unload <plist file> # Stop service
  ```

- List all 3rd-party(non-Apple) services

  ```sh
  launchctl list|grep -v com.apple.
  ```

- System Service Location
  - `/Library/LaunchDaemons/`
  - `/System/Library/LaunchDaemons/`

### Memory Usage

Result is in page number. Multiply with page size show at the top.

```sh
vm_stat
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

### Plist Content

```sh
plutil -p <file>
```

### Safe Mode

Hold down <kbd>Shift</kbd> during boot.

> Command line may not work anymore.

- Enable

  ```sh
  sudo nvram boot-args="-x"
  sudo nvram boot-args="-x -v"
  ```

- Disable

  ```sh
  sudo nvram boot-args=""
  ```

### Network Setup Command

- Help

  ```sh
  networksetup
  ```

- List all network service

  ```sh
  networksetup -listallnetworkservices
  ```

- Turn network service on/off

  ```sh
  networksetup -setnetworkserviceenabled <networkservice> <on off>
  networksetup -setnetworkserviceenabled Ethernet off
  networksetup -setnetworkserviceenabled Ethernet on
  ```

### Change Hostname

```sh
sudo scutil --set HostName <hostname>
```

### dns-sd (mdns/avahi/bonjour)

Get address of hostname

```sh
dns-sd -G v4v6 <hostname>
```

### Mouse Speed

- Get

  ```sh
  defaults read -g com.apple.mouse.scaling
  ```

- Set

  > May need reboot.

  ```sh
  defaults write -g com.apple.mouse.scaling your_mouse_speed
  ```

### Play Audio

```sh
afplay <file>
```

### Play Text (TTS)

Check available voices and languages

```sh
say -v \?
```

TTS

```sh
say <text>
```

Specify voice and language

```sh
say -v Flo\ \(Chinese\ \(Taiwan\)\) 你好
```

### Disable Spotlight Index

Index status for a directory

```sh
mdutil -s .
```

Disable indexing for a directory

```sh
cd <dir>
touch .metadata_never_index
```