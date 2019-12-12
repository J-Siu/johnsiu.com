---
type: "blog"
date: 2016-10-13T22:55:00Z
author: "John Siu"
title: "Tiny VPS Git Server"
description: "GitLab vs Gogs git server in a VPS."
tags: ["tiny","vps","gogs","git"]
aliases:
  - /personal-git-server-in-a-vps
  - /blog/personal-git-server-in-a-vps
  - /index.php/personal-git-server-in-a-vps
  - /index.php/2016/10/13/personal-git-server-in-a-vps
---

__GitLab CE__ and __Gogs__ in VPS.

<!--more-->

---

### GitLab CE

Early last year I upgraded my vps box. The main reason: __[GitLab CE](https://about.gitlab.com/features/#community)__.

__GitLab CE__ properly is one of the best open source, free, mature and actively maintained git server package. It is feature rich, come with beautiful user interface, and backed by commercial development team. You really cannot ask for more.

I was sold once I had it up and running. Except one issue, __GitLab__ is a resource hog. It constantly push my then tiny vps' memory to the limit. That pushed me to upgrade my box.

I did not look back till a few months ago, when my development focus switched from [AngularJS](https://angularjs.org) to [Angular2](https://angular.io), of which the development process is closely tie to [node.js](https://nodejs.org). And node.js, in turn, is closely tie to git. I started asking myself, wouldn't there be a node.js base git server out there, similar to GitLab, but using much less resource?

No! (suprise!?) ... But ...

### Gogs - Go Git Server

I did not find a node.js one, but one written in [GO Lang](https://golang.org): __[Gogs](https://gogs.io)__.

__Gogs__ interface closely resemble [Github](https://github.com). I have no complain about the UI. As a younger project(>2yrs) than GitLab(>5yr), while feature complete, Gogs still have some rough edges. But as an open source project with an active development team, there is no worry about project continuation.

What make __Gogs__ so attractive? Extremely low resource requirement! Following is quote from its website:

> Gogs has low minimal requirements and can run on an inexpensive __Raspberry Pi__. Some users even run Gogs instances on their __NAS devices__.

### Numbers Talk

Lets look at their resource consumption while idling in my vps.

#### GitLab CE Resources

|%CPU|%MEM|VSZ|RSS|COMMAND|
|---:|---:|---:|---:|---|
|0|0.2|41.85Mb|2.10Mb|/usr/bin/redis-server 127.0.0.1:0|
|1.9|25|646.73Mb|256.98Mb|unicorn_rails master|
|0|24.4|646.73Mb|250.39Mb|unicorn_rails worker[0]|
|0|0.4|131.12Mb|4.25Mb|gitlab-workhorse|
|2|26.3|837.74Mb|269.65Mb|sidekiq 4.0.1 gitlab [0 of 2 busy]|

GitLab CE has 6 processes, and I already tuned them to the bare minimum. I excluded __mySQL__ (which is required), as it is also used by __WordPress__.

#### Gogs Resources

|%CPU|%MEM|VSZ|RSS|COMMAND|
|---:|---:|---:|---:|---|
|0|2.4|641.65Mb|25.42Mb|/home/git/gogs/gogs web|

Gogs only has one process!

You already know my choice.
