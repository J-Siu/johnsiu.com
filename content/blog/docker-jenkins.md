---
type: "blog"
date: 2019-09-14T16:09:23-04:00
author: "John Siu"
title: "Docker Jenkins - How To"
description: "Setup Jenkins using official docker image."
tags: ["docker","jenkins","how-to"]
---
Setup Jenkins using official docker image.
<!--more-->

### Image

Docker Hub: __jenkins/jenkins:lts__[^1]

#### Mappings

Host|Inside Container|Usage
---|---|---
$MY_JENKINS_IMG|N/A|Jenkins image name
$MY_JENKINS_NAME|N/A|Docker container name
$MY_JENKINS_HTTP|default:8080, see $JENKINS_OPTS below|Jenkins http port
$MY_JENKINS_HTTPS|see $JENKINS_OPTS below|Jenkins https port
$MY_JENKINS_SLAV|$JENKINS_SLAVE_AGENT_PORT 50000|Jenkins slave agent port
$MY_JENKINS_DATA|/var/jenkins_home|Persistent storage
$MY_JENKINS_OPTS|$JENKINS_OPTS|Environmental variable for jenkins options
$MY_JENKINS_CERT|see $JENKINS_OPTS below, map to --httpsCertificate|Path of certificate file to be mapped into container
$MY_JENKINS_KEY|see $JENKINS_OPTS below, map to --httpsPrivateKey|Path of key file to be mapped into container

JENKINS_OPTS|Usage
---|---
--httpPort|default 8080, no http if -1
--httpsPort|https ports if defined. Must also define
--httpsCertificate|Full path of certification file inside container
--httpsPrivateKey|Full path of key file inside container
--prefix|Site URL prefix. eg. http://mydomain.com/jenkins, then --prefix=/jenkins

---

### Preparation

In this exercise, we will use following setup:

Variable|Value|Comment
---|---|---
$MY_JENKINS_IMG|jenkins/jenkins:lts|Jenkins image name
$MY_JENKINS_NAME|my_jenkins|Docker container name
$MY_JENKINS_HTTP|-1|We are not using http
$MY_JENKINS_HTTPS|8443|We will use port 8443 for https
$MY_JENKINS_SLAV|50000|Same as default in container
$MY_JENKINS_DATA|/var/my_jenkins_home|Persistent storage
$MY_JENKINS_CERT|/var/my_jenkins_home/cert.pem|Remember to define in JENKINS_OPTS, but no separate volume mapping needed
$MY_JENKINS_KEY|/var/my_jenkins_home/key.pem|Remember to define in JENKINS_OPTS, but no separate volume mapping needed

JENKINS_OPTS|Value|Comment
---|---|---
--httpPort|$MY_JENKINS_HTTP|No http port
--httpsPort|$MY_JENKINS_HTTPS|This will be 8443 as defined above
--httpsCertificate|/var/jenkins_home/cert.pem|Included in $MY_JENKINS_DATA mapping
--httpsPrivateKey|/var/jenkins_home/key.pem|Included in $MY_JENKINS_DATA mapping

So our __$JENKINS_OPTS__ is as follow:

```sh
--httpPort=$MY_JENKINS_HTTP --httpsPort=$MY_JENKINS_HTTPS --httpsCertificate=/var/jenkins_home/cert.pem --httpsPrivateKey=/var/jenkins_home/key.pem
```

---

### Test

Following are running commands using variables prepared above:

With HTTP only:

```sh
docker run \
--rm \
--name ${MY_JENKINS_NAME} \
-p ${MY_JENKINS_HTTP}:${MY_JENKINS_HTTP} \
-p ${MY_JENKINS_SLAV}:50000 \
-v ${MY_JENKINS_DATA}:/var/jenkins_home \
${MY_JENKINS_IMG}
```

With HTTPS:

```sh
docker run \
--rm \
--name ${MY_JENKINS_NAME} \
-p ${MY_JENKINS_HTTPS}:${MY_JENKINS_HTTPS} \
-p ${MY_JENKINS_SLAV}:50000 \
-v ${MY_JENKINS_DATA}:/var/jenkins_home \
-e JENKINS_OPTS=${JENKINS_OPTS}
${MY_JENKINS_IMG}
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

Plug in all values manually, and run it as follow:

With HTTP only:

```sh
docker run \
--rm \
--name my_jenkins \
-p 8080:8080 \
-p 50000:50000 \
-v /var/my_jenkins_home:/var/jenkins_home \
jenkins/jenkins:lts
```

With HTTPS:

```sh
docker run \
--rm \
--name my_jenkins \
-p 8443:8443 \
-p 50000:50000 \
-v /var/my_jenkins_home:/var/jenkins_home \
-e JENKINS_OPTS="--httpPort=-1 --httpsPort=8443 --httpsCertificate=/var/jenkins_home/cert.pem --httpsPrivateKey=/var/jenkins_home/key.pem" \
jenkins/jenkins:lts
```

Output:

```sh
*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

