---
type: "blog"
date: 2019-08-21T03:08:51-04:00
author: "John Siu"
title: "Elastic Stack / ELK X-Pack Authentication"
description: "Enable Elastic Stack / ELK X-Pack Authentication in Ubuntu"
tags: ["elastic-stack","elk","ubuntu"]
draft: true
---
Enable Elastic Stack / ELK X-Pack Authentication in Ubuntu.
<!--more-->
> Instructions/paths here assume Elastic Stack is installed with official 7.x repository. See [previous post](/blog/elk-ubuntu/).

### Stop Filebeat / Kibana

Once authentication is enable, all services will need to authenticate with elasticsearch. Stop them until all configurations are done.

```sh
systemctl stop elasticsearch filebeat kibana
```

### Configure Elasticsearch

Add following to end of `/etc/elasticsearch/elasticsearch.yml`:

```yml
xpack.security.enabled: true
xpack.security.authc.accept_default_password: false
```

### Start Elasticsearch

Start elasticsearch to enable X-Pack authentication:

```sh
systemctl start elasticsearch
```

### Setup Password

> You may have to wait a minute or two for elasticsearch to be fully up.

Run `/usr/share/elasticsearch/bin/elasticsearch-setup-passwords` with option `interactive`:

```sh
cd /usr/share/elasticsearch/bin
./elasticsearch-setup-passwords interactive
```

Output:

```sh
Initiating the setup of passwords for reserved users elastic,apm_system,kibana,logstash_system,beats_system,remote_monitoring_user.
You will be prompted to enter passwords as the process progresses.
Please confirm that you would like to continue [y/N]y

Enter password for [elastic]:
Reenter password for [elastic]:
Enter password for [apm_system]:
Reenter password for [apm_system]:
Enter password for [kibana]:
Reenter password for [kibana]:
Enter password for [logstash_system]:
Reenter password for [logstash_system]:
Enter password for [beats_system]:
Reenter password for [beats_system]:
Enter password for [remote_monitoring_user]:
Reenter password for [remote_monitoring_user]:
Changed password for user [apm_system]
Changed password for user [kibana]
Changed password for user [logstash_system]
Changed password for user [beats_system]
Changed password for user [remote_monitoring_user]
Changed password for user [elastic]
```

### Configure Filebeat / Kibana

#### /etc/kibana/kibana.yml

Add following at end of file:

```yml
xpack.security.encryptionKey: "<32 random characters here>"
# sessionTimeout in msec.
xpack.security.sessionTimeout: 900000
```

Search `elasticsearch.username` and uncomment:

```yml
elasticsearch.username: "kibana"
elasticsearch.password: "<your password>"
```

#### /etc/filebeat/filebeat.yml

Search `output.elasticsearch`, below `protocol`, add or uncomment as follow:

```yml
  # Optional protocol and basic auth credentials.
  #protocol: "http"
  username: "elastic"
  password: "<your password>"
```

### Start FileBeat / Kibana

```sh
systemctl start filebeat kibana
```

### Login Kibana

Kibana site should show login page. Login using `elastic` and password. You can create more users in the __Management -> Security__.
