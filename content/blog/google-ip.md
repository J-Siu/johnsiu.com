---
type: blog
date: 2019-08-22T15:54:28-04:00
author: "John Siu"
title: "Google IP Addresses"
description: "Google IP Addresses"
tags: ["google","cheatsheet"]
draft: false
aliases:
  - /cheatsheet/google-ip
---
All Google IP addresses.
<!--more-->

### IPv4

|
|---
|35.190.247.0/24
|35.191.0.0/16
|64.233.160.0/19
|66.102.0.0/20
|66.249.80.0/20
|72.14.192.0/18
|74.125.0.0/16
|108.177.8.0/21
|108.177.96.0/19
|130.211.0.0/22
|172.217.0.0/19
|172.217.32.0/20
|172.217.128.0/19
|172.217.160.0/20
|172.217.192.0/19
|173.194.0.0/16
|209.85.128.0/17
|216.239.32.0/19
|216.58.192.0/19

### IPv6

|
|---
|2001:4860:4000::/36
|2404:6800:4000::/36
|2607:f8b0:4000::/36
|2800:3f0:4000::/36
|2a00:1450:4000::/36
|2c0f:fb50:4000::/36

### nslookup

```sh
nslookup -q=TXT _spf.google.com 8.8.8.8
nslookup -q=TXT _netblocks.google.com 8.8.8.8
nslookup -q=TXT _netblocks2.google.com 8.8.8.8
nslookup -q=TXT _netblocks3.google.com 8.8.8.8
```

### dig

```sh
dig @8.8.8.8 _spf.google.com txt
dig @8.8.8.8 _netblocks.google.com txt
dig @8.8.8.8 _netblocks2.google.com txt
dig @8.8.8.8 _netblocks3.google.com txt
```

### Reference

[Google IP address ranges for outbound SMTP](https://support.google.com/a/answer/60764)
