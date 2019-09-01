---
type: "blog"
date: 2013-04-15T11:20:30Z
author: "John Siu"
title: "Tiny VPS Postfix - Part 3 - GMail as Email Client"
description: "Setup GMail to reply using your own email server and domain."
tags: ["tiny","vps","gmail","google","ubuntu","postfix","smtp"]
aliases:
  - /tiny-vps-postfix-part-3-gmail-as-your-email-client
  - /index.php/tiny-vps-postfix-part-3-gmail-as-your-email-client
  - /index.php/2013/04/15/tiny-vps-postfix-part-3-gmail-as-your-email-client
---

In [Tiny VPS Postfix](/blog/tiny-vps-postfix/) I set up a minimalistic postfix server, which will forward all email to an external email.
<!--more-->

In [Part 2](/blog/tiny-vps-postfix-part-2-non-linux-outgoing-smtp-account/) I set up postfix with sasldb to enable smtp authentication for outgoing email.

Then what about web-base email service? Is there one that can handle both so I don’t have to use additional email client to handle outgoing emails?

### One service to rule them all - GMail

Assuming you already setup your email alias to your GMail account, then there is nothing to do on server-side. Just follow the step below to set up GMail to use your server as outgoing smtp gateway.

#### Step 1

Login GMail, click the “gear” icon on the upper right, then click **Settings**.

![Step 1](https://i2.wp.com/farm9.staticflickr.com/8520/8650475865_5c9095a544.jpg?resize=257%2C263)

#### Step 2

Click **Accounts and Import** then **Add another email address you own**. I already have js@johnsiu.com setup. I will just create another one in next step.

![Step 2](https://i2.wp.com/farm9.staticflickr.com/8246/8651574124_7f057cee25.jpg?resize=500%2C269)

#### Step 3

Enter the email address and name. Remove check mark for **Treat as an alias**.

![Step 3](https://i1.wp.com/farm9.staticflickr.com/8536/8650475631_0a146f5010_z.jpg?resize=579%2C257)

#### Step 4

Check mark **Send through your.domain SMTP servers**. Then enter your server address, username and password.

![Step 4](https://i0.wp.com/farm9.staticflickr.com/8109/8651573886_e8f9e04aff_z.jpg?resize=579%2C367)

#### Step 5

If the server test passed, when composing email, you will see something like following, but with your own domain email address.

![Step 5](https://i2.wp.com/farm9.staticflickr.com/8241/8652031864_bd0ff9259b.jpg?resize=366%2C177)
