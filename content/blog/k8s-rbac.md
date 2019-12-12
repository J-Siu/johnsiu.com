---
type: "blog"
date: 2018-10-01T00:08:21-04:00
author: "John Siu"
title: "Kubernetes RBAC"
description: "Kubernetes user setup (certification-based authentication) and RBAC setup of the same user."
tags: ["kubernetes","rbac"]
aliases:
  - /kubernetes-rbac
  - /blog/kubernetes-rbac
---

Kubernetes user setup (certification-based authentication) and RBAC setup of the same user.
<!--more-->

---

### Reference

- [Role based access control (RBAC) policies in Kubernetes](https://www.youtube.com/watch?v=CnHTCTP8d48)
- [Controlling Access to the Kubernetes API](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/)
- [Kubernetes Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)

---

- `kubectl` is a client. It need connection information to communicate with a kubernetes cluster.
- `<USER>`, `<GROUP>` in this docunment are NOT OS(linux/windows) level user/group.

---

### Authentication - User Management

- k8s provides no api objects for users
  - Certificate-based authentication
  - Token-based authentication
  - Basic authentication
  - OAuth2

We will focus on Certificate-based authentication.

---

#### Certification-Based Authentication

`Cluster CA`

- Public certificate location:

  ```sh
  /etc/kubernetes/pki/ca.crt
  ```

- Private key location:

  ```sh
  /etc/kubernetes/pki/ca.key
  ```

Certificate signed by this CA will be accepted by the Kubernetes API.

---

#### Create User (Certificate with OpenSSL)

- Certificate Common Name (CN): Kubernetes use this as `<USER>`.
- Certificate Organization (O): Kubernetes use this as `<GROUP>`.

`User & Admin Steps:`

1. `User:` Create private key.

    ```sh
    openssl genrsa -out <USER>.key 2048
    ```

2. `User:` Create certificate signing request (CSR).

    ```sh
    openssl req -new -key <USER>.key -out <USER>.csr -subj "/CN=<USER>/O=<GROUP>"
    ```

    A \<USER\> can have multiple groups:

    ```sh
    openssl req -new -key <USER>.key -out <USER>.csr -subj "/CN=<USER>/O=<GROUP>/O=<GROUP>/O=<GROUP>"
    ```

3. `User:` send \<USER\>.key to Kubernetes administrator.

4. `Admin:` Create certificate from CSR using `Cluster` Key

    ```sh
    openssl x509 -req -in <USER>.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out <USER>.crt -days 3650
    ```

5. `Admin:` Send \<USER>.crt to user.

6. `User:` Create kubectl config.

    Add cluster to kubectl config. (Associate a cluster name with cluster CA and server information.)

    ```sh
    kubectl config \
     set-cluster <CLUSTER-NAME> \
     --certificate-authority=/etc/kubernetes/pki/ca.crt \
     --embed-certs=true \
     --server=https://<CLUSTER-IP>:6443
    ```

    Add credential to kubectl config. (Associate a certificate with a user name.)

    ```sh
    kubectl config \
     set-credentials <USER> \
     --client-certificate=<USER>.crt \
     --client-key=<USER>.key \
     --embed-certs=true
    ```

    Add context to kubectl config. (Associate a context name with a user, cluster pair.)

    ```sh
    kubectl config \
     set-context <CONTEXT-NAME> \
     --cluseter=<CLUSTER-NAME> \
     --user=<USER>
    ```

    Set context to `current(active)`. (Context is not set to `current` when created.)

    ```sh
    kubectl config \
     use-context <CONTEXT-NAME> \
    ```

PS: At this point kubectl can communicat with the cluster(authenticated), but forbidden to perform any action(not authorized).

---

### Authorization - Role Base Access Control (RBAC)

Kubernetes RBAC has `Role` and `ClusterRole`. A simple `Role` example is shown below.

Ref: <https://kubernetes.io/docs/reference/access-authn-authz/rbac/>

For Helm RBAC: <https://github.com/helm/helm/blob/master/docs/rbac.md>

#### RBAC Terms

- Subject: users, os processes, processes in pod, etc.
- API resources: nodes, pods, services, etc.
- Operations(Verbs): get, list, create, etc.

#### Create Namespace

Create namespace "test":

```sh
kubectl create ns test
```

#### Create Role

Create a role with full access for "test" namespace.

`test-admin-role.yml`

```yml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: test:admin
  namespace: test
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
```

Deploy:

```sh
kubectl create -f test-admin-role.yml
```

#### Create RoleBinding

Create a role binding for "test" namespace and "test" group.

`test-admin-bind.yml`

```yml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: test:admin
  namespace: test
subjects:
- kind: Group
  name: test
  apiGroup: ""
roleRef:
  kind: Role
  name: test:admin
  apiGroup: ""
```

Deploy:

```sh
kubectl create -f test-admin-bind.yml
```
