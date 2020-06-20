---
type: "blog"
date: 2020-06-20
author: "John Siu"
title: "Dovecot Virtual Mailbox, Replication with Postfix"
description: "Configure dovecot virtual mailbox, replication with postfix."
tags: ["dovecot","postfix","how-to"]
draft: false
---
Configure dovecot virtual mailbox, replication with postfix.
<!--more-->

---

### Highlight

Active/Active Pair:

- Use Dovecot replication, no share storage(eg. NFS) required.
- User db need to be sync manually on both side

### Linux Preparation

#### Create user vmail

```sh
groupadd -g 5000 vmail
useradd -m -u 5000 -g 5000 -d /var/vmail vmail
```

### Dovecot

#### Services

`/etc/dovecot/conf.d/10-master.conf`

```ini
service imap-login {
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
  process_min_avail = 4
}

service lmtp {
  inet_listener {
    address	= 127.0.0.1
    port	= <dovecot_lmtp_port>
  }
  user = vmail
  executable = lmtp -L
}

service auth {
 inet_listener {
    address	= 127.0.0.1
    port	= <dovecot_auth_port>
  }
}

service auth-worker {
  user = $default_internal_user
}
```

`<dovecot_lmtp_port>` and `<dovecot_auth_port>` have to match values used in `main.cf` in [Postfix Dovecot Integration](#dovecot-integration) below.

#### IMAP Folders

`/etc/dovecot/conf.d/10-mail.conf`

```ini
mail_plugins = $mail_plugins notify replication
mail_location = maildir:~/maildir
namespace inbox {
  inbox = yes
  type = private
  separator = /
  hidden = no
  mailbox Trash {
    auto = no
    special_use = \Trash
  }
  mailbox Drafts {
    auto = no
    special_use = \Drafts
  }
  mailbox Sent {
    auto = subscribe # autocreate and autosubscribe the Sent mailbox
    special_use = \Sent
  }
  mailbox "Sent Messages" {
    auto = no
    special_use = \Sent
  }
  mailbox Spam {
    auto = create # autocreate Spam, but don't autosubscribe
    special_use = \Junk
  }
}
```

#### Replication

Enable replication plugin.

`/etc/dovecot/conf.d/90-plugin.conf`

```ini
plugin {
  mail_replica = tcp:<remote hostname/ip>:<doveadm_port>
}
```

`/etc/dovecot/conf.d/local.conf`

```ini
# Doveadm (used by sync service)
service doveadm {
  inet_listener {
    # Any port
    port = <doveadm_port>
		password = <doveadm_password>
  }
}

# Fix permissions for vmail user
service aggregator {
  fifo_listener replication-notify-fifo {
    user = vmail
    group = vmail
    mode = 0660
  }
  unix_listener replication-notify {
    user = vmail
    group = vmail
    mode = 0660
  }
}
```

#### User Database

We will use the simple `passwd-file` type user database.

`/etc/dovecot/conf.d/10-auth.conf`

```ini
auth_mechanisms = plain
disable_plaintext_auth = no
passdb {
  driver = passwd-file
  args = username_format=%u /etc/dovecot/user.db
}
userdb {
  driver = passwd-file
  default_fields = uid=vmail gid=vmail home=/var/vmail/%u
  args = username_format=%u /etc/dovecot/user.db
}
```

Create `/etc/dovecot/user.db`:

```ini
<email-address>:<crypt-password>
user1@example.com:password1
user2@example.com:password2
```

Create crypt-password:

```sh
doveadm pw -u <email> -p <password>
doveadm pw -u test@test.com -p test
{CRYPT}$2y$05$6caJDCFEge0qA1vBxjDWVOftUzwjrDx794c88gtVB0we6RlchrWxu
```

Above example will be as follow in `user.db`

```ini
test@test.com:{CRYPT}$2y$05$6caJDCFEge0qA1vBxjDWVOftUzwjrDx794c88gtVB0we6RlchrWxu
```

Other dovecote user database types can be found [here](https://doc.dovecot.org/configuration_manual/authentication/user_databases_userdb/).

#### Logging

`/etc/dovecot/conf.d/10-logging.conf`

```ini
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot-info.log
mail_debug = no
```

### Postfix

#### Dovecot Integration

`/etc/postfix/main.cf` add following:

```ini
# relayhost = [<hostname/ip>]:25

#Dovecot
smtpd_sasl_type = dovecot
smtpd_sasl_path = inet:localhost:<dovecot_auth_port>
smtpd_sasl_auth_enable = yes

virtual_mailbox_domains = <domain>
#virtual_alias_maps = hash:/etc/postfix/virtual
virtual_transport = lmtp:inet:127.0.0.1:<dovecot_lmtp_port>
```

`/etc/postfix/master.cf` modify `submission`:

```ini
# Enable submission
submission inet n       -       n       -       -       smtpd
  -o smtpd_sasl_type=dovecot
  -o smtpd_sasl_auth_enable=yes
  -o milter_macro_daemon_name=ORIGINATING
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
```
