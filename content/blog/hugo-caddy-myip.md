---
author: "John Siu"
date: 2020-08-06T18:28:51-04:00
description: "Hugo - Create My IP page with Caddy"
tags: ["caddy","hugo","cheatsheet","myip"]
title: "Hugo - Create My IP page with Caddy"
type: "blog"
---
There are websites that show your internet IP, ever want to create your own?
<!--more-->
Following is a simple way to create a "show my ip" page in with Hugo and Caddy V2 servers.

### Create Page

Create a new Hugo page:

```sh
hugo new post/myip.md
```

Inside `myip.md` with following content:

```md
---
title: "MY IP"
---

{{.RemoteIP}}
```

`{{.RemoteIP}}` is a Hugo template functions. More functions can be found [here](https://caddyserver.com/docs/modules/http.handlers.templates).

Generate and deploy your site.

### Caddy Server

In `caddyfile`, add following line inside your site config:

```apache
templates /post/myip/
```

The `templates` line tell caddy server to treat `/post/myip/` as a template. Caddy doc is [here](https://caddyserver.com/docs/caddyfile/directives/templates#templates).

Take this site `caddyfile` as example:

```apache
int.jsiu.dev stg.jsiu.dev {
	encode gzip
	root * /www/site/johnsiu.com
	file_server
	handle_errors {
		rewrite * /{http.error.status_code}.html
		file_server
	}
	templates /page/myip/
}
```

I put `myip` in `page` section and created a menu entry for it.

### Plain Text

You can also create a plain text version to be used by `curl` command as I shown in [How to Find My Public IP](/blog/my-ip/).

In Hugo site root, create `static/myip/intex.html`:

```md
{{.RemoteIP}}
```

Again, add templates line in `caddyfile`:

```apache
templates /myip/
```

Generate and deploy your site, restart caddy server.

Test from command line:

```sh
curl https://johnsiu.com/myip/
```
