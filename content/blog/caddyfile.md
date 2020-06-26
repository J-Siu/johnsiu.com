---
type: "blog"
date: 2020-06-26T05:10:33-04:00
author: "John Siu"
title: "Caddy 2 Caddyfile Usage"
description: "Caddy 2 Caddyfile usage examples."
tags: ["caddy","cheatsheet"]
draft: false
---
Some Caddy 2 Caddyfile examples.
<!--more-->

### Global Options

```nginx
{
	# Turn off admin port
	admin off
	# Turn on http3
	experimental_http3
}
```

### Multiple Domains

```nginx
www.example.com test.example.com {
	...
}
```

```nginx
old.example.com other.example.com {
	redir https://example.com{uri}
}
```

### Error Handling

```nginx
www.example.com {
	root * /www/site/www.example.com
	file_server
	handle_errors {
		rewrite * /{http.error.status_code}.html
		file_server
	}
}
```

### Template

Create your own `myip` page.

`/www/site/www.example.com/myip/index.html`

```html
{{.RemoteIP}}
```

Caddy will parse all files:

```nginx
www.example.com {
	root * /www/site/www.example.com
	file_server
	templates
}
```

Caddy will parse files in `/www/site/www.example.com/myip`:

```nginx
www.example.com {
	root * /www/site/www.example.com
	file_server
	templates /www/site/www.example.com/myip
}
```

Caddy will only parse `/www/site/www.example.com/myip/index.html`:

```nginx
www.example.com {
	root * /www/site/www.example.com
	file_server
	templates /www/site/www.example.com/myip/index.html
}
```