---
type: "blog"
date: 2015-11-26T11:12:59Z
tags: ["ubuntu", "rabbitmq", "php", "amqp"]
title: "RabbitMQ Quick Install on Ubuntu"
aliases:
    - /rabbitmq-quick-install-on-ubuntu
    - /index.php/rabbitmq-quick-install-on-ubuntu
    - /index.php/2015/11/26/rabbitmq-quick-install-on-ubuntu
---

- Install RabbitMQ

**Note**: Before installation, hostname/IP must be configure properly in `/etc/hosts` or resolvable through DNS.
<!--more-->

```sh
sudo apt-get install rabbitmq-server`
```

Check RabbitMQ after installation

```sh
sudo service rabbitmq-server status
```

Enable RabbitMQ Management Plugin, this give you the web interface

```sh
sudo rabbitmq-plugins enable rabbitmq_management
```

Accessing RabbitMQ Web Console

```txt
http://<hostname/IP>:15672
```

Create RabbitMQ users

```sh
sudo rabbitmqctl add_user <username> <password>
```

Set user as administrator

```sh
sudo rabbitmqctl set_user_tags <username> administrator
```

**Note**: RabbitMQ come with default guest account

```js
Username: guest
Password: guest
```

You may want to disable/delete this account

Create RabbitMQ virtual host

```sh
sudo rabbitmqctl add_vhost <virtual host name>
```

**Note**: RabbitMQ come with default virtual host “/”, and guest account has full access

Grant user full permissions to new vhost

```sh
sudo rabbitmqctl set_permissions -p <virtual host name> <username> ".*" ".*" ".*"
```
