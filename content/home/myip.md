---
author: "John Siu"
date: 2020-08-06T15:29:03-04:00
description: "MyIP page using Hugo and Caddy."
prevnext : false
related: false
tags: ["caddy","gohugo","hugo","myip","ip"]
title: "My IP"
type: "home"
---
Show me the IPs.
<!--more-->

### IP via Caddy Templates

This maybe IPv4 or IPv6.

|IP|
|---|
|{{.RemoteIP}}|

### IP via Javascript

|IPv4|IPv6|
|---|---|
|<div id="myip4">Not Available</div>|<div id="myip6">Not Available</div>|

### How This Is Done

- [Hugo - Create My IP Page With Caddy](/blog/hugo-caddy-myip/)
- [Hugo - My IP Page With Javascript](/blog/hugo-caddy-myip-js/)

---

<script src="/js/my.js"></script>
<script>
myip(4)
myip(6)
</script>