---
author: "John Siu"
date: 2020-08-15T03:12:50-04:00
description: "My IP page with javascript for both IPv4 and IPv6."
tags: ["caddy","gohugo","hugo","cheatsheet","myip","javascript","how-to","ip"]
title: "Hugo - My IP Page With Javascript"
type: "blog"
---
Get both IPv4 and IPv6.
<!--more-->

[Hugo - Create My IP page with Caddy"](/blog/hugo-caddy-myip/) showed how to use Caddy templates with Hugo to create a my-ip page.

However that can only display either IPv4 or IPv6 at a time. To get both at the same time, we have to cheat(if you are a markdown purist) a bit with html and javascript, with DNS settings.

### Prerequisite

- Server hosting the site must have public IPv4 and IPv6 addresses.
- Caddy must be accepting both IPv4 and IPv6 traffic.

### DNS

Usually for site with IPv4 and IPv6, dns will be setup like following so traffic can come in either way:

```sh
@ A    <IPv4 address>
@ AAAA <IPv6 address>
```

However for our purpose, we need to separate them as follow:

```sh
myip4 A    <IPv4 address>
myip6 AAAA <IPv6 address>
```

That ensure traffic come in through `myip4` will always use IPv4, and the same for `myip6`. Take this site as example:

```sh
$ host myip4.jsiu.dev
myip4.jsiu.dev has address 192.243.103.172

$ host myip6.jsiu.dev
myip6.jsiu.dev has IPv6 address 2607:8b00:0:96::4d56:8d34
```

Once the above is ready, we can configure Caddy server.

### Caddyfile

```apache
myip4.jsiu.dev myip6.jsiu.dev {
  encode gzip
  file_server
  root * /www/site/johnsiu.com/myip
  templates /
}
```

> Caddy v2 CROS config example [here](/blog/caddyfile/#cros).

As mentioned in previous article, `static/myip/index.html` is already there:

```handlebars
{{.RemoteIP}}
```

Restart Caddy and test:

```sh
$ curl https://myip4.jsiu.dev/
67.246.177.16

$ curl https://myip6.jsiu.dev/
2604:6000:7c02:8c07:5d10:846e:ad27:6b3e
```

That confirms the text version is working.

### Hugo Page

Update our Hugo page `content/home/myip.md`:

```md
### IP via Caddy Templates

{{.RemoteIP}}

### IP via Javascript

#### IPv4

<div id="myip4">Not Available</div>

#### IPv6

<div id="myip6">Not Available</div>
```

`{{.RemoteIP}}` will continue to work as Caddyfile was setup last time. In order to fill in IPv4 and IPv6 addresses, add following script section at the end of `content/home/myip.md`:

```html
<script>
function myip(ipv){
  fetch('//myip'+ipv+'.jsiu.dev/')
    .then(r=>r.text())
    .then(t=>document.getElementById('myip'+ipv).innerHTML=t)
}
myip(4)
myip(6)
</script>
```

The final result is [here](/home/myip/).