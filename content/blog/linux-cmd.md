---
type: blog
date: 2019-07-30T18:06:21-04:00
author: "John Siu"
title: "Linux Commands"
description: "Linux command cheat sheet."
tags: ["linux","command-line","cheatsheet"]
---
Misc. Linux commands.
<!--more-->

---

### Find x-days before and action

> In actuality, it should be (x-1).

```sh
/bin/find <path> -maxdepth 1 -mtime +<x> -type f -name "<pattern>" -exec rm -f {} \;
```

### Find x-minutes before and action

```sh
/bin/find <path> -maxdepth 1 -mmin +<x> -type f -name "<pattern>" -exec rm -f {} \;
```

### Change password last modify

```sh
chage -d YYYY-MM-DD <user>
```

### Change password never expire

```sh
chage -I -1 -m 0 -M 99999 -E -1 <user>
```

### Lock/Unlock Account

```sh
passwd -l <user>  # Lock
passwd -u <user>  # Unlock

usermod -L <user> # Lock
usermod -U <user> # Unlock

pam_tally2 -r -u <user> # Reset fail login count
```

### Ban IP

#### IPTable

```sh
iptable -A INPUT -s <IP> -j DROP
ip6table -A INPUT -s <IP> -j DROP
```

#### Fail2ban

```sh
fail2ban-client status # show jail list
fail2ban-client -vvv set <jail from list> banip <ip>
```

### Disable journal on ext4

```sh
tune2fs -O ^has_journal /dev/<disk>
```

### Rotate frame buffer

Number can be 1, 2, 3

```sh
echo 1 > /sys/class/graphics/fbcon/rotate_all
echo 1 > /sys/class/graphics/fbcon/rotate
```

### Create Sparse File

`truncate -s <size> <filename>`

```sh
$ truncate -s 10G 10G.txt

$ ls -lah 10G.txt
-rw-r--r--    1 user user   10.0G Apr  1 00:00 10G.txt

$ du -sh 10G.txt
0       10G.txt
```

Ref: [Sparse file wikipedia](//wiki.archlinux.org/index.php/Sparse_file)

### Rsync

```sh
rsync -vahpt --size-only --stats --del <source> <target>
```

`<source>` is put/sync INTO `<target>` directory, not replacing `<target>`.

### Curl skip certificate checking

```sh
curl -k ... # Use -k to skip certificate check.
```

### Resize Filesystem

> Usually use after a partition / image resize

```sh
resize2fs <device>
resize2fs /dev/sda1
```

### Avahi/MDNS

#### Show All Entries

```sh
avahi-browse -a
avahi-browse -a -d <domain> # specify domain other than .local
```

#### IPv4 Lookup

```sh
avahi-resolve -n4 door.local
```

#### IPv6 Lookup

```sh
avahi-resolve -n6 door.local
```

### Check NIC status

```sh
ethtool <nic>
```

### Enable BBR

Create file `/etc/sysctl.d/10-network-bbr.conf` with following content and reboot:

```ini
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```

### Detect Text File Charset/Encoding

```sh
uchardet <file.txt>
```

### Convert Text File Charset/Encoding

```sh
iconv iconv -f <file charset> -t <output charset> <file.txt>
iconv iconv -f jis -t utf8 readme.txt
```

### SSH

#### Remove Known Hosts

```sh
ssh-keygen -R <hostname/ip>
ssh-keygen -f "~/.ssh/known_hosts" -R <hostname/ip>
```

#### ProxyCommand

```conf
host test
ProxyCommand ssh -W %h:%p jumpserver
```

#### ProxyJump

```conf
host test
ProxyJump jumpserver
```

### Journalctl

#### List Field

```sh
journalctl -N
```

#### List Identifier

Identifier value can be used in `-t`.

```sh
journalctl -F SYSLOG_IDENTIFIE
```