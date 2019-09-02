---
type: "blog"
date: 2015-11-20T01:16:37Z
tags: ["rabbitmq", "php", "amqp"]
title: "RabbitMQ PHP-AMQP RPC Example - Client"
aliases:
  - /rabbitmq-php-amqp-rpc-example-client
  - /index.php/rabbitmq-php-amqp-rpc-example-client
  - /index.php/2015/11/19/rabbitmq-php-amqp-rpc-example-client
  - /index.php/2015/11/20/rabbitmq-php-amqp-rpc-example-client
---

This is a 3-part blog about PHP-AMQP RPC implementation.
<!--more-->

1. – Client
2. – Server
3. – Setup & Include

I created this with the following goal:

- Learn about RabbitMQ
- Learn how PHP can work with Rabbitmq
- Some performance PHP-Rabbitmq performance testing

Feel free to leave me message if you have any question.

### PHP-AMQP RPC Client

#### JS-amqp-rpc-client.php

```php
#!/usr/bin/php

<?php

include (__DIR__ .'/JS-amqp-include.php');

class RpcClient {

    private $co;// Connection
    private $ch;// Channel
    private $cb;// Callback
    private $id;// Correlation ID
    private $re;// Reply

    public function __construct() {
        //  Connect to AMQP server
        $this->co = new AMQPConnection(array('host' => HOST, 'port' => PORT, 'vhost' => VHOST, 'login' => USER, 'password' => PASS));
        $this->co->pconnect();
        //  Create channel
        $this->ch = new AMQPChannel($this->co);
        //  Define Exchange
        $this->ex = new AMQPExchange($this->ch);
        $this->ex->setName(X_DIR);

        /*
        RPC queue
        Do not bind
        Do not set AMQP_EXCLUSIVE, if re-using queue for multiple request
         */
        $this->cb = new AMQPQueue($this->ch);
        $hostname = gethostname();
        $pid      = getmypid();
        //  It is optional to set the callback queue name
        $this->cb->setName("$hostname.$pid");
        $this->cb->declareQueue();

    }

    public function reply($re, $q) {
        if ($re->getCorrelationId() == $this->id) {
            $this->re = $re->getBody();
            return false;
        }
    }

    public function request($msg) {
        $this->re = null;
        $this->id = uniqid();// Correlation ID

        $call_msg = "REQ_ID:$this->id:CH_ID:{$this->ch->getChannelId()}:$msg";

        $this->ex->publish($call_msg, K_RPC, AMQP_NOPARAM, array(
                'correlation_id' => $this->id,
                'reply_to'       => $this->cb->getName()
            ));

        //  Basic Consume
        $this->cb->consume(array($this, 'reply'), AMQP_AUTOACK);

        while (!$this->re) {
            $this->ch->wait();
        }

        return $this->re;
    }

}

function k_pad($i) {
    $pad = '';
    for ($j = 0; $j < $i*1024; $j++) {
        $pad .= '@';
    }
    return $pad;
}

//  Command Line Options

$cycle = 10;
$msg   = '';
$pad   = '';
$prn   = false;

function usage() {
    echo "Usage: php ".__FILE__ ."\n";
    echo "-k(num) Add padding size in k\n";
    echo "-m(msg) Message\n";
    echo "-n(num) Number of request (Default 10)\n";
    echo "-p Print reply\n";
    echo "-h Print this message\n";
    echo "No space between option siwtch and parameter.\n";
}

$ops = getopt("k::m::n::ph");
foreach (array_keys($ops) as $op)switch ($op) {
    case 'k':
        $pad = k_pad($ops['k']);
        break;
    case 'm':
        $msg = $ops['m'];
        break;
    case 'n':
        $cycle = $ops['n'];
        break;
    case 'p':
        $prn = true;
        break;
    case 'h':
        usage();
        exit(1);
}

//  RPC Loop

$rpc   = new RpcClient();
$mypid = getmypid();
$reply = '';

$time_start = microtime(true);

for ($i = 0; $i < $cycle; $i++) {
    $r = $rpc->request("CLIENT_PID:$mypid:REQ:$i:$msg:$pad");
    if ($prn) {
        $reply .= "$r\n";
    }
}

$time_end = microtime(true);
$time     = $time_end-$time_start;
$rate     = $cycle/$time;

//  Output
if ($prn) {
    echo $reply;
}

echo "Time:$time:Rate:$rate\n";
?>
```
