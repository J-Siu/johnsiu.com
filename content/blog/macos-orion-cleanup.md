---
author: "John Siu"
date: 2026-05-19T17:11:06-04:00
description: "Quick note on Orion cleanup on MacOS"
tags: ["macos","orion"]
title: "Orion Browser MacOS Cleanup"
type: "blog"
---
Quick note on Orion cleanup on MacOS.
<!--more-->

### Orion Cleanup

Have been using [Orion Browser](https://orionbrowser.com) since its early days.

As I am using the RC version, from time to time I would like to do a clean install of the browser.

#### Preparation

Before proceeding
1. That screenshot of all setting tabs in the setting
2. Export saved password
3. Export bookmark
4. Copy custom script if any
5. Take note or screenshot of extension list
6. Export extension setting if the extension support it
7. DOUBLE CHECK IF THERE ARE ANYTHING YOU WANT TO SAVE/SCREENSHOT/BACKUP
8. Delete Orion browser from application folder

#### Command Line

Make sure Orion browser is not running.

```sh
rm -rf ~/Library/Application\ Scripts/com.kagi*
rm -rf ~/Library/Application\ Support/Orion*
rm -rf ~/Library/Caches/com.kagi.*
rm -rf ~/Library/HTTPStorages/com.kagi.*
rm -rf ~/Library/WebKit/com.kagi.*
```

The following may need `sudo`

```sh
rm ~/Library/Preferences/com.kagi.kagimacOS.*
```

---

Reference: [Orion Official Technical Information](https://help.kagi.com/orion/misc/technical.html)
