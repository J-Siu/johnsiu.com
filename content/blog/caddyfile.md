---
type: "blog"
date: 2020-06-26T05:10:33-04:00
author: "John Siu"
title: "Caddy 2 Caddyfile Usage"
description: "Caddy 2 Caddyfile usage examples."
tags: ["caddy","caddyfile","cheatsheet","redirect","proxy"]
---
Some Caddy v2 Caddyfile examples.
<!--more-->

### Global Options

```nix
{
  # Turn on all debug log
  debug
  # Setup default sni
  default_sni example.com
  # Turn off admin port
  admin off
  # Turn on http3
  experimental_http3
}
```

### Multiple Domains

```nix
www.example.com test.example.com {
  ...
}
```

```nix
old.example.com other.example.com {
  redir https://example.com{uri}
}
```

### Error Handling

```nix
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

```nix
www.example.com {
  root * /www/example.com
  file_server
  templates
}
```

Caddy will parse files in `/www/example.com/myip/`:

```nix
www.example.com {
  root * /www/example.com
  file_server
  templates /www/example.com/myip/
}
```

Caddy will only parse `/www/example.com/myip/index.html`:

```nix
www.example.com {
  root * /www/example.com
  file_server
  templates /www/example.com/myip/index.html
}
```

### Header

```nix
www.example.com {
  root * /www/example.com
  file_server
  header Access-Control-Allow-Origin *
  header Cache-Control max-age=3600
  header /css/* Cache-Control max-age=604800
}
```

### Snippet / Import

Caddy v2.1+ allow common section to be factored out (snippet) and re-used by different sections.

#### Cache-Control

```nix
(cache_ctl) {
  header /css/* Cache-Control max-age=3600
  header /img/* Cache-Control max-age=3600
  header /js/* Cache-Control max-age=3600
}
```

#### Site Option

```nix
(site_option) {
  encode gzip
  file_server
  handle_errors {
    rewrite * /{http.error.status_code}.html
    file_server
  }
  root * /www/{host}
}
```

Use above in site sections:

```nix
example1.com {
  import cache_ctl
  import site_option
}

example2.com {
  import cache_ctl
  import site_option
}
```

Combine the two:

```nix
example1.com example2.com {
  import cache_ctl
  import site_option
}
```

#### My IP

This snippet allow creation of a text only "MY IP" page.

```nix
(myip) {
	header {args.0} Content-Type text/plain
	respond {args.0} "{{.RemoteIP}}"
	templates {args.0}
}
```

Following site use the snippet to create a "MY IP" page at `/myip` and `/myip/`.

```nix
example.com {
  import myip /myip
  import myip /myip/
  import site_option
}
```

If you want to use a sub-domain for this purpose, then one line is enough.

```nix
myip.example.com {
  import myip /
}
```

#### Favicon

Provide a `favicon.ico` to any site:

```nix
(favicon) {
	file_server /favicon.ico {
		root {args.0}
	}
}
```

Use as follow:

```nix
example.com {
  import favicon /var/www/static
  import site_option
}
```

Also check out example in [CORS](#cors).

### CORS

#### Single

```nix
api.example.com {
  @site2 header Origin https://w3.example.com
  header @site2 Access-Control-Allow-Origin https://w3.example.com
  file_server
  root * /www/api.example.com
}
```

#### Multiple

> Caddy v2.1+

```nix
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

Use regular expression to cover domain and sub-domains.

```nix
(cors_reg) {
  @{args.0} header_regexp Origin {args.0}
  header @{args.0} Access-Control-Allow-Origin {http.request.header.origin}
}

api.example.com {
  root * /www/api.example.com
  file_server

  import cors_reg https://([[:alnum:]-]+\.)*example.com
}
```

#### Reverse-Proxy

When hosting service behind reverse-proxy, some service by default set `Access-Control-Allow-Origin` to `*`. To change that:

```nix
api.example.com {
  import cors https://example.com
  import cors https://www.example.com
  import cors https://another.example.com

  reverse_proxy http://backend.example.com {
    # Remove Access-Control-Allow-Origin from backend response
    header_down -Access-Control-Allow-Origin
  }
}
```

With `cors_reg`:

```nix
api.example.com {
  import cors_reg https://([[:alnum:]-]+\.)*example.com

  reverse_proxy http://backend.example.com {
    # Remove Access-Control-Allow-Origin from backend response
    header_down -Access-Control-Allow-Origin
  }
}
```