---
type: "blog"
date: 2019-09-02T23:31:33-04:00
author: "John Siu"
title: "K8s Dashboard"
description: ""
tags: [""]
draft: true
---
<!--more-->
### Dashboard

Dashboard[^3] is a web GUI for Kubernetes. It is optional but nice to have:

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta1/aio/deploy/recommended.yaml
```

Output:

```sh
namespace/kubernetes-dashboard created
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/kubernetes-metrics-scraper created
```

> __Note__: The above line from Kubernetes site will install v2.0.0-beta1. But you can check dashboard repository[^4] on github for other version. The latest version at the time of writing is v2.0.0-beta4.

#### Admin User

```sh
kubectl apply -f admin-user.yml
```

Output:

```sh
serviceaccount/admin-user created
clusterrolebinding.rbac.authorization.k8s.io/admin-user created
```

```sh
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
```

```sh
kubectl proxy --address='::'
```

```sh
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```
