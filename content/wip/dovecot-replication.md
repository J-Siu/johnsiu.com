---
type: "Cheat Sheet"
date: 2019-08-23T00:33:33-04:00
author: "John Siu"
title: "Dovecot Virtual Mailbox, Replication with Postfix"
description: "Configure dovecot virtual mailbox, replication with postfix."
tags: ["dovecot","postfix","how-to"]
draft: true
---
Configure dovecot virtual mailbox, replication with postfix.
<!--more-->

---

### Highlight

Active/Active Pair:

- Use Dovecot replication, no share storage(eg. NFS) required.
- User db need to be sync manually on both side

### Configure Postfix/Dovecot integration

Install dovecot
Create local id vmail(uid:5000,gid:5000)

Create /etc/dovecot/user.db

#### Create user vmail

```sh
groupadd -g 5000 vmail
useradd -m -u 5000 -g 5000 -d /var/vmail vmail
```

#### /etc/dovecot/conf.d/10-master.conf

```conf
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

#### /etc/dovecot/conf.d/10-mail.conf

```conf
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

#### /etc/dovecot/conf.d/10-auth.conf

```conf
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

#### /etc/dovecot/conf.d/10-logging.conf

```conf
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot-info.log
mail_debug = no
```

#### /etc/dovecot/conf.d/local.conf

```conf
# Doveadm (used by sync service)
service doveadm {
  inet_listener {
    # any port you want to use for this:
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

#### /etc/dovecot/conf.d/90-plugin.conf

```conf
plugin {
  mail_replica = tcp:<hostname/ip>:<doveadm_port>
}
```

### POSTFIX

#### /etc/postfix/main.cf

Add following:

```postfix
# relayhost = [<hostname/ip>]:25

#Dovecot
smtpd_sasl_type = dovecot
smtpd_sasl_path = inet:localhost:<dovecot_auth_port>
smtpd_sasl_auth_enable = yes

virtual_mailbox_domains = <domain>
#virtual_alias_maps = hash:/etc/postfix/virtual
virtual_transport = lmtp:inet:127.0.0.1:<dovecot_lmtp_port>
```

#### /etc/postfix/master.cf

```postfix
# Enable submission
submission inet n       -       n       -       -       smtpd
  -o smtpd_sasl_type=dovecot
  -o smtpd_sasl_auth_enable=yes
  -o milter_macro_daemon_name=ORIGINATING
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
```
