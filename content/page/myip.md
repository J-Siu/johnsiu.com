---
author: "John Siu"
date: 2020-08-06T15:29:03-04:00
description: "My IP page"
tags: ["caddy","hugo","myip"]
title: "My IP"
toc: true
type: "page"
---
Show my IP.
<!--more-->
---

### IP via Javascript

#### IPv4

<div id="IPv4">Not Available</div>

#### IPv6

<div id="IPv6">Not Available</div>

### IP via Caddy Templates

{{.RemoteIP}}

---

<script>
function myip(ipv,url){
  fetch(url)
    .then(r=>r.text())
    .then(t=>document.getElementById(ipv).innerHTML=t)
}
myip('IPv4','https://myip4.jsiu.dev/')
myip('IPv6','https://myip6.jsiu.dev/')
</script>