---
type: "blog"
date: 2019-09-01T21:48:45-04:00
author: "John Siu"
title: "Tiny CI/CD - Build Your Own - Part 2 - Docker"
description: "Install docker for ci/cd and 2 examples."
tags: ["tiny","cicd","docker"]
draft: true
---
Install Docker for CI/CD setup and 2 examples.
<!--more-->

Kubernete can use numerous backend(container runtime / CRI). Docker is chosen in this exercise due to its popularity and huge image registry.

> In Kubernetes, CRI = Container Runtime Interface[^1].

---

### Series Content

- [Part 1 - Introduction](/blog/tiny-ci-cd-p1-intro/)
- [Part 2 - Docker](/blog/tiny-ci-cd-p2-docker/) <- You are here.
- [Part 3 - Kubernetes](/blog/tiny-ci-cd-p3-k8s/)
- [Part 4 - Docker Registry](/blog/tiny-ci-cd-p4-k8s-registry/)
- [Part 5 - Gogs (Git Server)](/blog/tiny-ci-cd-p5-k8s-gogs/)
- [Part 6 - Jenkins](/blog/tiny-ci-cd-p6-k8s-jenkins/)
- [Part 7 - Usage](/blog/tiny-ci-cd-p7-usage/)
- [Part 8 - Conclusion](/blog/tiny-ci-cd-p8-conclusion/)

---

Installation will be done in Ubuntu 18.04, due to Kubernetes dependency on systemd.

### Install

> Kubernetes official instruction use Docker official repository. But we will just use Ubuntu's repository as Docker in it is pretty current(18.09.7) at the time of writing this article.

```sh
apt install docker.io
```

Check Docker information:

```sh
docker info
```

Output:

```sh
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 18.09.7
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version:
runc version: N/A
init version: v0.18.0 (expected: fec3683b971d9c3ef73f284f176672c44b448662)
Security Options:
 apparmor
 seccomp
  Profile: default
Kernel Version: 4.15.0-58-generic
Operating System: Ubuntu 18.04.3 LTS
OSType: linux
Architecture: x86_64
CPUs: 2
Total Memory: 985.2MiB
Name: u64s-01
ID: ONMX:PREO:K7LQ:AHRN:PZ7U:OOYQ:6ZLN:BW4A:GL2O:J4B7:VL6R:G4A7
Docker Root Dir: /var/lib/docker
Debug Mode (client): false
Debug Mode (server): false
Registry: https://index.docker.io/v1/
Labels:
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false

WARNING: No swap limit support
```

There is a __WARNING: No swap limit support__ at the end. We will fix it in next step.

---

### Configuration

#### Cgroup Driver

Change cgroup driver to systemd for Kubernetes[^2]:

```sh
echo '{"exec-opts": ["native.cgroupdriver=systemd"], "log-driver": "json-file", "log-opts": { "max-size": "100m" }, "storage-driver": "overlay2"}' > /etc/docker/daemon.json
```

#### Auto Start

Enable Docker service auto start:

```sh
systemctl enable docker
```

#### Hold Version

We will pin/hold the version of __docker.io__ to prevent accidental update.

```sh
apt-mark hold docker.io
```

#### Docker User

> __Note__: This is optional for Kubernetes environment.

```sh
addgroup <user> docker
```

This allow \<user\> to manager Docker (use docker command) without root privilege.

#### Fix Swap Limit

Create __/etc/default/grub.d/60-docker-settings.cfg__ with following content:

```ini
GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1"
```

Update grub and reboot:

```sh
update-grub
reboot
```

After reboot, check __docker info__ again.

```sh
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 7
Server Version: 18.09.7
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: systemd
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version:
runc version: N/A
init version: v0.18.0 (expected: fec3683b971d9c3ef73f284f176672c44b448662)
Security Options:
 apparmor
 seccomp
  Profile: default
Kernel Version: 4.15.0-58-generic
Operating System: Ubuntu 18.04.3 LTS
OSType: linux
Architecture: x86_64
CPUs: 2
Total Memory: 985.2MiB
Name: u64s-01
ID: ONMX:PREO:K7LQ:AHRN:PZ7U:OOYQ:6ZLN:BW4A:GL2O:J4B7:VL6R:G4A7
Docker Root Dir: /var/lib/docker
Debug Mode (client): false
Debug Mode (server): false
Registry: https://index.docker.io/v1/
Labels:
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
```

---

### Examples (Optional)

Following are are examples in this site. These packages will be used in Kubernetes later.

- [Docker Private Registry - How To](/blog/docker-registry/) - Docker Registry, or simply registry, is the Docker image repository.
- [Docker Gogs - How To](/blog/docker-gogs/) - A git repository package with web interfaces and access control.
- [Docker Jenkins - How To](/blog/docker-jenkins/) - A git repository package with web interfaces and access control.

You are encourage to follow the examples to understand how Docker containers are run and how Docker Compose works. These concept share similarities with Kubernetes and help in later parts.

---

Next: [Part 3 - Kubernetes](/blog/tiny-ci-cd-p3-k8s/)

[^1]: https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/
[^2]: https://kubernetes.io/docs/setup/production-environment/container-runtimes/#docker
