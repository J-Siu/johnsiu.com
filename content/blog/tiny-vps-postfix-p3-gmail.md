---
author: "John Siu"
date: 2013-04-15T11:20:30Z
description: "Setup GMail to reply using your own email server and domain."
tags: ["tiny","vps","gmail","google","ubuntu","postfix"]
title: "Tiny VPS Postfix - Part 3 - GMail as Email Client"
type: "blog"
---

In [Tiny VPS Postfix](/blog/tiny-vps-postfix/) I set up a minimalistic postfix server, which will forward all email to an external email.
<!--more-->

### Series Content

- Part 1 - [Tiny VPS Postfix](/blog/tiny-vps-postfix/)
- Part 2 - [Non-Linux Outgoing SMTP Account](/blog/tiny-vps-postfix-p2-smtp-account/)
- Part 3 - [GMail As Email Client](/blog/tiny-vps-postfix-p3-gmail/) <- You are here
- Part 4 - [Postfix with Docker](/blog/tiny-vps-postfix-docker/)
- Part 5 - [Docker, Postfix, Journald & Logwatch](/blog/docker-postfix-journald/)

In [Part 2](/blog/tiny-vps-postfix-p2-smtp-account/) I set up postfix with sasldb2 to enable smtp authentication for outgoing email.

Then what about web-base email service? Is there one that can handle both so I don’t have to use additional email client to handle outgoing emails?

### One service to rule them all - GMail

Assuming you already setup your email alias to your GMail account, then there is nothing to do on server-side. Just follow the step below to set up GMail to use your server as outgoing smtp gateway.

#### Step 1

Login GMail, click the “gear” icon on the upper right, then click **Settings**.

![Step 1](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/GmailStep1.png)

#### Step 2

Click **Accounts and Import** then **Add another email address you own**. I already have js@johnsiu.com setup. I will just create another one in next step.

![Step 1](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/GmailStep2.png)

#### Step 3

Enter the email address and name. Remove check mark for **Treat as an alias**.

![Step 1](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/GmailStep3.png)

#### Step 4

Check mark **Send through your.domain SMTP servers**. Then enter your server address, username and password.

![Step 1](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/GmailStep4.png)

#### Step 5

If the server test passed, when composing email, you will see something like following, but with your own domain email address.

![Step 1](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/GmailStep5.png)
