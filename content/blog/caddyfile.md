---
type: "blog"
date: 2020-06-26T05:10:33-04:00
author: "John Siu"
title: "Caddy 2 Caddyfile Usage"
description: "Caddy 2 Caddyfile usage examples."
tags: ["caddy","cheatsheet"]
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
	root * /www/example.com
	file_server
	handle_errors {
		rewrite * /{http.error.status_code}.html
		file_server
	}
}
```

### Template

Create your own `myip` page.

`/www/example.com/myip/index.html`

```html
{{.RemoteIP}}
```

Caddy will parse all files:

```nginx
www.example.com {
	root * /www/example.com
	file_server
	templates
}
```

Caddy will parse files in `/www/example.com/myip/`:

```nginx
www.example.com {
	root * /www/example.com
	file_server
	templates /www/example.com/myip/
}
```

Caddy will only parse `/www/example.com/myip/index.html`:

```nginx
www.example.com {
	root * /www/example.com
	file_server
	templates /www/example.com/myip/index.html
}
```

### Header

```nginx
www.example.com {
  root * /www/example.com
  file_server
  header Access-Control-Allow-Origin *
  header Cache-Control max-age=3600
  header /css/* Cache-Control max-age=604800
}
```

### Import

Caddy v2.1+ allow common section to be factored out (snippet) and re-used by different sections.

Following is a snippet for Cache-Control:

```nginx
(cache_ctl) {
	header /css/* Cache-Control max-age=3600
	header /img/* Cache-Control max-age=3600
	header /js/* Cache-Control max-age=3600
}
```

Following is a snippet for site options:

```nginx
(site_option) {
	encode gzip
	file_server
	handle_errors {
		rewrite * /{http.error.status_code}.html
		file_server
	}
}
```

Use above in site sections:

```nginx
example1.com {
  import site_option
  import cache_ctl
}

example2.com {
  import site_option
  import cache_ctl
}
```

Also check out example in [CROS](#cros).

### CROS

- Single CROS

```nginx
api.example.com {
  root * /www/api.example.com
  file_server
	@site2 header Origin https://w3.example.com
	header @site2 Access-Control-Allow-Origin https://w3.example.com
}
```

- Multiple CROS

> Caddy v2.1+

```nginx
(cors) {
	@{args.0} header Origin {args.0}
	header @{args.0} Access-Control-Allow-Origin {args.0}
}

api.example.com {
  root * /www/api.example.com
  file_server
  import cors https://example.com
  import cors https://www.example.com
  import cors https://another.example.com
}
```