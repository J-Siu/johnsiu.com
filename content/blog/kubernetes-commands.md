---
type: "blog"
title: "Some Kubernetes Commands"
date: 2018-09-30T23:39:45-04:00
tags: ["kubernetes"]
---

Here are some [Kubernetes](https://k8s.io) commands.
<!--more-->

---

## Command

---

### Node

Restart kubelet (kubernete agent)

```sh
sudo systemctl restart kubelet
```

Get nodes

```sh
kubectl get nodes -o wide --all-namespaces
```

---

### Pod

Pod is a collection of container(docker)

Get pods

```sh
kubectl get pods -o wide --all-namespaces
```

Create pod

Create pod file: ghost.yml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ghost
spec:
  containers:
  - name: ghost
    image: ghost
```

Create ghost pod

```sh
kubectl create -f ghost.yml
```

Delete pod

```sh
kubectl delete pods ghost
```

---

### Console

```sh
kubectl exec -it <pod name> bash
```

---

### Logs

```sh
kubectl logs <pod name>
kubectl logs <pod name> -c <container name>
kubectl logs <pod name> --all-containers=true
```

---

### Label

```sh
kubectl label <kind> <name> <name:value>
kubectl label pod ghost app=v1.8
```

---

### Service/Expose

Create a service using `expose`

```sh
kubectl expose deployment <name> --type="NodePort" --port 8080
kubectl expose pod <name> --type="NodePort" --port 8080
kubectl expose deployment <name> --type=LoadBalancer
```

Delete a service

```sh
kubectl delete service <name>
kubectl delete service -l label
```

---

### Proxy

```sh
kubectl proxy
```

Output

```sh
Starting to serve on 127.0.0.1:8001
```

Get pod name

```sh
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
```

Curl

```sh
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME/proxy/
```

---

### ReplicataSet

ghostReplicaSet.yml

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: ghost
spec:
  replicas: 5
  selector:
    matchLabels:
      app: ghost
  template:
    metadata:
      name: ghost
      labels:
        app: ghost
    spec:
      containers:
      - name: ghost
        image: ghost
```

Create replica set

```sh
kubectl create -f ghostReplicaSet.yml
```

Scaling - Changing replica number after a set is created. (If a replica set is created by deployment, it need to be scaled using deployment, not replica set directly.)

```sh
kubectl scale rs ghost --replicas=2
```

---

### Service

ghostSvc.yml

- `selector` is labels

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ghost
spec:
  selector:
    app: ghost
  ports:
  - post: 2368
  type: NodePort
```

```sh
kubectl create -f ghostSvc.yml
```

`NodePort` will use a random high port of the node. To check what port
is being used:

```sh
kubectl get svc
```

Output:

```sh
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
ghost        NodePort    10.97.85.198   <none>        2368:30218/TCP   1h
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          2h
```

`2368:30218/TCP` means application(ghost) port 2368 inside the pod is
mapped to port 30218 of the node.

---

### Generators / Deployments

Deployment will create pod, replica set and service.

---

#### Run without YAML

```sh
kubectl run ghost --image=ghost:1.7 --port 2368 --expose=true
```

Output:

```sh
service/ghost created
deployment.apps/ghost created
```

---

#### What is created

```sh
kubectl get all -o wide
```

Output:

```txt
NAME                         READY     STATUS    RESTARTS   AGE       IP          NODE      NOMINATED NODE
pod/ghost-7b7d68d64c-xfm95   1/1       Running   0          1m        10.32.0.3   u64s02    <none>

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE       SELECTOR
service/ghost        ClusterIP   10.102.59.219   <none>        2368/TCP   1m        run=ghost
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP    3h        <none>

NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       CONTAINERS   IMAGES    SELECTOR
deployment.apps/ghost   1         1         1            1           1m        ghost        ghost     run=ghost

NAME                               DESIRED   CURRENT   READY     AGE       CONTAINERS   IMAGES    SELECTOR
replicaset.apps/ghost-7b7d68d64c   1         1         1         1m        ghost        ghost     pod-template-hash=3638248207,run=ghost
```

---

#### Edit Menifest(config) on the fly

```sh
kubectl edit <kind> <name>
kubectl edit service ghost
```

---

#### Scale the deployment

```sh
kubectl scale deployment ghost --replicas=5
```

---

#### Rollout Update

Edit the image version in deployment menifest

```sh
kubectl edit deployment ghost
```

or

```sh
kubectl set image deployment/ghost ghost=ghost:v1.8
```

---

#### Rollout Status

```sh
kubectl rollout status deployment <name>
```

---

#### Rollback

```sh
kubectl rollout undo deployment <name>
kubectl rollout undo deployment ghost
```
