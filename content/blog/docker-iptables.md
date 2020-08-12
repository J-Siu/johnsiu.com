---
author: "John Siu"
date: 2020-06-16T16:57:06-04:00
description: "Using iptables on docker host."
tags: ["docker","iptables"]
title: "Docker and Iptables"
type: "blog"
---
Using iptables on docker host.
<!--more-->

---

### Issue : Docker Iptables Punch Through

Lets take following example:

- A docker email container with port 25 and 587 (`-p 25:25 -p 587:587)
- A docker web server container with port 80 and 443 (`-p 80:80 -p 443:443)
- Iptables rules setup to block traffic from 10.10.10.0/24 to port 25, 587, 80, 443:

  `/etc/iptables/rules.v4`

  ```txt
  -A -s 10.10.10.0/24 -p tcp -m multiport --dports 25,587 -j DROP
  -A -s 10.10.10.0/24 -p tcp -m multiport --dports 80,443 -j DROP
  ```

But 10.10.10.0/24 traffic will bypass the above two rules and reach the email and web containers. That is because docker is using its own chain for routing traffic for its containers.

---

### Fix : Custom Chain and DOCKER-USER

Docker does provide a specific chain, `DOCKER-USER`, for us to setup custom rules that need to be applied to container traffic.

To reduce effort applying rules to both default INPUT chain and DOCKER-USER chain, we will create our own chain and append it to them.

```sh
*filter

# Create custom chain
-N my_chain
# Create docker chain
-N DOCKER-USER

# Custom chain
-A my_chain -s 10.10.10.0/24 -p tcp -m multiport --dports 25,587 -j DROP
-A my_chain -s 10.10.10.0/24 -p tcp -m multiport --dports 80,443 -j DROP

-A INPUT -j my_chain
-A DOCKER-USER -j my_chain

COMMIT
```

As shown above, we will always add our rules to `my_chain`, and it will be automatically applied to both `INPUT` and `DOCKER-USER`.

---

Reference: https://docs.docker.com/network/iptables/