---
type: "blog"
date: 2019-12-06T21:54:54-05:00
author: "John Siu"
title: "MacOS Qemu/KVM"
description: "Running QEMU/KVM on MacOS"
tags: ["macos","kvm"]
draft: true
---
<!--more-->

### Limitation

#### User Mode Only

### Simple

### Bridge

```sh
qemu-system-x86_64 \
-name u64s01 \
-no-user-config \
-nodefaults \
-M q35,accel=hvf,usb=off,vmport=off \
-smp 4 \
-m 8192 \
-overcommit mem-lock=off \
-overcommit cpu-pm=off \
-rtc base=utc,clock=host \
-device virtio-blk-pci,bus=pcie.0,addr=0x1,drive=ssd1 \
-device virtio-net-pci,bus=pcie.0,addr=0x2,netdev=nic1,mac=52:54:98:76:54:32 \
-device virtio-tablet-pci,bus=pcie.0,addr=0x3 \
-device virtio-vga \
-drive id=ssd1,file=/Users/js/code/VM/test/u64s01.qcow2,if=none,format=qcow2 \
-netdev tap,id=nic1,ifname=tap0,br=bridge1,script=/Users/js/code/VM/test/tapup.sh,downscript=/Users/js/code/VM/test/tapdw.sh \
-show-cursor
```

```sh
qemu-system-x86_64 \
-no-user-config \
-nodefaults \
-M q35,accel=hvf,usb=off,vmport=off \
-m 16G \
-smp 8 \
-overcommit mem-lock=off \
-overcommit cpu-pm=off \
-rtc base=utc,clock=host \
-device virtio-net-pci,netdev=nic1,mac=52:54:98:76:54:34 \
-netdev tap,id=nic1,ifname=tap0,br=bridge1,script=/Users/js/code/vm/qemu/tapup.sh,downscript=/Users/js/code/vm/qemu/tapdw.sh \
-device virtio-blk-pci,drive=ssd1 \
-drive id=ssd1,file=/Users/js/code/vm/qemu/u64d03.qcow2,if=none,format=qcow2 \
-device virtio-tablet-pci \
-device virtio-vga \
-display default,show-cursor=on \
-device ich9-intel-hda,id=snd,msi=on \
-device hda-output,id=snd-codec0,bus=snd.0,cad=0,audiodev=snd0 \
-audiodev coreaudio,id=snd0
```
