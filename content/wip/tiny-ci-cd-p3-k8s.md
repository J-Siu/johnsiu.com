---
type: "blog"
date: 2019-09-02T12:36:37-04:00
author: "John Siu"
title: "Tiny CI/CD - Building Your Own - Part 3 - Kubernetes"
description: ""
tags: ["tiny","ci","cd","kubernetes"]
draft: true
---
Installing Kubernetes using kubeadm.
<!--more-->

---

### Series Content

- [Part 1 - Introduction](/blog/tiny-ci-cd-p1-intro/)
- [Part 2 - Docker](/blog/tiny-ci-cd-p2-docker/)
- [Part 3 - Kubernetes](/blog/tiny-ci-cd-p3-k8s/) <- You are here.
- [Part 4 - Docker Registry](/blog/tiny-ci-cd-p4-k8s-registry/)
- [Part 5 - Gogs (Git Server)](/blog/tiny-ci-cd-p5-k8s-gogs/)
- [Part 6 - Jenkins](/blog/tiny-ci-cd-p6-k8s-jenkins/)
- [Part 7 - Usage](/blog/tiny-ci-cd-p7-usage/)
- [Part 8 - Conclusion](/blog/tiny-ci-cd-p8-conclusion/)

### Preparation

#### Swap Off

Turn off swap and update /etc/fstab:

```sh
swapoff -a
sed -i '/swap/ s/^/#/' /etc/fstab
```

#### Systemctl

> Ubuntu 18.04 already has these by default. But double check to be sure.

Check:

```sh
echo /proc/sys/net/bridge/bridge-nf-call-arptables
echo /proc/sys/net/bridge/bridge-nf-call-ip6tables
echo /proc/sys/net/bridge/bridge-nf-call-iptables
```

If any of the output is not __1__:

```sh
sysctl net.bridge.bridge-nf-call-arptables=1
sysctl net.bridge.bridge-nf-call-ip6tables=1
sysctl net.bridge.bridge-nf-call-iptables=1
echo net.bridge.bridge-nf-call-arptables=1 > /etc/sysctl.d/90-kubernetes.conf
echo net.bridge.bridge-nf-call-ip6tables=1 >> /etc/sysctl.d/90-kubernetes.conf
echo net.bridge.bridge-nf-call-iptables=1 >> /etc/sysctl.d/90-kubernetes.conf
```

### Install Binary

```sh
apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo deb http://apt.kubernetes.io/ kubernetes-xenial main > /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```

Check version:

```sh
kubelet --version; kubeadm version; kubectl version
```

Output:

