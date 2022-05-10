---
author: "John Siu"
date: 2019-07-31T00:30:22-04:00
description: "Some quick nginx configuration."
tags: ["nginx","cheatsheet","redirect","rewrite","permalink"]
title: "Nginx Config"
type: blog
---
Some quick nginx config.
<!--more-->

### WordPress Permalink Redirect

Regex string must be put inside double quote.

#### /index.php/YYYY/MM/DD/\<post\> to /blog/\<post\>

```apache
location ~ "^/index.php/\d{4}/\d{2}/\d{2}/(.*)$" { return 301 https://johnsiu.com/blog/$1; }
```

#### /index.php/\<post\> to /blog/\<post\>

```apache
location ~ "^/index.php/(.*)$" { return 301 https://johnsiu.com/blog/$1; }
```

### Ghost Permalink Redirect

This is mainly use to redirect Ghost permalink, which has no prefix, to Hugo format.

```apache
location /<post> { return 301 https://johnsiu.com/blog/<post>; }
```

### Multiple Domains Redirect

Redirect all traffic hitting nginx to `<your domain>`. Not affect domain defined in other server block.

```apache
server {
  listen  80;
  server_name _;
  return 302 https://<your domain>$request_uri;
}
```

`302`(temporary) is used instead of `301`(permanent) in case you want to use those domains in the future.
