---
type: "blog"
date: 2019-08-31T11:08:08-04:00
author: "John Siu"
title: "Docker Gogs - How To"
description: "Setup Gogs using official docker image."
tags: ["docker","gogs","how-to"]
---
Setup Gogs using official docker image.
<!--more-->

### Image

Docker Hub: __gogs/gogs__[^1]

#### Mappings

Host|Inside Container|Usage
---|---|---
$MY_GOGS_DIR|/data|Gogs persistent storage(configuration, data, log)
$MY_GOGS_SSH_PORT|22/tcp|Gogs ssh listening port
$MY_GOGS_WEB_PORT|3000/tcp|Gogs http listening port

> __$MY_GOGS_DIR__, __$MY_GOGS_SSH_PORT__ and __$MY_GOGS_WEB_PORT__ will be used in [compose](#compose) section below.

### Preparation

#### $MY_GOGS_DIR

Create a directory for Gogs persistent storage. We will use __/var/lib/my_gogs__ as our Gogs persistent storage.

```sh
mkdir -p /var/lib/my_gogs
```

In this case __$MY_GOGS_DIR__=/var/lib/my_gogs, you can create the directory in other location.

#### $MY_GOGS_SSH_PORT

Gogs uses standard ssh port 22 inside container. We will map it to 22222 in the host for this example.

In this case __$MY_GOGS_SSH_PORT__=22222, you can use other port as long as it does not conflict with other services running.

> __NOTE:__ Do not map to port 22 on your host. That will likely conflict with your host ssh.

#### $MY_GOGS_WEB_PORT

Gogs web interface uses port 3000 inside container. We will map it to port 3000 on the host.

In this case __$MY_GOGS_WEB_PORT__=3000, again, you can use other port as long as it does not conflict with other services running.

#### Preparation Summary

Variable|Value
---|---
$MY_GOGS_DIR|/var/lib/my_gogs
$MY_GOGS_SSH_PORT|22222
$MY_GOGS_WEB_PORT|3000

---

### Setup

#### Testing

Following is the format using variables mentioned above:

```sh
docker run \
--rm \
-v ${MY_GOGS_DIR}:/data \
-p ${MY_GOGS_SSH}:22 \
-p ${MY_GOGS_WEB}:3000 \
gogs/gogs
```

docker run option|Usage
---|---
--rm|Automatically remove the container when it exits
-v \<source path in host\>:\<target path in container\>|Map a path(file/dir) from host to a path in container
-p \<host port\>:\<container port\>|Map a port from host to a port in container

Let just plug in all the values manually for now:

```sh
docker run --rm -v /var/lib/my_gogs:/data -p 3000:3000 -p 22222:22 gogs/gogs
```

Output:

```sh
usermod: no changes
Aug 31 17:52:27 syslogd started: BusyBox v1.30.1
Aug 31 17:52:27 sshd[28]: Server listening on :: port 22.
Aug 31 17:52:27 sshd[28]: Server listening on 0.0.0.0 port 22.
2019/08/31 17:52:27 [ WARN] Custom config '/data/gogs/conf/app.ini' not found, ignore this if you're running first time
2019/08/31 17:52:27 [TRACE] Custom path: /data/gogs
2019/08/31 17:52:27 [TRACE] Log path: /app/gogs/log
2019/08/31 17:52:27 [TRACE] Build Time: 2019-08-12 02:17:33 UTC
2019/08/31 17:52:27 [TRACE] Build Git Hash: c154721f4a8f3e24d2f6fb61e74b4b64529255c2
2019/08/31 17:52:27 [TRACE] Log Mode: Console (Trace)
2019/08/31 17:52:27 [ INFO] Gogs 0.11.91.0811
2019/08/31 17:52:27 [ INFO] Cache Service Enabled
2019/08/31 17:52:27 [ INFO] Session Service Enabled
2019/08/31 17:52:27 [ INFO] SQLite3 Supported
2019/08/31 17:52:27 [ INFO] Run Mode: Development
2019/08/31 17:52:27 [ INFO] Listen: http://0.0.0.0:3000
```

If you check __/var/lib/my_gogs__, sub-directories are created:

```sh
/var/lib/my_gogs/
├── git/
├── gogs/
│   ├── conf/
│   ├── data/
│   └── log/
└── ssh/
    ├── ssh_host_dsa_key
    ├── ssh_host_dsa_key.pub
    ├── ssh_host_ecdsa_key
    ├── ssh_host_ecdsa_key.pub
    ├── ssh_host_ed25519_key
    ├── ssh_host_ed25519_key.pub
    ├── ssh_host_rsa_key
    └── ssh_host_rsa_key.pub
```

Keep it running for now and go to next step.

#### Configuration

Open your browser to __http://\<hostname/ip\>:3000__ and fill out the form as follow:

![Install](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/gogs-01.png)

Once you click __Install Gogs__:

![Done](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/gogs-02.png)

The config file is located at __${MY_GOGS_DIR}/gogs/conf/app.ini__. In this example the path will be __/var/lib/my_gogs/gogs/conf/app.ini__.

Most of the values should not be changed except __ROOT_URL__ in __[server]__ section:

```ini
...

[server]
DOMAIN           = localhost
HTTP_PORT        = 3000
ROOT_URL         = http://localhost:3000/ # Change this according to your environment.
DISABLE_SSH      = false
SSH_PORT         = 22
START_SSH_SERVER = false
OFFLINE_MODE     = false

...
```

The __ROOT_URL__ should be the URL used in your browser. For example, if you put a nginx front proxy with https at standard port 443, then __ROOT_URL__ will be __https://\<hostname\>/__.

After updating __app.ini__, stop the container with ctrl-c and run it again. The output will be shorter:

```sh
usermod: no changes
Aug 31 18:46:24 syslogd started: BusyBox v1.30.1
Aug 31 18:46:24 sshd[28]: Server listening on :: port 22.
Aug 31 18:46:24 sshd[28]: Server listening on 0.0.0.0 port 22.
2019/08/31 18:46:24 [TRACE] Custom path: /data/gogs
2019/08/31 18:46:24 [TRACE] Log path: /app/gogs/log
2019/08/31 18:46:24 [TRACE] Build Time: 2019-08-12 02:17:33 UTC
2019/08/31 18:46:24 [TRACE] Build Git Hash: c154721f4a8f3e24d2f6fb61e74b4b64529255c2
2019/08/31 18:46:24 [TRACE] Log Mode: File (Info)
2019/08/31 18:46:24 [ INFO] Gogs 0.11.91.0811
```

Stop it with ctrl-c.

---

### Compose

Gogs configuration is done. But we don't want to enter the long train of options every time restarting Gogs or after server reboot. This is where __docker-compose__ comes in.

Let create the two necessary files below.

#### .env

Create __/var/lib/my_gogs/.env__:

```ini
MY_GOGS_TAG=latest
MY_GOGS_DIR=/var/lib/my_gogs
MY_GOGS_SSH_PORT=22222
MY_GOGS_WEB_PORT=3000
```

> __MY_GOGS_TAG__: You can use specific version other than __latest__. List of valid version is in __gogs/gogs__ docker tags page[^2].

#### docker-compose.yml

Create __/var/lib/my_gogs/docker-compose.yml__:

```yml
version: '3'
services:
  gogs:
    image: gogs/gogs:${MY_GOGS_TAG}
    ports:
      - "${MY_GOGS_SSH_PORT}:22"
      - "${MY_GOGS_WEB_PORT}:3000"
    volumes:
      - ${MY_GOGS_DIR}:/data
    restart: always
```

#### Start

```sh
cd /var/lib/my_gogs
docker-compose up -d
```

docker-compose command/Option|Usage
---|---
up|create and start container
-d|daemon/run in background

When __docker-compose__[^3] is executed, it automatically look for two default files in current directory: __docker-compose-yml__[^4] and __.env__[^5].

It will use variables in __.env__ as environment variables. The __.env__ file must be present in the current working folder.

> Currently there is no command line option to specify an alternative __.env__ file.
>
> Variables already set in shell and command line will override __.env__.

It will create containers(s) base on __docker-compose.yml__.

> __-f__ can specify one or more compose file, other than the default.

Output:

```sh
Starting gogs_gogs_1 ...
Starting gogs_gogs_1 ... done
```

#### Status

Check status with __ps__

```sh
cd /var/lib/my_gogs/
docker-compose ps
```

Output:

```sh
   Name                  Command               State                       Ports
----------------------------------------------------------------------------------------------------
gogs_gogs_1   /app/gogs/docker/start.sh  ...   Up      0.0.0.0:22222->22/tcp, 0.0.0.0:3000->3000/tcp
```

#### Stop

```sh
cd /var/lib/my_gogs/
docker-compose stop
```

Output:

```sh
Stopping gogs_gogs_1 ... done
```

Now Gogs is ready!

[^1]: https://hub.docker.com/r/gogs/gogs
[^2]: https://hub.docker.com/r/gogs/gogs/tags
[^3]: https://docs.docker.com/compose/
[^4]: https://docs.docker.com/compose/compose-file/
[^5]: https://docs.docker.com/compose/env-file/
