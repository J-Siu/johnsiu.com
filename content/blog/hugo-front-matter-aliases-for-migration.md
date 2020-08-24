---
author: "John Siu"
date: 2019-08-17T20:59:28-04:00
description: "Use Hugo front matter aliases for migration from Ghost or WordPress."
tags: ["hugo","blog","redirect","permalink","migrate","front matter"]
title: "Hugo Front Matter Aliases for Migration"
type: "blog"
---
Use Hugo front matter aliases to handle migration from other platform such as Ghost or WordPress.
<!--more-->
### Background

I have multiple posts about using mod_rewrite / redirect in various web servers to handle difference in base url when migrating from one blog platform to another. Following are a few examples:

From|URL|To|URL|Http Server|Rules
---|---|---|---|---|---
WordPress|`/index.php/YYYY/MM/DD/<article>|Hugo|/blog/<article>`|Nginx|`location ~ "^/index.php/\d{4}/\d{2}/\d{2}/(.*)$" { return 301 https://johnsiu.com/blog/$1; }`
WordPress|`/index.php/<article>|Hugo|/blog/<article>`|Nginx|`location ~ "^/index.php/(.*)$" { return 301 https://johnsiu.com/blog/$1; }`
WordPress|`/index.php/YYYY/MM/DD/<article>`|WordPress|`/index.php/<article>`|Lighttpd|`url.redirect = ("^/index.php/\d{4}/\d{2}/\d{2}/(.*)$" => "/index.php/$1")`

However I encountered something that can't be (or too risky) generalized into rules:

From|URL|To|URL|
---|---|---|---
Ghost|`/<article>`|Hugo|`/blog/<article>`

It looks simple by itself but it can be a big mess. The risk is high and I opted for static rules like following:

```nginx
location /ghost-blog-custom-theme { return 301 https://johnsiu.com/blog/ghost-blog-custom-theme; }
location /ghost-blog-from-wordpress { return 301 https://johnsiu.com/blog/ghost-blog-from-wordpress; }
location /ghost-blog-redirect-for-wordpress { return 301 https://johnsiu.com/blog/ghost-blog-redirect-for-wordpress; }
location /ghost-blog-self-hosted-with-https-using-nodejs-only { return 301 https://johnsiu.com/blog/ghost-blog-self-hosted-with-https-using-nodejs-only; }
location /ghost-https-index-js-in-github { return 301 https://johnsiu.com/blog/ghost-https-index-js-in-github; }
...
```

It look stupid but safe. I ended up with 43 of them plus other rules!!

### Hugo Front Matter Aliases

As I use and explore Hugo more, I found that Hugo front matter support aliases[^1] and also a tools to extract front matter call [front-matter-manipulator](//github.com/chrisdmacrae/front-matter-manipulator).

#### Script and front-matter-manipulator

I quickly put a script[^2] together and generated all the aliases I needed.

```toml
--- 2017/03/13 ghost-blog-custom-theme.md

aliases:
    - /ghost-blog-custom-theme.md
    - /index.php/ghost-blog-custom-theme.md
    - /index.php/2017/03/13/ghost-blog-custom-theme.md

--- 2017/02/07 ghost-blog-from-wordpress.md

aliases:
    - /ghost-blog-from-wordpress.md
    - /index.php/ghost-blog-from-wordpress.md
    - /index.php/2017/02/07/ghost-blog-from-wordpress.md

--- 2017/02/08 ghost-blog-redirect-for-wordpress.md

aliases:
    - /ghost-blog-redirect-for-wordpress.md
    - /index.php/ghost-blog-redirect-for-wordpress.md
    - /index.php/2017/02/08/ghost-blog-redirect-for-wordpress.md

--- 2017/02/25 ghost-blog-self-hosted-with-https-using-nodejs-only.md

aliases:
    - /ghost-blog-self-hosted-with-https-using-nodejs-only.md
    - /index.php/ghost-blog-self-hosted-with-https-using-nodejs-only.md
    - /index.php/2017/02/25/ghost-blog-self-hosted-with-https-using-nodejs-only.md

--- 2017/03/13 ghost-https-index-js-in-github.md

aliases:
    - /ghost-https-index-js-in-github.md
    - /index.php/ghost-https-index-js-in-github.md
    - /index.php/2017/03/13/ghost-https-index-js-in-github.md

...
```

I copy & paste them into my post one by one. Only 43 after all. The result is I can removed all web server rules except one.

#### Pro

The resulting site no longer need web server redirect rules to handle old urls. Especially the 43 rules specifically for migrating from Ghost.

The only remaining rule is for mapping old `/tag/<tag>` to `/tags/<tag>`, which is not important.

The site response time is faster as requests don't have to go through rules. The bigger the site, the more performance is gained(or saved).

The site is 100% static with no dependency on redirect rules!

#### Con

The `public` directory became flooded with static directories:

```txt
public/
├── a-simple-global-variable-service-for-angular-2/
├── angular-simple-mq-service/
├── angular2-simple-timer-service/
├── apple-touch-icon.png/
├── before-and-after-d/
├── ghost-blog-custom-theme/
├── ghost-blog-from-wordpress/
├── ghost-blog-redirect-for-wordpress/
├── ghost-blog-self-hosted-with-https-using-nodejs-only
├── ghost-https-index-js-in-github/
├── h2ghost/
├── let-ghost-be-ghost/
├── lighttpd-redirect-and-wp-permalink/
├── lighttpd-rewrite-for-wordpress-jetpack/
├── systemd-journal-remote/
...
```

But those are generated automatically and not my working directory, which is `content`.

### Conclusion

I decided the PRO out weighted the CON in the long run and only a one time effort.

The switch freed my site from web server dependency and can move between different kind of hosting environment with ease.

### Reference

[^1]: [Hugo Front Matter Aliases](//gohugo.io/content-management/urls/#aliases/)

[^2]: [front-matter-aliases.zsh](//github.com/J-Siu/johnsiu.com/blob/master/front-matter-aliases.zsh)
