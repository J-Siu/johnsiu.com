---
author: "John Siu"
date: 2020-08-06T15:29:03-04:00
description: "MyIP page using Hugo and Caddy."
tags: ["caddy","hugo","myip"]
title: "My IP"
toc: true
type: "home"
---
Show me the IPs.
<!--more-->

### IP via Caddy Templates

{{.RemoteIP}}

### IP via Javascript

#### IPv4

<div id="myip4">Not Available</div>

#### IPv6

<div id="myip6">Not Available</div>

### How This Is Done

- [Hugo - Create My IP Page With Caddy](/blog/hugo-caddy-myip/)
- [Hugo - My IP Page With Javascript](/blog/hugo-caddy-myip-js/)

---

<script>
function myip(ipv){
  fetch('//myip'+ipv+'.jsiu.dev')
    .then(r=>r.text())
    .then(t=>document.getElementById('myip'+ipv).innerHTML=t)
}
myip(4)
myip(6)
</script>