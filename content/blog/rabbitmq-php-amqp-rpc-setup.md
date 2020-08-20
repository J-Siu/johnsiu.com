---
author: "John Siu"
date: 2015-11-20T01:24:46Z
description: "RabbitMQ PHP-AMQP RPC Example - Setup & Include"
tags: ["rabbitmq", "php", "amqp"]
title: "RabbitMQ PHP-AMQP RPC - Setup"
type: "blog"
---

This is Part 3 of PHP-AMQP RPC implementation.
<!--more-->

### Series Content

1. [Client](/blog/rabbitmq-php-amqp-rpc-client/)
2. [Server](/blog/rabbitmq-php-amqp-rpc-server/)
3. [Setup & Include](/blog/rabbitmq-php-amqp-rpc-setup/) <- You are here

This part give you the include file and RabbitMQ setup I am using.

### PHP-AMQP RPC Setup

#### JS-amqp-setup.php

```php
<?php

include (__DIR__ .'/JS-amqp-include.php');

/*
$co = new AMQPConnection(array('host' => HOST, 'port' => PORT, 'vhost' => VHOST, 'login' => USER, 'password' => PASS));
 */
$co = new AMQPConnection();
$co->setHost(HOST);
$co->setLogin(USER);
$co->setPassword(PASS);
$co->setVHost(VHOST);
$co->connect();

$ch = new AMQPChannel($co);

$ex = new AMQPExchange($ch);
$ex->setName(X_DIR);
$ex->setType(XT_DIR);
$ex->setFlags(AMQP_DURABLE);
$ex->declareExchange();

$q_txt = new AMQPQueue($ch);
$q_txt->setName(Q_TXT);
$q_txt->setFlags(AMQP_DURABLE);
$q_txt->declareQueue();

$q_txt->bind(X_DIR, '');

$q_rpc = new AMQPQueue($ch);
$q_rpc->setName(Q_RPC);
$q_rpc->setFlags(AMQP_DURABLE);
$q_rpc->declareQueue();

$q_rpc->bind(X_DIR, K_RPC);

echo $ex->getType();

//$ch->close();
$co->disconnect();

?>
```

### PHP-AMQP RPC Include

#### JS-amqp-include.php

```php
<?php
define('HOST', 'rmq-sevr');
define('PORT', 5672);
define('USER', 'rmq-user');
define('PASS', 'rmq-pass');
define('VHOST', 'rmq-vhost');

// Name
define('X_DIR', 'X_DIR');
define('Q_TXT', 'Q_TXT');
define('Q_RPC', 'Q_RPC');
define('K_RPC', 'K_RPC');

// Content Type
define('CT_JSON', 'application/json');
define('CT_TEXT', 'text/plain');

// Exchange Type
define('XT_DIR', 'direct');
define('XT_FAN', 'fanout');
define('XT_TOP', 'topic');
?>
```
