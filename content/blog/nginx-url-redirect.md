---
type: "blog"
date: 2019-07-30T00:14:48-04:00
author: "John Siu"
title: "Nginx URL Redirect For Old WordPress Permalink"
description: "Nginx URL redirect for old WordPress Permalink in the internet."
tags: ["nginx","redirect","permalink","blog","migrate"]
---
Seems URL rewrite/redirect is a never ending story.
<!--more-->
### Background

When I switched my blogging platform from Ghost to Hugo, I also switched the web serving component.

I used my own [h2ghost](/blog/h2ghost/) with Ghost as both were nodejs applications.

However Hugo produce static pages and I decided to look into other http server options.

I was debating between [Monkey Server](http://monkey-project.com/) and [Nginx](https://nginx.org/). And finally pick Nginx as it is more actively developed.

### Logwatch

Log was set to minimum when I was using h2ghost. But once I switched to Nginx, [Logwatch](https://sourceforge.net/projects/logwatch/) start showing the 404 listing. To my surprise, other than all the random attacks, there are a few old WordPress permalink popping up.

```log
/index.php/2012/12/06/tiny-vps-postfix/: 1 Time(s)
/index.php/category/phone/: 1 Time(s)
/index.php/sample-post/: 1 Time(s)
/index.php/tiny-vps-postfix/: 1 Time(s)
```

### Redirect

To *save* those requests, I need to implement redirect/rewrite again, just like old times. Luckily the [regex from my old Lighttpd](/blog/lighttpd-url-redirect-and-changing-wordpress-permalink-structure/) still works.

```apache
# /index.php/YYYY/MM/DD/<article> to /blog/<article>
location ~ "^/index.php/\d{4}/\d{2}/\d{2}/(.*)$" { return 301 https://johnsiu.com/blog/$1; }
# /index.php/<article> to /blog/<article>
location ~ "^/index.php/(.*)$" { return 301 https://johnsiu.com/blog/$1; }
```

Now [/index.php/tiny-vps-postfix/](/index.php/tiny-vps-postfix/) works again!!