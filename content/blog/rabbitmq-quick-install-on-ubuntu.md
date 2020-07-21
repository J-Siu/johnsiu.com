---
author: "John Siu"
date: 2015-11-26T11:12:59Z
description: "RabbitMQ Quick Install on Ubuntu."
tags: ["ubuntu","rabbitmq","amqp","how-to"]
title: "RabbitMQ Quick Install on Ubuntu"
type: "blog"
---
Step by Step.
<!--more-->

---

> __Note__: Before installation, hostname/IP must be configure properly in `/etc/hosts` or resolvable through DNS.

### Install

```sh
sudo apt-get install rabbitmq-server`
```

#### Verify

```sh
sudo service rabbitmq-server status
```

### Enable Management Plugin

This give you the web interface.

```sh
sudo rabbitmq-plugins enable rabbitmq_management
```

Accessing RabbitMQ Web Console:

```txt
http://<hostname/IP>:15672
```

### Create Users

```sh
sudo rabbitmqctl add_user <username> <password>
```

#### Set User As Administrator

```sh
sudo rabbitmqctl set_user_tags <username> administrator
```

> __Note__: RabbitMQ come with default guest account.

```js
Username: guest
Password: guest
```

You may want to disable/delete this account

### Create Virtual Host

```sh
sudo rabbitmqctl add_vhost <virtual host name>
```

> __Note__: RabbitMQ come with default virtual host “/”, and guest account has full access

### Granting Permission

Following will grant user full permissions to new vhost:

```sh
sudo rabbitmqctl set_permissions -p <virtual host name> <username> ".*" ".*" ".*"
```
