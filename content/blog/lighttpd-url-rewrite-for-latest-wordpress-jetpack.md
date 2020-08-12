---
author: "John Siu"
date: 2016-10-13T03:33:00Z
description: "Lighttpd url.rewrite for latest WordPress Jetpack"
tags: ["lighttpd","redirect","url.rewrite","wordpress", "jetpack", "mod_rewrite"]
title: "Lighttpd url.rewrite for latest WordPress Jetpack"
type: "blog"
---

The latest [WordPress Jetpack (4.3.1)](//wordpress.org/plugins/jetpack/) is using `<your-site>/wp-json/whatever/` for its api callback to the web server. It is an issue for web server not supporting `.htaccess`, and [Lighttpd](//redmine.lighttpd.net) is one of them.
<!--more-->

I end up with a lot of 404 errors in the `access.log` like the following one:

```sh
[12/Oct/2016:17:54:58 -0400] "POST /wp-json/jetpack/v4/module/markdown/active HTTP/1.1" 404
```

### Solution

To solve the issue I start exploring [Lighttpd url.rewrite](//redmine.lighttpd.net/projects/1/wiki/docs_modrewrite). After some research and a few tries, I finally come up with a working configuration:

```lighttpd
url.rewrite-if-not-file = ("^/(.*)$" => "/index.php/$1")
```
