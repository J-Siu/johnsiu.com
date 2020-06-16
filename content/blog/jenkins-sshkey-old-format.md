---
type: "blog"
date: 2020-06-16T14:03:17-04:00
author: "John Siu"
title: "Jenkins - SSH Build Step Credential Issue"
description: "Jenkins - SSH Build Step Credential Issue"
tags: ["jenkins","ssh"]
draft: false
---
The old credential issue.
<!--more-->

### SSH Build Step

If Jenkins `SSH plugin` is installed, `Execute shell script on remote host using ssh` will be available as a build step option. It can execute command on remote host over ssh connection.

### Setup

#### Add Hosts

To use `Execute shell script on remote host using ssh`, we need to setup the reote host entry in Jenkins first:

- `Manage Jenkins` -> `Configure System` -> `SSH remote hosts`
- Fill in `Hostname`, `Port` and `Credentials`
- `Credentials`
  - Select existing credential from drop down menu.
  - Click check connection to verify.
  - Click `Add` to add more SSH host.

Once SSH is setup here. They will be avaiable in drop down menu in build step.

#### SSH Key

##### Old vs New Format

`SSH plugin(2.6.1)`, as of writing, only support old private key format. The old rsa key file format look like following:

```txt
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

While newer key file format start and end with:

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

It is not a simple cosmatic difference. The old format is call PEM format while newer one is openssh own format.

Unfortunatly, SSH Plugin 2.6.1 only support the old PEM format. If you supply a new format private key, the web GUI will only give `Can't connect to server` error. However in jenkins logs:

```txt
2020-06-16 07:10:02.948+0000 [id=479]   SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: Auth fail
2020-06-16 07:10:02.948+0000 [id=479]   SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: Can't connect to server
ERROR: Failed to authenticate with public key
com.jcraft.jsch.JSchException: invalid privatekey: [B@7bc6fd38
        at com.jcraft.jsch.KeyPair.load(KeyPair.java:664)
        at com.jcraft.jsch.IdentityFile.newInstance(IdentityFile.java:46)
        at com.jcraft.jsch.JSch.addIdentity(JSch.java:441)
...
```

The hint is at line 4: `com.jcraft.jsch.JSchException: invalid privatekey`.

To generate ssh key in old PEM format:

```sh
ssh-keygen -t rsa -m PEM -f <filename>
```

`-m PEM` specify format to PEM.

##### Can't connect to server

Other than above, following are a few common reasons you see the not so helpful error in Jenkins gui:

- Missing/wrong public keys on target ssh server.

    In Jenkins log:

  ```txt
  2020-06-16 07:12:54.750+0000 [id=623]   SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: Auth fail
  2020-06-16 07:12:54.750+0000 [id=623]   SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: Can't connect to server
  ```

- Target server is actually unreachable due to:
  - Network isolation
  - Firewall blocking
  - Wrong hostname
  - Power off
  - SSH daemon not running

  In Jenkins log:

  ```txt
  2020-06-16 20:00:41.944+0000 [id=1465]  SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: java.net.ConnectException: Connection refused (Connection refused)
  2020-06-16 20:00:41.944+0000 [id=1465]  SEVERE  o.j.h.p.SSHBuildWrapper$DescriptorImpl#doLoginCheck: Can't connect to server
  ```