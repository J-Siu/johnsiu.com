---
type: "blog"
date: 2012-12-05T11:17:51Z
tags: ["linux", "mysql", "vps"]
title: "Tiny VPS MySQL"
---
<!--more-->

## Tweaking For Less vs Tweaking For Max

The fun of a tiny vps is tweaking everything to use less resource, just do the bare minimum, but at the same time, do what you want it to do.

This is the opposite of running a “normal” server, tuning it to growth, have all features available, and readying it for years of services.

Welcome to a tiny world.

## MySQL

[![MySQL](https://i0.wp.com/www.mysql.com/common/logos/logo-mysql-110x57.png?resize=110%2C57 "MySQL")](http://mysql.com/)

DB tuning is a big topic, a profession, a complicated process … well, if you are doing performance tuning. Tuning MySQL to use less memory, turn out to be pretty simple.

A simple googling on this topic will give you lot of pages, either blog or forum post, with a common trick

> Add following in /etc/mysql/my.cnf [mysqld] section  
> skip-bdb  
> skip-innodb

This works … before MySQL 5.1. Turn out that the option **skip-bdb** was [deprecated in 5.0](http://bugs.mysql.com/bug.php?id=50336), and removed completely from 5.1. If it is added to 5.1 *my.cnf*, mysqld won’t even start. For 5.1 and later (5.5.28 as of today), only use **skip-innodb**.

So how much memory are we saving with skip-innodb? Lets test.

### Memory usage with no mysql running!!

||total|used|free|shared|buffers|cached|
|---|---:|---:|---:|---:|---:|---:|
|Mem:|512|210|301|0|0|0|
|-/+ buffers/cache||210|301|
|Swap:|0|0|0|

### Memory usage with mysql running, not using skip-innodb

||total|used|free|shared|buffers|cached|
|---|---:|---:|---:|---:|---:|---:|
|Mem:|512|332|179|0|0|0|
|-/+ buffers/cache||332|179|
|Swap:|0|0|0|

### Memory usage with mysql running, using skip-innodb

||total|used|free|shared|buffers|cached|
|---|---:|---:|---:|---:|---:|---:|
|Mem:|512|235|276|0|0|0|
|-/+ buffers/cache||235|276|
|Swap:|0|0|0|

**So skip-innodb alone saves us almost 100M of memory usage!** Keep in mind, we are talking about a tiny vps with only 256M of ram. **That is 40% of available memory.**

**This option is definitely staying!!**
