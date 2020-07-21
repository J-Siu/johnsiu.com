---
type: "blog"
date: 2020-06-21T15:11:59-04:00
author: "John Siu"
title: "CoreOS on Ubuntu KVM"
description: "Deploy Fedora CoreOS on Ubuntu 20.04 KVM."
tags: ["kvm","coreos","ubuntu"]
---
Deploy Fedora CoreOS on Ubuntu 20.04 KVM host.
<!--more-->

### Preparation

#### Download CoreOS

Fedora CoreOS download page is [here](https://getfedora.org/coreos/download).

```sh
cd /var/lib/libvirt/images
wget https://builds.coreos.fedoraproject.org/prod/streams/stable/builds/32.20200601.3.0/x86_64/fedora-coreos-32.20200601.3.0-qemu.x86_64.qcow2.xz
unxz fedora-coreos-32.20200601.3.0-qemu.x86_64.qcow2.xz
```

#### Get FCCT Tool

```sh
wget -O fcct https://github.com/coreos/fcct/releases/download/v0.6.0/fcct-x86_64-unknown-linux-gnu
chmod +x fcct
```

You can move this into `/usr/local/bin`.

#### Create FCC File

FCC file use YAML syntax.

`/var/lib/libvirt/images/coreos01.fcc`:

```yml
variant: fcos
version: 1.0.0
storage:
  files:
    - path: "/etc/hostname"
      mode: 420
      contents:
        source: data:,coreos01
passwd:
  users:
    - name: core
      groups: [sudo,docker]
      password_hash: "$1$i..."
      ssh_authorized_keys:
        - "ssh-ed25519 AAAA..."
```

- Line 8: Set host name to `coreos01`
- Line 13: `password_hash` can be generated with `openssl passwd -1`
- Line 15: SSH public key. You can add multiple ssh keys.

#### Convert to Ignition File

```sh
fcct -p -o coreos01.ign coreos01.fcc
```

- `-p`: Print pretty.
- `-o <file>`: Output to ...

`/var/lib/libvirt/images/coreos01.ign`

```json
{
  "ignition": {
    "version": "3.0.0"
  },
  "passwd": {
    "users": [
      {
        "groups": [
          "sudo",
          "docker"
        ],
        "name": "core",
        "passwordHash": "$1$i...",
        "sshAuthorizedKeys": [
          "ssh-ed25519 AAAA..."
        ]
      }
    ]
  },
  "storage": {
    "files": [
      {
        "path": "/etc/hostname",
        "contents": {
          "source": "data:,coreos01"
        },
        "mode": 420
      }
    ]
  }
}
```

### Create VM

We will use `virt-install` to create coreos01.

```sh
virt-install --connect qemu:///system \
--import \
--virt-type kvm \
--name coreos01 \
--graphics none \
--ram 1024 --vcpus 2 \
--os-type=linux \
--os-variant=fedora31 \
--network type=direct,source=eno1,source_mode=bridge,model=virtio \
--disk path=/var/lib/libvirt/images/coreos01.qcow2,format=qcow2,bus=virtio,size=8,\
backing_store=/var/lib/libvirt/images/fedora-coreos-32.20200601.3.0-qemu.x86_64.qcow2,\
backing_format=qcow2 \
--qemu-commandline="-fw_cfg name=opt/com.coreos/config,file=/var/lib/libvirt/images/coreos01.ign"
```

- Line 10,11,12: Instead of using `fedora-coreos-32.20200601.3.0-qemu.x86_64.qcow2` directly, create a snapshot `coreos01.qcow2` as boot disk.
- Line 13: Pass ignition file `coreos01.ign` into VM.

Output:

```sh
Fedora CoreOS 32.20200601.3.0
Kernel 5.6.14-300.fc32.x86_64 on an x86_64 (ttyS0)

SSH host key: SHA256:9n71CVOWFOVVruFq/D0SAqK+OUVTE0S6BIJ+bBZJvEc (ECDSA)
SSH host key: SHA256:b5v+MA59l5eHCOVWF3+J/4770HGw7Fj2TVQmHMrBscU (ED25519)
SSH host key: SHA256:iD7+fhdMeDN9aSguGNjBpjtEtVVjWLLCBxoWpjizwW0 (RSA)
eth0: 10.10.10.177 fe80::5054:ff:fe96:f532
Ignition: user provided config was applied
Ignition: wrote ssh authorized keys file for user: core
coreos01 login:
```

Login as `core`. To exit console mode, press <kbd>ctrl</kbd>+<kbd>]</kbd>.

> If you see permission error about `coreos01.ign`, add following lines to `/etc/apparmor.d/local/abstractions/libvirt-qemu`:
> ```ini
> /var/lib/libvirt/images/*.ign r,
> ```

### Modifying FCC File

Ignition file is only use on first boot. It has not effect on subsequent boot. Each time the fcc file is modified, the corresponding VM need to be recreated.

```sh
virsh --connect qemu:///system undefine coreos01 --remove-all-storage
```