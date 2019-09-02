---
type: "blog"
date: 2015-11-20T01:24:46Z
tags: ["rabbitmq", "php", "amqp"]
title: "RabbitMQ PHP-AMQP RPC Example - Setup & Include"
aliases:
  - /rabbitmq-php-amqp-rpc-example-setup-include
  - /index.php/rabbitmq-php-amqp-rpc-example-setup-include
  - /index.php/2015/11/19/rabbitmq-php-amqp-rpc-example-setup-include
  - /index.php/2015/11/20/rabbitmq-php-amqp-rpc-example-setup-include
---

This is Part 3 of PHP-AMQP RPC implementation.
<!--more-->

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
