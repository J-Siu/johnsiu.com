---
type: "blog"
date: 2016-10-13T22:30:00Z
tags: ["lighttpd", "url.redirect", "mod_redirect", "permalink", "blog", "wordpress"]
title: "Lighttpd url.redirect and changing WordPress permalink structure"
---

I used to use the __`Date and Name`__ permalink structure for my blog:
<!--more-->

```txt
https://johnsiu.com/index.php/2016/10/13/sample-post/
```

But I think it is kind of long and want to shorten it, and change it to __`Post name`__ structure:

```txt
https://johnsiu.com/index.php/sample-post/
```

Changing that is as easy as a few clicks in WordPress setting. All existing and future posts will have the new __`Post name`__ structure.

## Issue

However, after I uploaded the new sitemap to [Google Webmaster Tool](https://www.google.com/webmasters/tools), and start checking my site information, especially __`Links to Your Site`__ under __`Search Traffic`__, I noticed a big issue.

After the permalink structure change, all the links out there with the old structure become broken! Not good!

## Solution

Solution? __[Lighttpd Url.redirect](https://redmine.lighttpd.net/projects/1/wiki/docs_modredirect)__

Since __`Date and Name`__ permalink format is well structured, the redirect rules is easy:

```js
url.redirect = ("^/index.php/\d{4}/\d{2}/\d{2}/(.*)$" => "/index.php/$1")
```
