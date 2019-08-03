---
type: "blog"
date: 2015-11-20T01:20:42Z
tags: ["rabbitmq", "php", "amqp"]
title: "RabbitMQ PHP-AMQP RPC Example - Server"
aliases:
    - /rabbitmq-php-amqp-rpc-example-server
    - /index.php/rabbitmq-php-amqp-rpc-example-server
---

This is Part 2 of PHP-AMQP RPC implementation.
<!--more-->

I didn’t spend as much time as the client to implement command line option for the server.

### PHP-AMQP RPC Server

#### JS-amqp-rpc-server.php

```php
<?php

include (__DIR__ .'/JS-amqp-include.php');

$reuse_connection = true;
$reuse_channel    = true;
$cycle            = 1000;
$input            = "test";
$mypid            = getmypid();

//  $msg_body = implode(' ', array_slice($argv, 1));
echo "PID: $mypid\n";

$co = new AMQPConnection(array('host' => HOST, 'port' => PORT, 'vhost' => VHOST, 'login' => USER, 'password' => PASS));
$co->connect();

$ch = new AMQPChannel($co);

//  !!!Do not set name for exchange!!!
$ex = new AMQPExchange($ch);

$q_rpc = new AMQPQueue($ch);
$q_rpc->setName(Q_RPC);

function process_message(AMQPEnvelope $msg, $q) {

    global $ex;
    global $mypid;

    $re = "SERVER_PID:$mypid:{$msg->getBody()}";

    $ex->publish($re, $msg->getReplyTo(), AMQP_NOPARAM, array('correlation_id' => $msg->getCorrelationId()));
    //  Manual ack if not using AMQP_AUTOACK
    //$q->ack($msg->getDeliveryTag());

    //echo "REQ:{$msg->getBody()}:ReplyTo:{$msg->getReplyTo()}:Reply:$re\n";
    echo '.';

}

$q_rpc->consume('process_message', AMQP_AUTOACK);
?>
```
