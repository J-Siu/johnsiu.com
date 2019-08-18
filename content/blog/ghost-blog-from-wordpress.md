---
type: "blog"
date: 2017-02-07T18:21:11Z
description: "Ghost Blog from WordPress Migration"
tags: ["ghost", "nodejs", "blog","migrate"]
title: "Ghost Blog from WordPress"
aliases:
    - /ghost-blog-from-wordpress
    - /index.php/ghost-blog-from-wordpress
    - /index.php/2017/02/07/ghost-blog-from-wordpress
---

Last October I moved my git server from __[GitLab CE](https://about.gitlab.com/features/#community)__ to __[GoGs](https://gogs.io)__. I also planned to move my blog from __[WordPress](https://wordpress.com)__ to __[Ghost Blog](https://ghost.org)__ at the same time, but was delayed by the heavy load at work, until now.
<!--more-->

## WordPress - King of Blog for the Mass

__WordPress__ is a very powerful and mature blogging platform, and many companies and organizations use it for their official website.

However, just as __GitLab CE__, I am the only one posting in this site, I want something more lightweight, something that doesn't require a full __[LAMP](https://en.wikipedia.org/wiki/LAMP_(software_bundle))__ stack. Especially database like __[MySQL](https://mysql.com)__ or __[MariaDB](https://mariadb.org)__.

## Ghost - New Kids On The "Blog"

__Ghost__ started as a __[KickStarter Project](https://www.kickstarter.com/projects/johnonolan/ghost-just-a-blogging-platform)__ in 2012 as both an open source __[GitHub Project](https://github.com/TryGhost/Ghost)__ and  __[Ghost(Pro)](https://ghost.org/pricing/)__, a blog hosting service. Check out the [wiki page](https://en.wikipedia.org/wiki/Ghost_(blogging_platform)) if you are interested in the story behind Ghost.

What make __Ghost__ attractive for me?

Ghost, as a NodeJS application, is a web server by itself, that eliminated the needed for standalone web server like lighttpd or apache. Besides MySQL, it also support __[sqlite3](http://sqlite.org)__, an embedded light weight database library. I don't need standalone database.

And again, numbers talk ...

## Numbers Talk

Lets see the different between __Ghost__ and __WordPress__ in terms of system resources. Numbers are captured right after a fresh start up of all related processes.

__WordPress__

|%CPU|%MEM|VSZ|RSS|COMMAND|
|---:|---:|---:|---:|---|
|0.0|0.1|11.25Mb|1.30Mb|mysqld_safe|
|0.0|7.7|997.12Mb|79.83Mb|mysqld|
|0.0|0.0|5.96Mb|0.67Mb|logger -t mysqld -p daemon.error|
|0.0|0.3|111.68Mb|3.81Mb|lighttpd|
|0.3|1.7|298.71Mb|17.77Mb|php-fpm: master process|
|0.0|0.5|298.71Mb|5.89Mb|php-fpm: pool (1/2)|
|0.0|0.5|298.71Mb|5.89Mb|php-fpm: pool (2/2)|

__Ghost__

|%CPU|%MEM|VSZ|RSS|COMMAND|
|---:|---:|---:|---:|---|
|0.0|9.8|1267.61Mb|101.07Mb|node ghost/index.js|

__Beyond the Numbers__

WordPress requires full LAMP stack, database(MySql/MariaDB), web server (Lighttpd, or more commonly Apache, which use even more resource).

Ghost on the other hand, only require NodeJS. So 2 less packages to maintain and configure. Moreover, 1 process[^1] vs 7 processes [^2].

The resource difference may not be that impressive in tables above. However, base on my own observation, lighttpd and php-fpm tend to hold on a bit more memory over time. Additionally, memory usage reported by `free` is much higher before the switch, __500Mb+(before) vs 235Mb(now)__.

__PS:__

[^1]: I customized Ghost index.js to support HTTPS with a single node instance, which is not official supported by the Ghost development team. I will talk about it in a later post.

[^2]: Number of processes for MySQL depends on setup, it can be reduced to one. PHP-FPM pool can be reduced to one, I choose to use two. It can be completely eliminated if cgi mode is used in Lighttpd. In Apache, mod_php  embedded the php interpreter within Apache process, but Apache itself use more resources than lighttpd.
