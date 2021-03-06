---
author: "John Siu"
date: 2013-04-15T04:24:05Z
description: "Configuring postfix sasl2 authentication."
tags: ["tiny","ubuntu","vps","postfix","sasl2"]
title: "Tiny VPS Postfix - Part 2 - Non-Linux Outgoing Account"
type: "blog"
---

In the last part I show a minimal setup of Postfix. It allow incoming emails to be forwarded to specific external email address(es).
<!--more-->

### Series Content

- Part 1 - [Tiny VPS Postfix](/blog/tiny-vps-postfix/)
- Part 2 - [Non-Linux Outgoing SMTP Account](/blog/tiny-vps-postfix-p2-smtp-account/) <- You are here
- Part 3 - [GMail As Email Client](/blog/tiny-vps-postfix-p3-gmail/)
- Part 4 - [Postfix with Docker](/blog/tiny-vps-postfix-docker/)
- Part 5 - [Docker, Postfix, Journald & Logwatch](/blog/docker-postfix-journald/)

### Replying email with my own domain

However, there are situations we would like to reply or sent with our own domain. Especially with today tighter email security setup, relaying through others email server (eg. your ISP) will likely have your email flagged as spam, if not outright rejected.

It will be way over kill to setup `postfixadmin` and `mysql` for a few email addresses. On the other hand, it is undesirable (at least for me) to setup a local Linux account on the VPS just for sending email.

So is there a simple way to setup smtp authentication with postfix without using Linux account?

### SASLDB to the Rescue

To enable smtp authentication with Postfix without Linux account or a database, we can use [sasldb2](http://www.postfix.org/SASL_README.html#auxprop_sasldb). It is easy to install and configure.

#### Installing

```sh
apt-get install sasl2-bin
```

This will pull in the required sasl2 library and command line utilities required to use sasldb2.

#### Setup Postfix

To have postfix to use sasldb2, modify `/etc/postfix/sasl/smtpd.conf` as follow:

```ini
pwcheck_method: auxprop
mech_list: plain login
```

Then restart postfix:

```sh
sudo service postfix restart
```

#### Create sasldb2 users

To create a user in sasldb2, use following command:

```sh
saslpasswd2 -c -u <domain> -a smtpauth <username>
```

For example, my domain is `johnsiu.com`, and I want to have a new email `testing@johnsiu.com`:

```sh
saslpasswd2 -c -u johnsiu.com -a smtpauth testing
```

#### Finalizing

The actual sasldb2 file is located at `/etc/sasldb2`. Make sure it has the following permission:

```sh
-rw-rw---- 1 postfix sasl sasldb2
```

#### What if sasldb2 doesn’t seems to work

Then it is likely that your postfix is run with chroot. Just copy sasldb2 to the chroot `/etc/`:

```sh
cp -a /etc/sasldb2 /var/spool/postfix/etc/
```

You will have to do that every time you modify sasl2 password, add/del sasl2 user.

Now you should able to configure your email client(Thunderbird, Outlook, etc) to use your VPS as outgoing smtp server.
