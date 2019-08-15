---
type: "blog"
date: 2012-12-10T10:18:16Z
tags: ["lighttpd", "linux", "vps"]
title: "Tiny VPS Lighttpd Single Site Multiple Domains"
aliases:
    - /tiny-vps-lighttpd-single-site-multiple-domains
    - /index.php/tiny-vps-lighttpd-single-site-multiple-domains
    - /index.php/2012/12/10/tiny-vps-lighttpd-single-site-multiple-domains
---

 I own [**johnsiu.com**](http://johnsiu.com), [**johnsiu.org**](http://johnsiu.org), [**johnsiu.info**](http://johnsiu.info), [**johnsiu.net**](http://johnsiu.net) and they all point to this server.
 <!--more-->
 That is already setup in dns. But I want all of them, with or with www, redirect to [**http://johnsiu.com**](http://johnsiu.com/). Lighttpd give you an easy way to do it.

In ***/etc/lighttpd/lighttpd.conf***, I added the following section

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

You can see **.com** is seperated from **.net**, **.org**, **.info** redirection. Why?

That is because I only need to redirect [**http://www.johnsiu.com**](http://www.johnsiu.com) to [**http://johnsiu.com**](http://johnsiu.com).

I don’t need an infinite loop of [**http://johnsiu.com**](http://johnsiu.com) to [**http://johnsiu.com**](http://johnsiu.com) redirection.
