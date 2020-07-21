---
type: "blog"
date: 2019-08-17T08:26:04-04:00
author: "John Siu"
title: "Hugo Empty Homepage"
description: "Hugo homepage empty list or wrong post list after upgrade."
tags: ["hugo","blog","macos","brew","rollback"]
---
Hugo homepage list empty or wrong post list after upgrading to 0.57.x.
<!--more-->
### TL;DR

If your hugo blog/site homepage list suddenly become empty or display the wrong list, check your hugo version:

```sh
hugo version
```

Output:

```sh
Hugo Static Site Generator v0.57.1/extended darwin/amd64 BuildDate: unknown
```

If it show > v0.57.x, then it properly is the cause. As Hugo team introduce some breaking changes when upgrading to 0.57.x. [^1] [^2]

### Quick Fix

New features are great but keeping the site up and running is more important.

It is easy fix for linux, just install hugo 0.56.3 with package manager of your distro.

However it is a bit messy on Mac with Homebrew. Following is the steps for rolling back on Mac using Homebrew:

```sh
brew uninstall hugo
cd /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core/Formula/
git checkout 89a374 hugo.rb
brew install hugo
```

> If you have a different brew formula path, check below for how to locate it.

Now your Hugo is rollback to 0.56.3. Switch to your hugo site directory and everything should back to normal.

#### Brew Rollback Explain

To find the exact location of `hugo.rb`.

```sh
mdfind hugo.rb
```

If you have brew recent version, it should show path as follow:

```sh
/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core/Formula/hugo.rb
```

Go into directory and check `hugo.rb` git log:

```sh
cd /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core/Formula/
git log hugo.rb
```

Look for entry right below 0.57.0 in output:

```git
commit 89a37417b5efc8054fad9a0ea95f48f944b36f6e
Author: BrewTestBot <homebrew-test-bot@lists.sfconservancy.org>
Date:   Thu Aug 1 15:37:59 2019 +0000

    hugo: update 0.56.3 bottle.
```

The commit string (SHA-1 checksum) is `89a37417b5efc8054fad9a0ea95f48f944b36f6e`. We use the first 6 characters of it for check out:

```sh
git check out 89a374 hugo.rb
```

Now you have Hugo 0.56.3 bottle file in your system. Brew will use it when you try to install Hugo.

### Long Term

Above fix is only for short term and to get your site back. In the long run you should update the theme to use new Hugo features. Especially if you are maintaining a huge site with multiple sections.

#### Hugo Theme Page

If your theme is one in [Hugo Theme](https://themes.gohugo.io/) page, check if it is updated. Hugo development team is actively contacting all theme authors to migrate[^2].

### Reference

[^1]: [Page lists broken in various theme demos in 0.57.0 #678](https://github.com/gohugoio/hugoThemes/issues/678)

[^2]: [Demos with empty homepage and/or wrong posts list #682](https://github.com/gohugoio/hugoThemes/issues/682)
