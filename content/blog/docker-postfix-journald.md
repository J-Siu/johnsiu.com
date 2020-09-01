---
author: "John Siu"
date: 2020-08-24T00:00:00-04:00
description: "Docker postfix with journald and logwatch"
tags: ["docker","postfix","journald","logwatch","tiny","vps"]
title: "Docker, Postfix, Journald & Logwatch"
type: "blog"
---
How to mix them together?
<!--more-->

### Series Content

- Part 1 - [Tiny VPS Postfix](/blog/tiny-vps-postfix/)
- Part 2 - [Non-Linux Outgoing SMTP Account](/blog/tiny-vps-postfix-p2-smtp-account/)
- Part 3 - [GMail As Email Client](/blog/tiny-vps-postfix-p3-gmail/)
- Part 4 - [Postfix with Docker](/blog/tiny-vps-postfix-docker/)
- Part 5 - [Docker, Postfix, Journald & Logwatch](/blog/docker-postfix-journald/) <- You are here

### The Journey Continue

After completing [Tiny VPS Postfix with Docker](/blog/tiny-vps-postfix-docker/),  I have been looking for ways to make `logwatch` process log for postfix container.

It is common for containerized environment shipping logs to centralize server and processed by analytic tools like Elastic Stack. However those type of setup are for multiple servers, and most importantly, by no means tiny!

With only a single Tiny VPS, I decided to stick with logwatch and make it work with postfix again.

### Docker Log

Docker support multiple ways of logging. By default it logs to file. Following will make all docker logs, including container `stdout`, go into journald.

`etc/docker/daemon.json`

```json
{
  "features": {
    "buildkit": true
  },
  "log-driver": "journald"
}
```

- Line 3 enable `buildkit`, a faster way of building docker image.
- Line 5 set `journald` logging.

