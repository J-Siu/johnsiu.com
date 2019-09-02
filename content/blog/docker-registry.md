---
type: "blog"
date: 2019-09-01T11:09:21-04:00
author: "John Siu"
title: "Docker Private Registry - How To"
description: "Setup private docker registry using official registry image."
tags: ["docker","registry","how-to"]
draft: false
---
Setup private docker registry using official registry image.
<!--more-->

Docker registry is repository of docker images. This image allow us to run a private registry in our own environment.

### Image

Docker Hub: __registry__[^1]

#### Mappings

Host|Inside Container|Usage
---|---|---
$MY_REG_DIR|/var/lib/registry|Registry persistent storage
$MY_REG_PORT|$REGISTRY_HTTP_ADDR(default :::5000)|Registry listening port
$MY_REG_CONF|/etc/docker/registry/config.yml|Registry configuration file
$MY_REG_TLS_DIR|/certs|Registry TLS certificate directory
(see [TLS](#tls) below)|$REGISTRY_HTTP_TLS_CERTIFICATE|Full path of registry tls certificate file
(see [TLS](#tls) below)|$REGISTRY_HTTP_TLS_KEY|Full path of registry tls key file

> __Note__: This exercise only cover a very basic registry setup. More configuration options can be found in official documentation[^2].

---

### Preparation

#### $MY_REG_DIR

We will use directory __/var/lib/my_registry__ as persistent storage for our private registry.

```sh
mkdir /var/lib/my_registry
```

So __$MY_REG_DIR__=/var/lib/my_registry

> __Note__: Never use __/var/lib/docker__, __/var/lib/registry__, etc as your local persistent storage. Those are mostly used by packages from package manger.

#### $MY_REG_PORT

Registry uses port 5000 inside container. We will map it to port 5001 in the host for this example.

So __$MY_REG_PORT__=5001, you can use other port as long as it does not conflict with other services running.

#### $MY_REG_CONF

__$MY_REG_CONF__ is used to map a customized registry configuration file into the container. Such customization is out of scope of this exercise. We will not define it in this exercise.

#### TLS

> __Note__: TLS is optional for this exercise.

For our private registry to use tls, we have to map a certificate directory to __/cert__ inside the container.

##### $MY_REG_TLS_DIR

We will use directory __/var/lib/my_registry_tls__ as our certificate directory.

```sh
mkdir /var/lib/my_registry_tls
```

So __$MY_REG_TLS_DIR__=/var/lib/my_registry_tls

Put the certificate and key file inside.

```sh
/var/lib/my_registry_tls/
├── certificate.pem
└── key.pem
```

##### Cert And Key Filename

Though we mapped a directory containing certificate and key files into the container, we still need to let the registry know the name of the respective files. That is where the container environmental variable comes in.

##### $REGISTRY_HTTP_TLS_CERTIFICATE

__$REGISTRY_HTTP_TLS_CERTIFICATE__ define the full path of the tls certificate file __INSIDE__ the container.

To make our compose file more portable in later section. We will define a new variable __$MY_REG_TLS_CRT__ for the certificate filename.

__$MY_REG_TLS_CRT__=certificate.pem

##### $REGISTRY_HTTP_TLS_KEY

As the previous one, __$REGISTRY_HTTP_TLS_KEY__ define the full path of the tls key file __INSIDE__ the container.

We will use __$MY_REG_TLS_KEY__ for key filename.

__$MY_REG_TLS_KEY__=key.pem

#### Preparation Summary

Variable|Value
---|---
$MY_REG_PORT|5001
$MY_REG_DIR|/var/lib/my_registry
$MY_REG_CONF|\<n/a\>
$MY_REG_TLS_DIR|/var/lib/my_registry_tls
$MY_REG_TLS_CRT|certificate.pem
$MY_REG_TLS_KEY|key.pem

---

### Test

Following are running commands using variables prepared above:

#### No TLS

```sh
docker run \
-d \
--rm \
-p ${MY_REG_PORT}:5000 \
-v ${MY_REG_DIR}:/var/lib/registry \
-v ${MY_REG_CONF}:/etc/docker/registry/config.yml \
--name my_registry \
registry
```

#### With TLS

```sh
docker run \
-d \
--rm \
-p ${MY_REG_PORT}:5000 \
-v ${MY_REG_DIR}:/var/lib/registry \
-v ${MY_REG_CONF}:/etc/docker/registry/config.yml \
-v ${MY_REG_TLS_DIR}:/certs \
-e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/${MY_REG_TLS_CRT} \
-e REGISTRY_HTTP_TLS_KEY=/certs/${MY_REG_TLS_KEY} \
--name my_registry \
registry
```

docker run option|Usage
---|---
-d|Run as daemon
--rm|Automatically remove the container when it exits
-v \<source path in host\>:\<target path in container\>|Map a path(file/dir) from host to a path in container
-p \<host port\>:\<container port\>|Map a port from host to a port in container
-e VAR_NAME=VALUE|Set environment variables inside the container
--name|Set name of container created

#### Run

Let plug in all the values manually, skipping -d, tls and custom configuration:

```sh
docker run --rm -p 5001:5000 -v /var/lib/my_registry:/var/lib/registry registry
```

Output:

```sh
time="2019-09-01T21:15:07.526325662Z" level=warning msg="No HTTP secret provided - generated random secret. This may cause problems with uploads if multiple registries are behind a load-balancer. To provide a shared secret, fill in http.secret in the configuration file or set the REGISTRY_HTTP_SECRET environment variable." go.version=go1.11.2 instance.id=629e5c12-af79-4c53-a9c5-5cae770e6555 service=registry version=v2.7.1
time="2019-09-01T21:15:07.526391891Z" level=info msg="Starting upload purge in 55m0s" go.version=go1.11.2 instance.id=629e5c12-af79-4c53-a9c5-5cae770e6555 service=registry version=v2.7.1
time="2019-09-01T21:15:07.526445081Z" level=info msg="redis not configured" go.version=go1.11.2 instance.id=629e5c12-af79-4c53-a9c5-5cae770e6555 service=registry version=v2.7.1
time="2019-09-01T21:15:07.549500041Z" level=info msg="using inmemory blob descriptor cache" go.version=go1.11.2 instance.id=629e5c12-af79-4c53-a9c5-5cae770e6555 service=registry version=v2.7.1
time="2019-09-01T21:15:07.549764469Z" level=info msg="listening on [::]:5000" go.version=go1.11.2 instance.id=629e5c12-af79-4c53-a9c5-5cae770e6555 service=registry version=v2.7.1
```

There is a warning about __REGISTRY_HTTP_SECRET__ if multiple registries running behind load balancer. That can be ignore for this exercise.

Keep this running and continue to next section.

#### Push Image

While the private registry is running, we will try pushing an image into it.

##### Pull from official registry

Pull a fresh Alpine Linux image from official registry:

```sh
docker pull alpine
```

Output:

```sh
Using default tag: latest
latest: Pulling from library/alpine
9d48c3bd43c5: Pull complete
Digest: sha256:72c42ed48c3a2db31b7dafe17d275b634664a708d901ec9fd57b1529280f01fb
Status: Downloaded newer image for alpine:latest
docker.io/library/alpine:latest
```

##### Tag To Private Registry

Tag the image to use private registry:

```sh
docker tag alpine:latest localhost:5001/alpine:latest
```

##### Push To Private Registry

```sh
docker push localhost:5001/alpine:latest
```

Output:

```sh
The push refers to repository [localhost:5001/alpine]
03901b4a2ea8: Pushed
latest: digest: sha256:acd3ca9941a85e8ed16515bfc5328e4e2f8c128caa72959a58a127b7801ee01f size: 528
```

Stop the registry with ctrl-c.

---

### Compose

We will use docker compose to make running private registry more streamline and manageable.

Create directory __registry-compose__ and create the following files inside it:

#### .env

```sh
MY_REG_TAG=latest
MY_REG_DIR=/var/lib/my_registry
MY_REG_PORT=5001
#MY_REG_CONF=
#MY_REG_TLS_DIR=/var/lib/my_registry_tls
#MY_REG_TLS_CRT=certificate.pem
#MY_REG_TLS_KEY=key.pem
```

> __MY_REG_TAG__: For version other than __latest__, check registry tags page[^3].

#### docker-compose

```yml
version: '3'
services:
  registry:
    image: registry:${MY_REG_TAG}
    ports:
      - "${MY_REG_PORT}:5000"
    volumes:
      - ${MY_REG_DIR}:/var/lib/registry
      #- ${MY_REG_TLS_DIR}=/var/lib/my_registry_tls
    #environment:
      #REGISTRY_HTTP_TLS_CERTIFICATE=/certs/${MY_REG_TLS_CRT}
      #REGISTRY_HTTP_TLS_KEY=/certs/${MY_REG_TLS_KEY}
    restart: always
```

#### Start

```sh
cd registry-compose
docker-compose up -d
```

docker-compose command/Option|Usage
---|---
up|create and start container
-d|daemon/run in background

When __docker-compose__[^4] is executed, it automatically look for two default files in current directory: __docker-compose-yml__[^5] and __.env__[^6].

It will use variables in __.env__ as environment variables. The __.env__ file must be present in the current working folder.

> Currently there is no command line option to specify an alternative __.env__ file.
>
> Variables already set in shell and command line will override __.env__.

It will create containers(s) base on __docker-compose.yml__.

> __-f__ can specify one or more compose file, other than the default.

Output:

```sh
Creating network "registry-compose_default" with the default driver
Creating registry-compose_registry_1 ... done
```

#### Status

Check status with __ps__

```sh
cd registry-compose
docker-compose up -d
```

Output:

```sh
           Name                          Command               State           Ports
---------------------------------------------------------------------------------------------
registry-compose_registry_1   /entrypoint.sh /etc/docker ...   Up      0.0.0.0:5001->5000/tcp
```

#### Stop

```sh
cd registry-compose
docker-compose stop
```

Output:

```sh
Stopping registry-compose_registry_1 ... done
```

Now our private registry is ready!

[^1]: https://hub.docker.com/_/registry
[^2]: https://docs.docker.com/registry/configuration/
[^3]: https://hub.docker.com/_/registry?tab=tags
[^4]: https://docs.docker.com/compose/
[^5]: https://docs.docker.com/compose/compose-file/
[^6]: https://docs.docker.com/compose/env-file/
