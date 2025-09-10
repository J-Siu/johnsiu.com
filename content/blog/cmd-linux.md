---
author: "John Siu"
date: 2019-07-30T18:06:21-04:00
description: "Linux command cheat sheet."
tags: ["linux","command-line","cheatsheet"]
title: "Linux Commands"
type: blog
aliases:
    - /blog/linux-cmd
---
Misc. Linux commands.
<!--more-->

---

### Account
#### Last Modify
```sh
chage -d YYYY-MM-DD <user>
```
#### Password Never Expire
```sh
chage -I -1 -m 0 -M 99999 -E -1 <user>
```
#### Lock/Unlock
```sh
passwd -l <user>  # Lock
passwd -u <user>  # Unlock

usermod -L <user> # Lock
usermod -U <user> # Unlock
```
#### Reset Fail Login
```sh
pam_tally2 -r -u <user>
```
#### Sudo NOPASSWD
In `/etc/sudoers`, add `NOPASSWD` to sudo group.
```sh
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

### File
#### Find
Find x-days before and action
> In actuality, it should be (x-1).
```sh
/bin/find <path> -maxdepth 1 -mtime +<x> -type f -name "<pattern>" -exec rm -f {} \;
```
Find x-minutes before and action
```sh
/bin/find <path> -maxdepth 1 -mmin +<x> -type f -name "<pattern>" -exec rm -f {} \;
```
#### Content Type
```sh
file <filename>
```
#### Image Info
```sh
magick identify <filename>
```
#### Text File Charset/Encoding
##### Detect
```sh
uchardet <file.txt>
```
##### Convert
```sh
iconv iconv -f <file charset> -t <output charset> <file.txt>
iconv iconv -f jis -t utf8 readme.txt
```
#### Symlink Dereference
```sh
readlink <filename>
readlink -f <filename> # Dereference full path
```

### File System
#### Resize Filesystem
> Usually use after a partition / image resize
```sh
resize2fs <device>
resize2fs /dev/sda1
```
#### Disable journal on ext4
```sh
tune2fs -O ^has_journal /dev/<disk>
```
#### Create Sparse File
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
rsync -v -a -h -p -t --size-only --stats --del <source> <target>
```
`<source>` is put/sync INTO `<target>` directory, not replacing `<target>`.

### SSH
#### Remove Known Hosts
```sh
ssh-keygen -R <hostname/ip>
ssh-keygen -f "~/.ssh/known_hosts" -R <hostname/ip>
```
#### ProxyCommand
```conf
host test
ProxyCommand ssh -W %h:%p jump_server
```
#### ProxyJump
```conf
host test
ProxyJump jump_server
```

### Network
#### Avahi/MDNS
##### Show All Entries
```sh
avahi-browse -a
avahi-browse -a -d <domain> # specify domain other than .local
```
##### Lookup
```sh
avahi-resolve -n4 door.local
avahi-resolve -n6 door.local
```
#### Ban IP
##### IPTables
```sh
iptables -A INPUT -s <IP> -j DROP
ip6tables -A INPUT -s <IP> -j DROP
```
##### Fail2ban
```sh
fail2ban-client status # show jail list
fail2ban-client -vvv set <jail from list> banip <ip>
```
#### Check NIC status
```sh
ethtool <nic>
```
#### Check WiFi SSID
```sh
iw dev <wifi nic> scan
iw dev wlan0 scan
```
#### Curl
##### Skip certificate checking
```sh
curl -k ... # Use -k to skip certificate check.
```
##### DNS Over HTTPS
```sh
curl -sH 'accept: application/dns-json' 'https://dns.google/resolve?name=google.com' | jq .
curl -sH 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=google.com' | jq .
```
#### Enable BBR
Create file `/etc/sysctl.d/10-network-bbr.conf` with following content and reboot:
```ini
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```
#### Test Connection UDP
```sh
nc -z -v -u [hostname/IP address] [port number]
nc -z -v -u 8.8.8.8 53
```

### Journalctl
List all field names
```sh
journalctl -N
```
List all values for a field name
```sh
journalctl -F <field name>
```

### Terminal

#### Get Size
Return ROW x COL
```sh
stty size
```

### Timeout
```sh
timeout <duration> <command ...... >
timeout 1d tcpdump -n -i eth0 port 22 -s 65535 -w ssh_dump.cap &
nohup timeout 1d tcpdump -n -i eth0 port 22 -s 65535 -w ssh_dump.cap &
```

### Rotate Frame Buffer
Number can be `1`, `2`, `3`
```sh
echo 1 > /sys/class/graphics/fbcon/rotate_all
echo 1 > /sys/class/graphics/fbcon/rotate
```
