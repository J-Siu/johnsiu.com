---
type: "blog"
date: 2019-08-18T21:55:28-04:00
author: "John Siu"
title: "Elastic Stack / ELK Quick Install - Ubuntu"
description: "Install Elastic Stack / ELK in Ubuntu"
tags: ["elastic-stack","elk","ubuntu","how-to"]
---
Install ELK / Elastic Stack in Ubuntu.
<!--more-->

---

### Preparation

Use official Elastic Stack 7.x repository:

```sh
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
apt -y install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" >> /etc/apt/sources.list.d/elastic-7.x.list
apt update
```

### Install

Using `filebeat` instead of `logstash` for lower resource requirement.

```sh
ELK_PKG="elasticsearch kibana filebeat"
apt -y install ${ELK_PKG}
```

### Auto Start

```sh
systemctl daemon-reload
systemctl enable ${ELK_PKG}
systemctl start ${ELK_PKG}
systemctl status ${ELK_PKG}
```

### URLs

Application|URL
---|---
elasticsearch|http://localhost:9200
kibana|http://localhost:5601

### Filebeat and Nginx

Enable nginx log shipping into elasticseach:

```sh
filebeat modules enable nginx
filebeat setup
```

### Browser

Connect browser to http://localhost:5601 if installing in local machine.

Use ssh tunnel if installing on remote server:

```sh
ssh <remote server> -L 5601:localhost:5601
```

Then connect browser to http://localhost:5601 .
