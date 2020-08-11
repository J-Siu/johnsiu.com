---
author: "John Siu"
date: 2020-08-08T17:05:01-04:00
description: "Favicon for website."
tags: ["favicon","command-line"]
title: "Brief Look At Favicon"
type: "blog"
---
Prepare a favicon for website.
<!--more-->

### Where To Put

#### Old Way

In the past, favicon resides at the root of a site, and browsers will automatically try to fetch it at the site `/favicon.ico`.

#### New Way

Modern day browsers accept `rel` link for icon like below in the `head` section.

```html
<link rel="icon" href="/myicon.ico">
<link rel="icon" type="image/svg+xml" href="/image.svg">
```

### Which Type

#### SVG

SVG has been been gaining popularity in many areas, including website icon. Though its scalable characteristics make it very flexible, file size can increase drastically with elements beyond simple pathing or pure vector.

Take logo of this site as example. It contains 8 characters but its SVG file size is 2M. That is because the font(ttf) is embedded within the file. Without the font, the file is only 629 bytes.

#### PNG/ICO

PNG, like JPEGa and GIF, is a raster file format. Its file size scales with image size.

ICO, maybe the most common format due to early browser adaptation.

`Imagemagick` is a popular command line tool to change PNG to ICO:

`Imagemagick` < 7.0

```sh
convert favicon.png favicon.ico
```

`Imagemagick` 7.x

```sh
magick convert favicon.png favicon.ico
```

### How Many

Many online tutorials show how to create icons with different sizes to optimized appearance in bookmark/tab(32x32) and top sites(96x96), like following[^1]:

```html
<link rel="apple-touch-icon" sizes="128x128" href="touch-icon-128x128.png">
<link rel="apple-touch-icon" sizes="46x46" href="touch-icon-46x46.png">
<link rel="apple-touch-icon" sizes="256x256" href="touch-icon-256x256.png">
<link rel="icon" href="favicon.ico">
```

### Put Everything Together (IMHO)

When I first start looking at how favicon is setup, multiple size seems to be the "norm".

However, after checking different browsers' behavior, all of them can scale icon on the fly. Especially for shrinking. So why not just deploy the highest resolution one?

Regarding location, there is no standard about `/favicon.ico` or `rel` link precedency. Browser may still try `/favicon.ico` even when `rel` link is present.

As a result, my current preference for deploying site icon is as follow:

Type|Size|Path
---|---|---
ICO|256x256 (file size ~5k)|`/favicon.ico` with `rel` link

[^1]: [Firefox UI considerations for web developers](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/UI_considerations)