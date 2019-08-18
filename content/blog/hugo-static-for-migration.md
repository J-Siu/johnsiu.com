---
type: "blog"
date: 2019-08-17T20:58:45-04:00
author: "John Siu"
title: "Hugo Static for Migration"
description: "Use Hugo static section to handle migration from other platform such as Ghost or WordPress."
tags: ["hugo","redirect","migrate"]
draft: false
---
Use Hugo static section to handle migration from other platform such as Ghost or WordPress.
<!--more-->

### Background

I have multiple posts about using mod_rewrite / redirect in various web servers to handle difference in base usr when migrating from one blog platform to another.

But what about `/index.php` or `/tag` themselves. I never pay attention to them until recently.

### Use Hugo /static

`/index.php` should be redirected to `/`.

`/tag` should be redirected to `/tags`.

You can create rules to handle them. But that is another 2 or 4 rules, depending on web server used and other rules already in place. And yes, they may conflict each other!

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

Inside the `static` directory, create directory `index.php` and directory `tag`:

```sh
├── static/
    ├── index.php/
    │   └── index.html
    └── tag/
        └── index.html
```

Create `index.html` in each of them with following content:

`index.php/index.html`:

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

`tag/index.html`:

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

They will be deployed into your `public` folder automatically when compiling the site. No web server rules required.