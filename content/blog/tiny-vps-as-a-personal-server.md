---
author: "John Siu"
date: 2012-12-02T06:59:25Z
description: "Tiny VPS as a personal server."
tags: ["tiny","lighttpd", "ubuntu", "mysql", "vps"]
title: "Tiny VPS as a personal server"
type: "blog"
---

[VPS (Virtual Private Server)](//en.wikipedia.org/wiki/Virtual_private_server) is getting more and more affordable today, even for personal use.
<!--more-->

It is cheaper than getting a new machine (or old one), running it year round at home, hoping the power never go off and the hard driver never die. So I decided to get one for myself and this is my little journey of setting it up.

### Picking a provider …

[CrownCloud](//crowncloud.net/openvz.html) was my original choice as my colleague is using one. But they ran out of stock. After some googling, I settle with [VPSCheap.net](//vpscheap.net/) 128M 10G storage plan. I thought if my colleague can do it, I can too … not really …

### What will be running?

- WordPress for this blog
- Apache Web Server
- MySQL for WordPress
- [Collectd](//collectd.org/) with [CollectdWeb](//collectdweb.appspot.com/)for performance monitoring
- fail2ban for ssh protection
- sendmail/postfix for email handling

### Unwrapping the new toy – Setup #1

As a long time Linux administrator, for years spoiled by servers with multiple gigabyte of ram and huge storage space, my 1st choice of OS for my new toy is Ubuntu 12 64bit. Bad choice!!

Long story short, with apache, collectd, sendmail, fail2ban running , I cannot get mysql server install correctly.

The reason, after some investigation, out of memory!! Time for research!!

Setup #1 result : failed …

### Lesson from research – Don’t be greedy!

- Mysql need a tiny tweak – turn off innodb if not needed
- Swap apache out with nginx or lighttpd
- In a small world(box), 64bit is your enemy, 32bit is your friend

### Unwrap again – Setup #2

After some experiments, it is obvious that 128M is not going to give me what I want, even running 32bit OS. Time to upgrade …

End result as follow

- VPS with 256M
- Ubuntu 10 32bit
- Lighttpd
- MySQL
- fail2ban
- sendmail
- collectd

You may wonder if it is possible without the upgrade. The answer is yes, but I will have to give up collectd, sendmail, fail2ban. You know my final decision.
