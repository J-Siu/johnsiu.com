---
type: "Cheat Sheet"
date: 2019-08-23T00:39:48-04:00
author: "John Siu"
title: "apt-cache-ng"
description: ""
tags: ["apt-cache-ng","ubuntu","how-to"]
draft: true
---
<!--more-->
lvextend -l+100%FREE /dev/ubuntu-vg/ubuntu-lv
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv

apt install avahi-utils apt-cacher-ng
vim /etc/apt-cacher-ng/acng.conf
echo 'Acquire::http::Proxy "http://u64s-util.local:3142";' > /etc/apt/apt.conf.d/00proxy
systemctl restart apt-cacher-ng.service
apt update; apt -y dist-upgrade

echo 'GRUB_CMDLINE_LINUX="ipv6.disable=1"' >> /etc/default/grub
echo 'GRUB_CMDLINE_LINUX_DEFAULT="ipv6.disable=1"' >> /etc/default/grub
update-grub
timedatectl set-timezone EST
apt -y remove cloud-* snapd pollicate
apt -y install avahi-utils
echo 'Acquire::http::Proxy "http://u64s-util.local:3142";' > /etc/apt/apt.conf.d/00proxy
