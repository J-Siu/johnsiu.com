---
author: "John Siu"
date: 2012-12-10T10:18:16Z
description: "How to configure Lighttpd to handle all the domains the way I want?"
tags: ["tiny","lighttpd","ubuntu","vps"]
title: "Tiny VPS Lighttpd Single Site Multiple Domains"
type: "blog"
---
How to configure Lighttpd to handle all the domains the way I want?
<!--more-->

---

I own [johnsiu.com](http://johnsiu.com), [johnsiu.org](http://johnsiu.org), [johnsiu.info](http://johnsiu.info), [johnsiu.net](http://johnsiu.net) and they all point to this server.

That is already setup in dns. But I want all of them, with or with www, redirect to [http://johnsiu.com](http://johnsiu.com/). Lighttpd give you an easy way to do it.

In __/etc/lighttpd/lighttpd.conf__, I added the following section

```ini
$HTTP["scheme"] == "http" {

    $HTTP["host"] =~ "^www\.johnsiu\.com$" {
        url.redirect  = (
            "^/(.*)" => "http://johnsiu.com/$1",
        )
    }

    $HTTP["host"] =~ "^(www\.)?johnsiu\.(net|org|info)$" {
        url.redirect  = (
            "^/(.*)" => "http://johnsiu.com/$1",
        )
    }

    $HTTP["host"] =~ "^162\.208\.11\.21$" {
        url.redirect  = (
            "^/(.*)" => "http://johnsiu.com/$1",
        )
    }

}
```

You can see __.com__ is separated from __.net__, __.org__, __.info__ redirection. Why?

That is because I only need to redirect [http://www.johnsiu.com](http://www.johnsiu.com) to [http://johnsiu.com](http://johnsiu.com).

I don’t need an infinite loop of [http://johnsiu.com](http://johnsiu.com) to [http://johnsiu.com](http://johnsiu.com) redirection.
