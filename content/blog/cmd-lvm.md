---
type: blog
date: 2019-08-22T23:00:28-04:00
author: "John Siu"
title: "LVM Commands"
description: "LVM commands cheat sheet."
tags: ["lvm","cheatsheet"]
aliases:
    - /blog/lvm-cmd
---
Some LVM commands.
<!--more-->

### Display Virtual Group Info

```sh
vgdisplay
```

### Extend Virtual Disk

```sh
lvextend -L+99G /dev/ubuntu-vg/ubuntu-lv
lvextend -l+100%FREE /dev/ubuntu-vg/ubuntu-lv
# Manually extend filesystem after extending virtual disk
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
# -r : Auto extend filesystem after extending virtual disk
lvextend -l+100%FREE -r /dev/ubuntu-vg/ubuntu-lv
```