```sh
Kubernetes v1.15.3
kubeadm version: &version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.3", GitCommit:"2d3c76f9091b6bec110a5e63777c332469e0cba2", GitTreeState:"clean", BuildDate:"2019-08-19T11:11:18Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.3", GitCommit:"2d3c76f9091b6bec110a5e63777c332469e0cba2", GitTreeState:"clean", BuildDate:"2019-08-19T11:13:54Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

Ignore the last line about connection refused, as Kubernetes is not running yet.

---

### Master Node

> __Note__: Official name of "Master Node" is __Control-Plane Node__ in Kubernetes document.

Use __kubeadm__ to initialize our Kubernetes cluster master node:

```sh
kubeadm init --pod-network-cidr 10.0.0.0/8
```

> __Note__: --pod-network-cidr 10.0.0.0/8 is used because we will be using __Kube-router__[^1] add-on for pod networking.

Output:

```sh
[init] Using Kubernetes version: v1.15.3
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [u64s-01 kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 172.16.168.6]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [u64s-01 localhost] and IPs [172.16.168.6 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [u64s-01 localhost] and IPs [172.16.168.6 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 26.005001 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.15" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node u64s-01 as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node u64s-01 as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: aebxgc.tq4lpz58vlq6sikq
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.16.168.6:6443 --token aebxgc.tq4lpz58vlq6sikq \
    --discovery-token-ca-cert-hash sha256:a327f287362cd46e42b67b6171f12061e77399ac6c9745caab79f0a5f69f94cb
```

#### Pod Network Add-On

We will use __kube-router__ for service proxy, firewall and pod networking:

```sh
KUBECONFIG=/etc/kubernetes/admin.conf kubectl apply -f https://raw.githubusercontent.com/cloudnativelabs/kube-router/master/daemonset/kubeadm-kuberouter-all-features.yaml
```

Output:

```sh
configmap/kube-router-cfg created
daemonset.apps/kube-router created
serviceaccount/kube-router created
clusterrole.rbac.authorization.k8s.io/kube-router created
clusterrolebinding.rbac.authorization.k8s.io/kube-router created
```

Remove __kube-proxy__ as it's function is replaced by __kube-router__[^1]:

```sh
KUBECONFIG=/etc/kubernetes/admin.conf kubectl -n kube-system delete ds kube-proxy
docker run --privileged -v /lib/modules:/lib/modules --net=host k8s.gcr.io/kube-proxy-amd64:v1.15.3 kube-proxy --cleanup
```

Output:

```sh
daemonset.extensions "kube-proxy" deleted
Unable to find image 'k8s.gcr.io/kube-proxy-amd64:v1.15.3' locally
v1.15.3: Pulling from kube-proxy-amd64
Digest: sha256:fbeb72931327b1d66b6d481bc0e0a8c531a055432fc01ef28012d5746ad07877
Status: Downloaded newer image for k8s.gcr.io/kube-proxy-amd64:v1.15.3
W0902 23:35:58.881310       1 server.go:216] WARNING: all flags other than --config, --write-config-to, and --cleanup are deprecated. Please begin using a config file ASAP.
F0902 23:35:59.247376       1 server.go:449] <nil>
```

#### Kubectl User

> __Note__: This is needed even for __root__ user.

__kubectl__ is a command line client that talk Kubernetes API with our cluster. It needs its own configuration file and look for them under user home directory __.kube/__. To allow our user to use kubectl:

```sh
mkdir <user home>/.kube
cp /etc/kubernetes/admin.conf <user home>/.kube/config
chown -R <user>:<group> <user home>/.kube
```

Checking:

```sh
kubectl get node
```

Output:

```sh
NAME      STATUS     ROLES    AGE   VERSION
u64s-01   NotReady   master   75m   v1.15.3
```

You can use kubectl on another machine to control your cluster. Just copy /etc/kubernetes/admin.conf over and repeat the same step.

---

### Worker Node

> If you plan to run everything on a single machine, skip to [Single Node](#single-node) below.

On worker node, repeat the [Preparation](#preparation) and [Install Binary](#install-binary) steps above. Then execute the command shown at the end of the master node initialization:

```sh
kubeadm join <master node ip/hostname>:6443 --token <token> --discovery-token-ca-cert-hash <sha56-hash>
```

#### Token

A __token__ only last 24 hours. You can check the current available token. On the master node:

```sh
kubeadm token list
```

Output:

```sh
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION                                                EXTRA GROUPS
mijyq3.h3n444d4pmx6y1bd   22h       2019-09-03T16:26:00-04:00   authentication,signing   The default bootstrap token generated by 'kubeadm init'.   system:bootstrappers:kubeadm:default-node-token
```

#### Join Command

To get a new token with the sha256-hash, go back to the master node and generate new one using kubeadm:

```sh
kubeadm token generate --print-join-command
```

Output:

```sh
kubeadm join 172.16.168.6:6443 --token 0zrhvs.ljg4e6v7xw0xslwj --discovery-token-ca-cert-hash sha256:3b97285bdb4c8218f569a47d6d217f855b735b88f91bd77075a5bef7ac82fb76
```

---

### Single Node

By default, Kubernetes will not run(schedule) application(pod) on master(control-plane) node.

If you want to run everything on a single box:

```sh
kubectl taint nodes --all node-role.kubernetes.io/master-
```

Output:

```sh
node/<hostname> untainted
```

### Master Node HA

If you are interested in high available setup of the master node, check out the official document [here](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/).

---

### Environment Partition

Our cluster is ready. To archive CI/CD, we will do some partitioning.

#### Namespaces

From Kubernetes document[^2]:

> Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called namespaces.

In CI/CD, we have following environments:

- Development
- Stage
- Production

We will use Kubernetes namespaces to emulate this environment partitioning.

Check current namespace:

```sh
kubectl get namespaces
```

Output:

```sh
NAME              STATUS   AGE
default           Active   150m
kube-node-lease   Active   150m
kube-public       Active   150m
kube-system       Active   150m
```

The three kube-* are Kubernetes system namespaces. __default__ is the namespace our applications/container will resides in by default.

To create namespaces for our environment:

```sh
kubectl create namespace development
kubectl create namespace stage
kubectl create namespace production
```

Check again:

```sh
NAME              STATUS   AGE
default           Active   158m
development       Active   2m1s
kube-node-lease   Active   158m
kube-public       Active   158m
kube-system       Active   158m
production        Active   110s
stage             Active   114s
```

Now we are ready to start installing our CI/CD tools.

---

Next: [Part 4 - Docker Registry](/blog/tiny-ci-cd-p4-k8s-registry/)

[^1]: https://github.com/cloudnativelabs/kube-router/blob/master/docs/kubeadm.md
[^2]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[^3]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