<a 32-characters password here->

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************

2019-09-15 07:46:54.728+0000 [id=46]    INFO    hudson.model.UpdateSite#updateData: Obtained the latest update center data file for UpdateSource default
2019-09-15 07:46:56.381+0000 [id=46]    INFO    h.m.DownloadService$Downloadable#load: Obtained the updated data file for hudson.tasks.Maven.MavenInstaller
2019-09-15 07:46:56.381+0000 [id=46]    INFO    hudson.util.Retrier#start: Performed the action check updates server successfully at the attempt #1
2019-09-15 07:46:56.387+0000 [id=46]    INFO    hudson.model.AsyncPeriodicWork$1#run: Finished Download metadata. 15,168 ms
2019-09-15 07:46:56.518+0000 [id=29]    INFO    hudson.model.UpdateSite#updateData: Obtained the latest update center data file for UpdateSource default
2019-09-15 07:46:56.804+0000 [id=28]    INFO    jenkins.InitReactorRunner$1#onAttained: Completed initialization
2019-09-15 07:46:56.832+0000 [id=20]    INFO    hudson.WebAppMain$3#run: Jenkins is fully up and running
```

Access the jenkins site in browser with http://\<hostname|ip\>:8080/ or http://\<hostname|ip\>:8443/, depending on your setup.

Use the password shown in your terminal to login the site, choose plugins and setup your first administrator account.

Once administrator account is setup, go back your terminal and use ctrl-c to stop the container.

---

### Compose

We will use docker compose to make running private registry more streamline and manageable.

Create a directory __compose_jenkins__ and create the following files inside it:

#### .env

```sh
MY_JENKINS_IMG=jenkins/jenkins:lts
MY_JENKINS_NAME=my_jenkins
MY_JENKINS_HTTP=8080
MY_JENKINS_HTTPS=8443
MY_JENKINS_SLAV=50000
MY_JENKINS_DATA=/var/my_jenkins_home
MY_JENKINS_OPTS="--httpPort=-1 --httpsPort=$MY_JENKINS_HTTPS --httpsCertificate=/var/jenkins_home/cert.pem --httpsPrivateKey=/var/jenkins_home/key.pem"
```

#### docker-compose

For HTTP only:

```yml
version: '3'
services:
  jenkins:
    image: ${MY_JENKINS_IMG}
    container_name: ${MY_JENKINS_NAME}
    ports:
      - ${MY_JENKINS_HTTP}:8080
      - ${MY_JENKINS_SLAV}:50000
    volumes:
      - ${MY_JENKINS_DATA}:/var/jenkins_home
    restart: always
```

For HTTPS:

```yml
version: '3'
services:
  jenkins:
    image: ${MY_JENKINS_IMG}
    container_name: ${MY_JENKINS_NAME}
    ports:
      - ${MY_JENKINS_HTTPS}:8443
      - ${MY_JENKINS_SLAV}:50000
    volumes:
      - ${MY_JENKINS_DATA}:/var/jenkins_home
    environment:
      - MY_JENKINS_OPTS=${MY_JENKINS_OPTS}
    restart: always
```

#### Start

Inside __compose_jenkins__ directory:

```sh
cd compose_jenkins
docker-compose up -d
```

When __docker-compose__[^2] is executed, it automatically look for two default files in current directory: __docker-compose-yml__[^3] and __.env__[^4].

It will use variables in __.env__ as environment variables. The __.env__ file must be present in the current working folder.

> Currently there is no command line option to specify an alternative __.env__ file.
>
> Variables already set in shell and command line will override __.env__.

It will create containers(s) base on __docker-compose.yml__.

> __-f__ can specify one or more compose file, other than the default.

Output:

```sh
Starting my_jenkins ... done
```

Verify the jenkins site with your administrator username and password.

#### Status

Check status with __ps__

```sh
cd compose_jenkins
docker-compose up -d
```

Output:

```sh
   Name                 Command               State                        Ports
------------------------------------------------------------------------------------------------------
my_jenkins   /sbin/tini -- /usr/local/b ...   Up      0.0.0.0:50000->50000/tcp, 0.0.0.0:8080->8080/tcp
```

#### Stop

```sh
cd compose_jenkins
docker-compose stop
```

Output:

```sh
Stopping my_jenkins ... done
```

Now our jenkins is ready!

[^1]: https://hub.docker.com/r/jenkins/jenkins
[^2]: https://docs.docker.com/compose/
[^3]: https://docs.docker.com/compose/compose-file/
[^4]: https://docs.docker.com/compose/env-file/