You can check out a complete list of `daemon.json` entries on my [Docker Commands](/blog/docker-cmd/#daemonjson) page.

### Postfix Log

When running postfix in docker container, there are two ways get logs into host journald.

#### Method 1 - Default (/dev/log)

Postfix by default log to `/dev/log`. That can be mapped to the host. Following is my postfix image[^1] `docker-compose.yml`:

```yml
version: "3"
services:
  postfix:
    restart: unless-stopped
    image: jsiu/postfix
    container_name: postfix_container
    hostname: ${POSTFIX_HOSTNAME}
    domainname: ${POSTFIX_HOSTNAME}
    logging:
      options:
        tag: "{{.Name}}"
    ports:
      - "25"
      - "587"
    volumes:
      - /dev/log:/dev/log
      - ${POSTFIX_CNF}:/postfix:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - P_TZ=${TZ}
```

- Line 16 is the `/dev/log` mapping, postfix log will go directly into host journald.

Issue following command on host:

```sh
sudo journalctl -t postfix -t postfix/anvil -t postfix/bounce -t postfix/cleanup -t postfix_container -t postfix/error -t postfix/local -t postfix/master -t postfix/pickup -t postfix/postalias -t postfix/postfix-script -t postfix/proxymap -t postfix/qmgr -t postfix/scache -t postfix/sendmail -t postfix/smtp -t postfix/smtpd -t postfix/tlsmgr -t postfix/trivial-rewrite
```

The reason for all the `-t`(search terms) instead of `-u postfix` is because the log is not tagged as postfix.

The output is just like normal postfix log:

```cobol
Aug 23 00:02:02 example.com postfix/smtpd[82]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix/smtpd[84]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix/smtpd[82]: lost connection after CONNECT from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix/smtpd[82]: disconnect from unknown[xxx.xxx.xxx.xxx] commands=0/0
Aug 23 00:02:04 example.com postfix/smtpd[84]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:04 example.com postfix/smtpd[84]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:02:06 example.com postfix/smtpd[82]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:07 example.com postfix/smtpd[82]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:07 example.com postfix/smtpd[82]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:02:09 example.com postfix/smtpd[84]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:10 example.com postfix/smtpd[84]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:11 example.com postfix/smtpd[84]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:05:32 example.com postfix/anvil[86]: statistics: max connection rate 4/60s for (smtp:xxx.xxx.xxx.xxx) at Aug 23 00:02:09
Aug 23 00:05:32 example.com postfix/anvil[86]: statistics: max connection count 1 for (smtp:xxx.xxx.xxx.xxx) at Aug 23 00:02:02
```

#### Method 2 - Stdout

There are more steps to have postfix log to `stdout`.

`docker-compose.yml`:

```yml
version: "3"
services:
  postfix:
    restart: unless-stopped
    image: jsiu/postfix
    container_name: postfix_container
    hostname: ${POSTFIX_HOSTNAME}
    domainname: ${POSTFIX_HOSTNAME}
    logging:
      options:
        tag: "{{.Name}}"
    ports:
      - "25"
      - "587"
    volumes:
      #- /dev/log:/dev/log
      - ${POSTFIX_CNF}:/postfix:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - P_TZ=${TZ}
```

- Line 6 set the container_name. This is important as shown below.
- Line 9-11 set name tag in log.
- Line 16 should either be commented or removed.

Postfix `main.cf`, add following line at the end:

```ini
maillog_file = /dev/stdout
```

Postfix `master.cf`, add following line at the end:

```ini
postlog   unix-dgram n  -       n       -       1       postlogd
```

For more information of `main.cf` and `master.cf`, please refer to [Tiny VPS Postfix with Docker](/blog/tiny-vps-postfix-docker/).

To see postfix log is again flowing into journald:

```sh
sudo journalctl -t postfix_container
```

Setting `container_name` with log tagging become handy here as a single search term `-t postfix_container` is enough. Output should be similar as below:

```cobol
Aug 23 00:02:02 example.com postfix_container[468]: Aug 23 00:02:02 example postfix/smtpd[82]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix_container[468]: Aug 23 00:02:02 example postfix/smtpd[84]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix_container[468]: Aug 23 00:02:02 example postfix/smtpd[82]: lost connection after CONNECT from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:02 example.com postfix_container[468]: Aug 23 00:02:02 example postfix/smtpd[82]: disconnect from unknown[xxx.xxx.xxx.xxx] commands=0/0
Aug 23 00:02:04 example.com postfix_container[468]: Aug 23 00:02:04 example postfix/smtpd[84]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:04 example.com postfix_container[468]: Aug 23 00:02:04 example postfix/smtpd[84]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:02:06 example.com postfix_container[468]: Aug 23 00:02:06 example postfix/smtpd[82]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:07 example.com postfix_container[468]: Aug 23 00:02:07 example postfix/smtpd[82]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:07 example.com postfix_container[468]: Aug 23 00:02:07 example postfix/smtpd[82]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:02:09 example.com postfix_container[468]: Aug 23 00:02:09 example postfix/smtpd[84]: connect from unknown[xxx.xxx.xxx.xxx]
Aug 23 00:02:10 example.com postfix_container[468]: Aug 23 00:02:10 example postfix/smtpd[84]: warning: unknown[xxx.xxx.xxx.xxx]: SASL LOGIN authentication failed: authentication fai>
Aug 23 00:02:11 example.com postfix_container[468]: Aug 23 00:02:11 example postfix/smtpd[84]: disconnect from unknown[xxx.xxx.xxx.xxx] ehlo=1 auth=0/1 quit=1 commands=2/3
Aug 23 00:05:32 example.com postfix_container[468]: Aug 23 00:05:32 example postfix/anvil[86]: statistics: max connection rate 4/60s for (smtp:xxx.xxx.xxx.xxx) at Aug 23 00:02:09
Aug 23 00:05:32 example.com postfix_container[468]: Aug 23 00:05:32 example postfix/anvil[86]: statistics: max connection count 1 for (smtp:xxx.xxx.xxx.xxx) at Aug 23 00:02:02
```

Double segment for time to process id is correct.

### Logwatch

As postfix log can come in 2 different formats, different configurations are needed to handle them.

For logwatch to use journald, create following files:

`/etc/logwatch/conf/logfiles/null.conf`

```ini
LogFile = null.log
```

Create `/var/log/null.log` with 1 empty line.

```ini

```

The next file `/etc/logwatch/conf/services/postfix.conf` will depend on method chosen with postfix.

#### Method 1

As logs are from postfix directly into journald, there is no container tagging, all search terms have to be used.

`/etc/logwatch/conf/services/postfix.conf`

```ini
/etc/logwatch/conf/services# cat postfix.conf
LogFile =
LogFile = null
*JournalCtl = "-t postfix -t postfix/anvil -t postfix/bounce -t postfix/cleanup -t postfix_container -t postfix/error -t postfix/local -t postfix/master -t postfix/pickup -t postfix/postalias -t postfix/postfix-script -t postfix/proxymap -t postfix/qmgr -t postfix/scache -t postfix/sendmail -t postfix/smtp -t postfix/smtpd -t postfix/tlsmgr -t postfix/trivial-rewrite"
```

#### Method 2

Logs are tagged as it pass through docker, `-t postfix_container` is enough.

`/etc/logwatch/conf/services/postfix.conf`

```ini
/etc/logwatch/conf/services# cat postfix.conf
LogFile =
LogFile = null
*JournalCtl = "--output=cat -t postfix_container"
```

`--output=cat` is used to strip out the first date to process id segment.

#### Testing

Use following command to test:

```sh
logwatch --debug Med --service postfix --range today --detail high
```

### Comparison

Method #|Compose|Postfix|Logwatch
---|---|---|---
1|Min. changes|No config|Lot of search terms
2|Min. changes|Config changes|One search term

### Conclusion

There are `modern` email solutions for container, with all the bell and whistles like web GUI, IMAP mailbox, etc. However I need none of those features as shown in [GMail As Email Client](/blog/tiny-vps-postfix-p3-gmail/).

With the final piece in place, this complete my Tiny VPS Postfix series.

[^1]: [Docker Postfix](//hub.docker.com/repository/docker/jsiu/postfix)