---
type: "blog"
date: 2019-09-17T23:32:33-04:00
author: "John Siu"
title: "KVM Command"
description: "Some kvm frequently used commands."
tags: ["kvm","cheatsheet"]
---
Some KVM frequently used commands.
<!--more-->

### Connection string

> __virsh__ and __virt-manager__ use same connection string.

- Local

  ```sh
  virsh -c qemu:///system
  ```

- Remote

  ```sh
  virsh -c qemu+ssh://user@hostname/system
  ```

- Remote from MacOS

  ```sh
  virsh -c qemu+ssh://user@hostname/system?socket=/var/run/libvirt/libvirt-sock
  ```

### VM

```sh
virsh list      # List running VMs only
virsh list -all # List VMs regardless of running state
virsh list --with-snapshot

virsh start <vm name>
virsh stop <vm name>
```

### Snapshot

- List

  ```sh
  virsh snapshot-list <vm name>
  ```

- Create

  ```sh
  virsh snapshot-create -domain <vm name>
  virsh snapshot-create-as --domain <vm name> --name <snapshot name>
  ```

- Revert

  ```sh
  virsh snapshot-revert <vm name> <snapshot name>
  ```

- Delete

  ```sh
  virsh snapshot-delete --snapshotname <snapshot name> <vm name>
  ```

### Network

```sh
virsh net-list
virsh net-list --all
```

### Pool and Vol

```sh
virsh pool-list
virsh pool-list --all

virsh vol-list <pool name>
virsh vol-list default
```

### Image

- Create

  ```sh
  qemu-img create -f <format> <filename> <size>
  qemu-img create -f qcow2 ubuntu.img 500M
  ```

  > __vmdk__(vmware) and __vdi__(virtualbox) are supported.

- Snapshot

  ```sh
  qemu-img create -f qcow2 -b ubuntu.master.qcow2 ubuntu.qcow2
  ```

- Info

  ```sh
  qemu-img info <filename>
  ```

- Resize

  ```sh
  qemu-img resize <filename> [+|-]<size>
  qemu-img resize ubuntu.img 550M # set image to new size, use --shrink if new size is smaller
  qemu-img resize ubuntu.img +10M # increase image size by 10M
  qemu-img resize --shrink ubuntu.img -10M # decrease image size by 10M
  ```

  > Check [Linux Commands](/blog/linux-cmd/#resize-filesystem) for resizing partition after an image resize.
