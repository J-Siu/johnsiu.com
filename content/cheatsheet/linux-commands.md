---
type: "Cheat Sheet"
date: 2019-07-30T18:06:21-04:00
author: "John Siu"
title: "Linux Commands"
description: "Linux command cheat sheet."
tags: ["linux","cli","cheat sheet"]
draft: false
---
Misc. Linux commands.
<!--more-->

#### Current directory

```sh
echo ${PWD##*/}
```

#### Find x-days before and action

```sh
/bin/find <path> -maxdepth 1 -mtime +<x> -type f -name "<pattern>" -exec rm -f {} \;
```

#### Find x-minutes before and action

```sh
/bin/find <path> -maxdepth 1 -mmin +<x> -type f -name "<pattern>" -exec rm -f {} \;
```

#### Change password last modify

```sh
chage -d YYYY-MM-DD <user>
```

#### Change password never expire

```sh
chage -I -1 -m 0 -M 99999 -E -1 <user>
```

#### Fail2ban ban ip manually

```sh
fail2ban-client status # show jail list
fail2ban-client -vvv set <jail from list> banip <ip>
```

#### zsh range for loop

```sh
for i in {1..10};do .....
```

#### bash string comparison

```sh
if [ "$str" = "string" ]; then ...
```

#### bash/zsh numeric comparison

```sh
if [[ ${A} = 3 ]]; then echo yes; fi
```

#### Disable journal on ext4

```sh
tune2fs -O ^has_journal /dev/<disk>
```

#### Rotate frame buffer

```sh
echo 1 > /sys/class/graphics/fbcon/rotate_all
echo 1 > /sys/class/graphics/fbcon/rotate
```

#### Show all mDNS/Bonjour entries

```sh
avahi-browse -a
avahi-browse -a -d <domain> # specify domain other than .local
```

#### Create sparse file

`truncate -s <size> <filename>`

```sh
$ truncate -s 10G 10G.txt

$ ls -lah 10G.txt
-rw-r--r--    1 user user   10.0G Apr  1 00:00 10G.txt

$ du -sh 10G.txt
0       10G.txt
```

Ref: https://wiki.archlinux.org/index.php/Sparse_file