---
type: "blog"
date: 2017-02-08T08:00:44Z
description: "Configure url redirection for Ghost after migrating from WordPress."
tags: ["ghost", "nodejs", "permalink", "blog", "migrate"]
title: "Ghost Blog Redirect Configuration for WordPress Migration"
aliases:
    - /ghost-blog-redirect-after-wordpress-migration
    - /index.php/ghost-blog-redirect-after-wordpress-migration
    - /index.php/2017/02/08/ghost-blog-redirect-after-wordpress-migration
---

In my earlier post [Lighttpd url.redirect and changing WordPress permalink structure](https://johnsiu.com/lighttpd-url-redirect-and-changing-wordpress-permalink-structure/), I talk about the issue when permalink structure is changed.
<!--more-->

When migrating from WordPress to Ghost, the permalink structure is changed again, from

```txt
https://johnsiu.com/index.php/sample-post/
```

to

```txt
https://johnsiu.com/sample-post/
```

### Solution

Ghost development team provided a perfect and simple solution in version __0.11.4__, the `redirects.json`. The official document is __[here](http://support.ghost.org/redirects/)__.

`redirects.json` need to be placed in `<Ghost root>/content/data/`.

The `redirects.json` for my site is as follow

```json
[
  {
    "permanent": true,
    "from":"^/index.php/[0-9]{4}/[0-9]{2}/[0-9]{2}/(.*)$",
    "to":"/$1"
  },
  {
    "permanent": true,
    "from":"^/index.php/category/(.*)$",
    "to":"/tag/$1"
  },
  {
    "permanent": true,
    "from":"^/index.php/(.*)$",
    "to":"/$1"
  }
]
```

The above will take care of the following redirects:

* https://johnsiu.com/index.php/YYYY/MM/DD/&lt;post&gt;/ to https://johnsiu.com/&lt;post&gt;/
* https://johnsiu.com/index.php/catagory/&lt;tag&gt;/ to https://johnsiu.com/tag/&lt;tag&gt;/
* https://johnsiu.com/index.php/&lt;post&gt;/ to https://johnsiu.com/&lt;post&gt;/

**Done!! ^.^**
