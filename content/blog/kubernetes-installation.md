---
type: "blog"
title: "Kubernetes Installation"
date: 2018-09-30T23:17:40-04:00
tags: ["kubernetes"]
---
<!--more-->

This serve as a starting point for installing [Kubernetes](https://k8s.io) on multiple [Ubuntu Servers](https://www.ubuntu.com/server).

## References

`H` = Hands-on, `C` = Concept

- `H` - [Hello Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- `HC` - [Kubernetes Basic](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

---

Kubernetes Version: 1.11

```sh
Client Version: version.Info{Major:"1", Minor:"11", GitVersion:"v1.11.3", GitCommit:"a4529464e4629c21224b3d52edfe0ea91b072862", GitTreeState:"clean", BuildDate:"2018-09-09T18:02:47Z", GoVersion:"go1.10.3", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"11", GitVersion:"v1.11.3", GitCommit:"a4529464e4629c21224b3d52edfe0ea91b072862", GitTreeState:"clean", BuildDate:"2018-09-09T17:53:03Z", GoVersion:"go1.10.3", Compiler:"gc", Platform:"linux/amd64"}
```

---

## Prepare all nodes

If you are creating your own Linux virtual/machines for k8s:

Turn off swap and update /etc/fstab

```sh
sudo swapoff -a
sudo sed -i '/swap/ s/^/#/' /etc/fstab
```

Network config

```sh
sudo echo net.bridge.bridge-nf-call-iptables=1 >> /etc/sysctl.d/10-network-security.conf
```

Kernel Modules

```sh
sudo echo ip_vs_wrr >> /etc/modules
sudo echo ip_vs_sh >> /etc/modules
sudo echo ip_vs >> /etc/modules
sudo echo ip_vs_rr >> /etc/modules
```

Set Timezone (EST)

Ubuntu

```sh
sudo timedatectl set-timezone EST
```

---

## Install Docker (all nodes)

```sh
sudo su -
apt -y install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt -y install docker-ce
```

---

## Install kubectl kubeadm kubelet (all nodes)

```sh
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

apt-get update
apt-get install -y kubelet kubeadm kubectl

apt-mark hold kubelet kubeadm kubectl
```

---

## Bootstrapping

---

### Master node

Init as root

```sh
sudo kubeadm init
```

Setup kubctl for user

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

---

### Other node (as root)

The first node will give a command line to join the cluster like
following:

```sh
kubeadm join 172.16.168.151:6443 --token 8jrmrd.sskhizsrsndj10zx --discovery-token-ca-cert-hash sha256:a7b98ae8e51a598141d9e9678669ac1372afca7cda1c4e603070adb34fbd2985
```

---

### Install pod add-on

Install Weave Net from master node

```sh
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

---

## Conclusion

This conclude the Kubernetes installation. Next post will have commands that can test out Kubernetes capabilities.