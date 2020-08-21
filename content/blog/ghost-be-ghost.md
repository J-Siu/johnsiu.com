---
author: "John Siu"
date: 2017-04-08T15:12:12Z
description: "Should I keep on adding https to Ghost?"
tags: ["ghost", "http2", "https", "proxy", "blog"]
title: "Let Ghost be Ghost"
type: "blog"
---

I moved my blog to [Ghost](//ghost.org) a few months ago. Like many other self hosting Ghost users, I keep asking why Ghost does not fully support https out of the box.
<!--more-->
### Sometimes Assumption

We took the question to various online forums and hoped for an easy answer. We took it to Ghost's GitHub issue page, and thought it was a simple request.

Ghost development team sticked with their official answer : Use Nginx, Apache or other https front end.

### Does Not Match Reality

With the assumption that it should be an easy task, I started to toy around with different ideas to make this happen in a pure Node.js way, without Nginx or Apache.

I came up with "solutions" like [Ghost Https Index.js](/blog/ghost-https-index-js-in-github/) by modifying the Ghost's index.js. Then put together a node.js proxy version too. Did both in a short period of time without much planning. They worked, but story didn't end there.

During that time I also upgraded my Ghost installation from 0.11.4 to 0.11.7. Ghost upgrade went well. But not fully functional with my modified index.js.

The solution was not future proof, it was not even working at that moment!

### Until You Get Your Hands Dirty

I focused on the proxy version, which is future proof by nature. At the same time, I wanted to have a proper, up to date https setup. [Qualys SSL server test](//www.ssllabs.com/ssltest/) was used to check https settings, and I kept improving it.

At that point I realized it was NOT a simple task if I want to do it properly. I was facing multiple issues:

- It is a bad idea to modify official package file unless you are not going to do upgrade ever (or not planning to support your published code)! It will be a pain to repeat the steps every time the package is updated. It is difficult, if possible, to be future proof. It is just not the right way!

- A modern HTTPS, or more precisely, a secure web front end setup, is more than just stuffing the certificate into the configuration. It involve picking(or excluding) ciphers, and choosing, configuring 10+ http headers! All those choices have to be made base on your targeted audience.

- Configuration file became so bulky, ugly and difficult to follow. I could not create clean and easy to understand documentation out of it. I had to keep refactoring it.

> *Software that cannot be documented properly is software that no one can use.*

- One can imagine if configuration is a mess, then main program will be an even bigger mess. The two go hand in hand.

- Cannot start Ghost properly with my own wrapper. RTFM ... again!!

I had to made a task list, layout the flow. I ended up having two git repos, with one discontinued, and eight revisions in total. Then finally came up with something I felt good about, something that won't turn into a support nightmare.

A half day exercise became three weekends plus a few hours here and there.

All started from something I assumed was a *simple task*!!(face palm)

### What If

> *Incomplete information lead to false assumption and wrong conclusion.*

After this exercise, I can imagine if Ghost Blog include full https support in their project, the development team will be bombarded non-stop with https and http-header questions and requests. Their web site may need 20 or more pages on https and headers configurations. Https support will become a huge resource sink hole.

I have to agree, let Ghost be the blogging platform and let front end or wrapper(mine) take care of HTTPS.

__PS: My final solution?__ [___HERE___](/blog/ghost-h2ghost/)
