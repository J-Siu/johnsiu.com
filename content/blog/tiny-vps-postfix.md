---
type: "blog"
date: 2012-12-07T04:29:48Z
tags: ["linux", "postfix", "smtp", "tweaking", "vps"]
title: "Tiny VPS Postfix"
aliases:
    - /tiny-vps-postfix
    - /index.php/tiny-vps-postfix
    - /index.php/2012/12/07/tiny-vps-postfix
---

Finally running my own website, hosting my own blog, having my own server to do whatever I want with it.
<!--more-->

It is so tempting and logical to setup my own email service running on it. Sending and receiving email with my own server, my own email address with my own domain name … So exciting!!

But wait … Do I really want to do that??

## Minimalistic and Compromise

I have more than enough personal email addresses and already looking for ways to merge them.

I already have more than enough work email addresses that have been merged into a single account, which is setup with tones of filters to sort incoming mail into folders.

Do I really want another email account setup on my phone, my desktop, or have to check yet another webmail from browser?

No. Lets take a step back and think again.

## What is really needed … for now?

My WordPress blog, the only public website for now, is able to send directly to my personal email. So it does not need an email address.

I do want to receive system message for alerts and daily report. But again, those can be forward to my personal email.

What about a few email addresses under my domain? Hmm … alias/forward them to my personal email too.

So I actually don’t need real email account on this tiny box. But I do need a email server that can handle all the forwarding, with minimal setup!

## Minimal Alias/Forward only Email Server

Dealing with postfix daily at work, it is a no-brainer to use it here too. And I only have to change 2 configuration files.

**/etc/postfix/main.cf**

The standard *main.cf* come with Ubuntu is quite complete.

Modify line 29, 33 according to site setup. Then add line 41 to 57 for basic spam protection and close off [open relay](http://en.wikipedia.org/wiki/Open_mail_relay "Open Relay"). You really don’t want to be an open relay!

Remember to Change **MY-HOSTNAME** at line 29 and **MY-DOMAIN** to your own domain at line 33.

```ini
# See /usr/share/postfix/main.cf.dist for a commented, more complete version

# Debian specific: Specifying a file name will cause the first
# line of that file to be used as the name. The Debian default
# is /etc/mailname.
#myorigin = /etc/mailname

smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
biff = no

# appending .domain is the MUA's job.
append_dot_mydomain = no

# Uncomment the next line to generate "delayed mail" warnings
#delay_warning_time = 4h

readme_directory = no

# TLS parameters
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls=yes
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

# See /usr/share/doc/postfix/TLS_README.gz in the postfix-doc package for
# information on enabling SSL in the smtp client.

myhostname = MY-HOSTNAME
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
myorigin = /etc/mailname
mydestination = MY-DOMAIN, localhost.com, localhost
relayhost =
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
mailbox_command = procmail -a "$EXTENSION"
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all

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

**/etc/aliases**

Again, to forward system messages and additional email addresses, 3 lines of modification and we are done!

```ini
# Mail aliases for sendmail
#
# You must run newaliases(1) after making changes to this file.
#
# Required aliases
postmaster: root
MAILER-DAEMON: postmaster

# Common aliases
abuse: postmaster
spam: postmaster

# Other aliases
root: my-gmail-account@gamil.com

# js@johnsiu.com
js: my-gmail-account@gamil.com

# test@johnsiu.com
test: another-account@somewhere-else.com
```

Then do the following to update *aliases.db* and restart postfix.

```sh
cd /etc
postalias aliases
service postfix restart
```

That’s it, minimal email server setup to forward all emails to my personal email account!! All I needed for now!