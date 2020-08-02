---
type: "blog"
date: 2020-06-16T20:56:11-04:00
author: "John Siu"
title: "Tiny VPS Postfix with Docker"
description: "Hosting my own email server with docker."
tags: ["docker","postfix","sasl2","tiny","vps"]
---
A refresh of my tiny vps postfix setup.
<!--more-->

### The Pain

Since I start my vps journey, I gone through 3 servers. From mid-size to small, then to the current small-size kvm.

Every time I switch boxes, I have to gather all application configuration files, copy them off the box. Then upload them to the new box.

Web server packages like Apache and Lighttpd were not that bad as their configuration are in single directory.

However I always missed a file here or there for postfix. I either forgot `/etc/aliases` or `/etc/sasldb2`. Basically, it was never a clean process.

I want something tidy, easily reproducible.

### Docker

#### Container

In the past few years I had been using kubernetes and docker. I decided to try moving postfix into container.

At first I was experimenting with other peoples' postfix containers. However they either customizing too much, automated something that conflict with my setup, or plain too old.

I end up creating my own [jsiu/postfix](/blog/docker-postfix/). I will go through my setup below.

#### Docker Compose

I choose docker over kubernetes because of simplicity. Kubernetes is a bit over kill for a single box with only 3 simple services(postfix, git and web).

I created a directory call `compose`, following is the final structure:

```txt
compose/
├── 00_VOL
│   ├── caddyfile
│   └── postfix
│       ├── access
│       ├── aliases
│       ├── canonical
│       ├── generic
│       ├── header_checks
│       ├── main.cf
│       ├── main.cf.proto
│       ├── master.cf
│       ├── master.cf.proto
│       ├── postfix-files
│       ├── postfix-files.d
│       ├── relocated
│       ├── sasl2
│       │   ├── sasldb2
│       │   └── smtpd.conf
│       ├── transport
│       └── virtual
├── .env
└── docker-compose.yml
```

The contents of my docker compose are as follow:

`.env`

```ini
TZ=America/New_York
TZ_FILE=/etc/localtime

# Caddy
CADDY_IMG=caddy
CADDY_CNF=./00_VOL/caddyfile
CADDY_DAT=CADDY_DAT
CADDY_WWW=CADDY_WWW

# postfix
POSTFIX_CNF=./00_VOL/postfix
POSTFIX_QUE=POSTFIX_QUE
POSTFIX_HOSTNAME=johnsiu.com
```

`docker-compose.yml`

```yml
version: "3.7"

services:
  caddy:
    restart: unless-stopped
    logging:
      options:
        tag: "{{.Name}}"
    image: ${CADDY_IMG}
    container_name: caddy
    network_mode: host
    #ports:
    #  - 80:80
    #  - 443:443
    volumes:
      - ${TZ_FILE}:${TZ_FILE}:ro
      - ${CADDY_CNF}:/etc/caddy/Caddyfile
      - ${CADDY_DAT}:/data
      - ${CADDY_WWW}:/www:ro

  postfix_container:
    restart: unless-stopped
    image: jsiu/postfix
    container_name: postfix_container
    hostname: ${POSTFIX_HOSTNAME}
    domainname: ${POSTFIX_HOSTNAME}
    logging:
      options:
        tag: "{{.Name}}"
    ports:
      - "25:25"
      - "587:587"
    volumes:
      - /dev/log:/dev/log
      - ${POSTFIX_CNF}:/postfix:ro
      - ${POSTFIX_QUE}:/queue
      - ${CADDY_DAT}:/data:ro
    environment:
      - P_TZ=${TZ}

volumes:
  POSTFIX_QUE:
```

The reason I include caddy settings also is because I am using caddy auto certificate for my postfix, which will be explained below.

#### Postfix Configuration

The postfix configuration is basically the same as my original [Tiny VPS Postfix](/blog/tiny-vps-postfix/), with slight modification explained below.

Copy existing postfix configuration files into `00_VOL/postfix`, or populate it with the default ones from image. Then modify `main.cf`:

