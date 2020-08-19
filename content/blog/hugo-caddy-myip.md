---
author: "John Siu"
date: 2020-08-06T18:28:51-04:00
description: "Hugo - Create My IP page with Caddy"
tags: ["caddy","hugo","cheatsheet","myip","how-to","ip"]
title: "Hugo - Create My IP Page With Caddy"
type: "blog"
---
There are websites that show your internet IP, ever want to create your own?
<!--more-->
Hugo is a static site generator, there is no server side processing once deployed. However Caddy v2 templates feature is giving this a twist.

Following is a simple way to create a fully themed Hugo "show my ip" page with Caddy v2 servers.

### Create Page

Create a new Hugo page:

```sh
hugo new page/myip.md
```

Inside `myip.md` with following content:

```Handlebars
---
title: "MY IP"
---

{{.RemoteIP}}
```

`{{.RemoteIP}}` is a Caddy template function[^1].

Create a menu entry in `config.toml`

```toml
[menu]
[[menu.main]]
name = "My IP"
url = "/home/myip/"
```

Generate and deploy your site.

### Caddy Server

In `caddyfile`, add following line inside your site config:

```apache
templates /home/myip/
```

The `templates` line tell caddy server to treat `/post/myip/` as a template[^2].

Take this site `caddyfile` as example:

```apache
johnsiu.com {
	encode gzip
	root * /www/site/johnsiu.com
	file_server
	handle_errors {
		rewrite * /{http.error.status_code}.html
		file_server
	}
	templates /home/myip/
}
```

Restart caddy server.

### Plain Text

You can also create a plain text version to be used by `curl` command as I shown in [How to Find My Public IP](/blog/myip/).

In Hugo site root, create `static/myip/intex.html`:

```Handlebars
{{.RemoteIP}}
```

Again, add templates line in `caddyfile`:

```apache
templates /myip/
```

Generate and deploy your site, restart caddy server.

Test from command line:

```sh
curl -4 https://johnsiu.com/myip/
curl -6 https://johnsiu.com/myip/
```

### Simultaneous IPv4 IPv6

[Hugo - My IP Page With Javascript](/blog/hugo-caddy-myip-js/) will explore how to show IPv4 and IPv6 at the same time.

[^1]: [Caddy template functions](//caddyserver.com/docs/modules/http.handlers.templates).
[^2]: [Caddy templates doc](//caddyserver.com/docs/caddyfile/directives/templates#templates).