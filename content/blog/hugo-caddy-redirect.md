---
author: "John Siu"
date: 2020-08-23T00:00:00-04:00
description: "Hugo Caddy redirect after migration"
tags: ["hugo","caddy","redirect","migrate","wordpress","ghost"]
title: "Hugo - Caddy Redirect"
type: "blog"
---
If you migrate from wordpress or ghost.
<!--more-->

### What Is Needed

#### Redirections For WordPress Migration

#|From|To
---|---|---
1|`/index.php/`|`/`
2|`/index.php/*`|`/post/*`
3|`/index.php/category/*`|`/tags/*`
4|`/index.php/tag/*`|`/tags/*`
5|`/wp-login.php`|`/`

#### Redirections For Ghost Migration

#|From|To
---|---|---
6|`/*`|`/post/*`
7|`/category/*`|`/tags/*`
8|`/tag/*`|`/tags/*`

### Details

Take #4 `/index.php/tag/*` to `/tags/*` as example, caddyfile will look like follow:

```apache
example.com {
  file_server
  root * /www/site/example.com

  # Redirect #4
  @index2root path_regexp ^/index.php/tag/?(.*)
  redir @index2root /tags/{http.regexp.1}
}
```

Repeat the same for the remaining 7 and start looking ugly.

### Factorize

When looking at the requirements, all redirects can be summarized into 2 rules:

Rule #|From|To|Comment
---|---|---|---
1|`<some path\>`|`<some path>/*`|Change path
2|`/<file/dir>`|`<some path>/*`|Move root level items to another path

Take `/index.php/tag/*` to `/tags/*` as example, it can be break into 2 steps:

1. `/index.php/tag/*` to `/tag/*`
2. `/tag/*` to `/tags/*`

*Rule #1* applies to both steps. Creating common rule block in Caddy for *Rule #1* and *Rule #2* will cover all migration needs.

### Caddy Snippets

Caddy v2 support snippet, a parameterized block that works like function call in programming.

#### Rule #1 Snippets

```apache
(my_redir) {
	@{args.0} {
		path_regexp r ^{args.0}/?(.*)
		not path_regexp ^/tags/?.*
	}
	redir @{args.0} {args.1}{re.r.1}
}
```

This snippet will redirect `{args.0}*`, the request url, to `{args.1}*`.

It will not execute if request url is `/tags*`. This is to prevent redirect loop between `/tag` and `/tags`.

Again take `/index.php/tag/*` to `/tags/*` as example:

```apache
import my_redir /index.php /
import my_redir /tag /tags/
```

#### Rule #2 Snippets

```apache
(my_tryfile) {
	@{args.0} {
		file /{args.0}/{path}index.html /{args.0}/{path}/index.html
		path_regexp {args.0} ^/([^/]+)/?$
	}
	redir @{args.0} /{args.0}/{re.{args.0}.1}/
}
```

This snippet will redirect root level item request, to `{args.0}/<item>`, only if `{args.0}/<item>/index.html` exist.

Each site can only have one `my_tryfile`.

```apache
import my_tryfile post
```

### Final Solution

Following is `caddyfile` that covers all 8 redirections mentioned at the beginning:

```apache
(my_redir) {
	@{args.0} {
		path_regexp r ^{args.0}/?(.*)
		not path_regexp ^/tags/?.*
	}
	redir @{args.0} {args.1}{re.r.1}
}

(my_tryfile) {
	@{args.0} {
		file /{args.0}/{path}index.html /{args.0}/{path}/index.html
		path_regexp {args.0} ^/([^/]+)/?$
	}
	redir @{args.0} /{args.0}/{re.{args.0}.1}/
}

example.com {
	file_server
	root * /www/site/example.com

  # Redirect
	import my_redir /category /tags/
	import my_redir /cheatsheet /blog/
	import my_redir /index.php /
	import my_redir /tag /tags/
	import my_redir /wp-login.php /
	import my_tryfile blog
}
```