```ini
alias_database = hash:/etc/postfix/aliases
alias_maps = hash:/etc/postfix/aliases
append_dot_mydomain = no
biff = no
command_directory = /usr/sbin
compatibility_level = 2
daemon_directory = /usr/libexec/postfix
data_directory = /var/lib/postfix
debug_peer_level = 2
local_recipient_maps = $alias_maps
mail_owner = postfix
mailq_path = /usr/bin/mailq
mydestination = $myhostname
  mydomain = johnsiu.com
  myhostname = $mydomain
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
newaliases_path = /usr/bin/newaliases
  queue_directory = /queue
readme_directory = no
recipient_delimiter = +
sendmail_path = /usr/sbin/sendmail
setgid_group = postdrop
shlib_directory = /usr/lib/postfix
smtp_tls_security_level = may
smtp_tls_session_cache_database		= btree:${data_directory}/smtp_scache
smtpd_banner = $myhostname ESMTP $mail_name
smtpd_sasl_auth_enable = yes
  smtpd_tls_cert_file = /data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/johnsiu.com/johnsiu.com.crt
  smtpd_tls_key_file = /data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/johnsiu.com/johnsiu.com.key
smtpd_tls_mandatory_ciphers = medium
smtpd_tls_mandatory_protocols = !SSLv2,!SSLv3,!TLSv1,!TLSv1.1
smtpd_tls_protocols=!SSLv2,!SSLv3,!TLSv1,!TLSv1.1
smtpd_tls_session_cache_database	= btree:${data_directory}/smtpd_scache
smtpd_use_tls = yes
tls_medium_cipherlist = AES256+EECDH:AES128+EECDH
unknown_local_recipient_reject_code = 550

smtpd_recipient_restrictions =
	permit_mynetworks,
	permit_sasl_authenticated,
	reject_invalid_hostname,
	reject_non_fqdn_hostname,
	reject_non_fqdn_sender,
	reject_non_fqdn_recipient,
	reject_unknown_recipient_domain,
	reject_unlisted_recipient,
	reject_unauth_destination,
	reject_rbl_client cbl.abuseat.org,
	reject_rbl_client bl.spamcop.net,
	reject_rbl_client relays.mail-abuse.org,
	reject_rbl_client dnsbl.proxybl.org,
	reject_rbl_client truncate.gbudb.net,
	reject_rbl_client dnsbl.njabl.org,
	permit
```

Line|Comment
---|---
14, 15|Hostname need to be hardcode here as postfix is inside container.
18|We want a persistent queue which can survive container restart. `/queue` is mapped to `${POSTFIX_QUE}` in compose file line 36.
28, 29|We are using certificate from Caddy, which are saved in volume `CADDY_DAT` in compose file line 18. Postfix map `CADDY_DAT` to `/data` in compose file line 37.

#### SASL

`00_VOL/postfix/sasl2/smtpd.conf`

```ini
pwcheck_method: auxprop
auxprop_plugin: sasldb
mech_list: PLAIN LOGIN
```

I copied my original `/etc/aliases`, `/etc/sasldb2` into `00_VOL/postfix`. Started up docker compose:

```sh
cd compose
docker-compose up -d
```

My postfix is now up and running in docker container.

### The PRO

I made `compose` into a git repository and checked in my git server. If I want to change my vps box again, I just have to clone `compose` to the new box. I can also backup `compose` with a single tar command.

### The CON

#### Localhost Email

Localhost email need additional package to forward into postfix. Fortunately, both `msmtp` and `opensmtpd` with minimal configuration can do exactly that:

1. msmtp

    ```sh
    apt install msmtp-mta
    ```

    `/etc/msmtprc`

    ```ini
    domain  johnsiu.com
    host    ::1
    port    25
    ```

    Here, `domain` is actually hostname used by msmtp during HELO handshake with postfix.

2. opensmtpd

    ```sh
    apt install opensmtpd
    ```

    Its configuration file: `/etc/smtpd.conf`

    ```ini
    action "relay" relay host smtp://[::1]
    match from local for any action "relay"
    ```

I picked `msmtp` as it is just a command line replacement for sendmail and not running as daemon. I put a copy of the config in `compose` directory and checked in git also.

#### Certificate Refresh

As illustrated above, postfix container is using caddy auto certificates. I haven't find a way to auto detect certificate update, so I just use a cronjob to restart postfix container weekly.

```sh
0 0 * * 1       cd $HOME/compose && /usr/bin/docker-compose restart postfix_container
```

### Conclusion

I did spend quiet sometime on debugging and fine tuning my `jsiu/postfix` container, and optimizing the compose file. However this is beneficial in the long run as backup and deploy are easily reproducible.