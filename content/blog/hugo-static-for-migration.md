---
type: "blog"
date: 2019-08-17T20:58:45-04:00
author: "John Siu"
title: "Hugo Static for Migration"
description: "Use Hugo static section to handle migration from other platform such as Ghost or WordPress."
tags: ["hugo","redirect","migrate"]
draft: false
---
Use Hugo __static__ section to handle migration from other platform such as Ghost or WordPress.
<!--more-->

### Background

I have multiple posts about using mod_rewrite / redirect in various web servers to handle difference in base usr when migrating from one blog platform to another.

But what about __/index.php__ and __/index.php/tag__(from WordPress) or __/tag__(from Ghost) themselves. They are actually generating lot of 404 in web server log.

### Use Hugo /static/

__/index.php__ should be redirected to __/__.

__/index.php/tag__ and __/tag__ should be redirected to __/tags__.

You can create web server rules to handle them. But that is another 2 or 4 rules, depending on web server used and other rules already in place. And yes, they may conflict each other!

Luckily with Hugo there is a simpler solution then fiddling with web server rules. Your Hugo site directory tree should look similar to below:

```sh
.
├── archetypes/
├── content/
├── public/
├── resources/
├── static/
└── themes/
```

#### /index.php/

Inside the __static__ directory, create directory __index.php__:

```sh
└── static/
    └── index.php/
        └── index.html
```

Create __index.php/index.html__:

```html
<!DOCTYPE html>
<html>

<head>
  <title>/index.php</title>
  <link rel="canonical" href="/" />
  <meta name="robots" content="noindex">
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=/" />
</head>

</html>
```

#### /index.php/tag/ and /tag/

Inside the __static__ directory, create directory __index.php/tag__ and __tag__:

```sh
└── static/
    ├── index.php/
    │   └── tag/
    │       └── index.html
    └── tag/
        └── index.html
```

Create __index.php/tag/index.html__ and __tag/index.html__:

```html
<!DOCTYPE html>
<html>

<head>
  <title>/tag/</title>
  <link rel="canonical" href="/tags/" />
  <meta name="robots" content="noindex">
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=/tags/" />
</head>

</html>
```

### Conclusion

The __static__ will be deployed into your __public__ folder automatically when compiling the site. No web server rules required. This removes another layer of web server dependency from your site.
