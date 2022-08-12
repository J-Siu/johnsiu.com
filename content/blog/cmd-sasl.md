---
author: "John Siu"
date: 2022-08-11T16:23:07-04:00
description: "Sasl2 command and testing"
tags: ["linux","command-line","cheatsheet"]
title: "SASL2"
type: "blog"
---
Command line and testing.
<!--more-->

### User

#### Add

```sh
saslpasswd2 -c <id>@<domain>
```
Will prompt for password.

#### Del

```sh
saslpasswd2 -d <id>@<domain>
```

#### List

```sh
sasldblistusers2
```

### Testing

#### SASL Daemon

```sh
saslauthd -a sasldb -d &
```

Only bring this up when needed. `Postfix` does not need it.

### Test

```sh
testsaslauthd -f /run/saslauthd/mux  -u <id> -r <domain> -p <password>
```

`testsaslauthd` is different than `saslpasswd` in the way that it does not email address as a whole. `-u` only take `id` and `-r`(realm) take `domain`. If you put the whole email address as `<id>@<domain>` in `-u`, the test will fail.

### Smtp Login Name

The smtp login name is the whole email address, not just the `id`.

### Linux, Docker and SASL

Though most linux distributions have sasl packages but the `sasldb2` may not be compatible with each other due to version change. This may happen when running postfix in container with different linux distribution than the host. In such case, the commands will have to be performed within the container.

When deploying across servers, test with `saslpasswd2`.