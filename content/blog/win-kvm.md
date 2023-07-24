---
author: "John Siu"
date: 2023-07-17T18:20:40-04:00
description: "Windows KVM Client Drivers"
tags: ["windows","kvm"]
title: "Windows 11 KVM Client Drivers and Tips"
type: "blog"
---
Working KVM drives and guest tools.
<!--more-->

This walkthrough also apply to Windows 10.

### Download Drivers

Get `virtio` drivers before installing Windows 11 in KVM. As we need the driver iso during the installation process.

Go to following URL:

> https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/

Download `virtio-win.iso` and `virtio-win-guest-tools.exe`.

File|Direct Link|Usage
---|---|---
`virtio-win.iso`|[link](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/virtio-win.iso)|Required during installation. Provide network and storage drivers.
`virtio-win-guest-tools.exe`|[link](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/virtio-win-guest-tools.exe)|Required after installation. Provide dynamic screen resizing for remote connection.

![virtio drivers](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-01-drivers.png)

### Setup KVM

#### Prepare ISO

On KVM host, put both Windows iso and virtio-win.iso into KVM storage pool. The default location is `/var/lib/libvirt/images/`.

If done correctly, they should show up in KVM storage pool like following.

![virtio iso](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-02-iso.png)

#### Create VM

Start KVM creation.

1. Choose local media. Then `Forward`.  
  ![create 01](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-03-create-01.png)

2. Select Windows ISO either by drop down or `Browse...`.  
  If operating system was not detect automatically, type `Microsoft` in the box and you should be presented with a pop up menu. Choose `Microsoft Windows 11`.  
  Then `Forward`.  
  ![create 02](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-03-create-02.png)

3. Set memory size. Then `Forward`.  
  `CPU` will be override in customization steps.  
  ![create 03](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-03-create-03.png)

4. Set disk size. Then `Forward`.  
  ![create 04](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-03-create-04.png)

5. Set name of new VM.  
  Checkmark `Customize configuration before install`.  
  Then `Finish`.  
  ![create 05](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-03-create-05.png)

Customization screen will pop up. Continue to next section.

#### Customize VM

We will set VM to use VirtIO, TPM.

1. In `Overview`  
  `Chipset` should be `Q35`  
  `Firmware` should be `UEFI`  
  ![customize 01](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-01.png)

2. In `CPUs` (IMPORTANT)  
  Windows Home only use 1 CPU socket, Windows Pro only use 2 CPU sockets. If `vCPU` is used to assign more cpu, Windows VM will only use 1(home) or 2(pro) CPUs and become extremely slow. We have to use `Topology` instead.  
  Checkmark `Manually set CPU topology`.  
  Set `Sockets` to 1.
  Set `Cores` to your desire value.  
  Then `Apply`.  
  ![customize 02](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-02.png)

3. In `SATA Disk 1`, change `Disk Bus` to `VirtIO`. Then `Apply`.  
  ![customize 03](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-03.png)

4. In `NIC ...`, change `Device model` to `virtio`. Then `Apply`.  
  ![customize 04](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-04.png)

5. In `TPM vNone`,  
  Set `Model` to `TIS`.  
  Set `Version` to `2.0`.  
  Then `Apply`.  
  ![customize 05](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-05.png)

6. Click `Add Hardware` to open add hardware pop up.  
  In `Storage`:  
  Click `Select or create custom storage`  
  Click `Manage` and assign `virtio-win.iso`.  
  Set `Device type` to `CDROM device`.  
  Then `Finish`.  
  This allow us to add storage and network drivers during Windows installation.
  ![customize 06](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-06.png)

7. Click `Boot Options`.  
  Checkmark `SATA CSROM 1` and move it to the top.  
  Then `Apply`.  
  ![customize 06](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-061.png)

8. Click `Begin Installation` to start Windows installation.  
  ![customize 07](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-04-customize-07.png)

### Windows Installation

We will not go through every single screen for Windows 11 setup, but only a few points:

#### Press A Key

When VM start, you have to press a key to boot CD(ISO). Else it will enter EFI prompt and you have to restart the VM again. You only have a few seconds to do it.

#### Loading Drivers

When we reach the disk screen, it will be empty. We will be loading both the storage driver and network driver.

1. Click `Load driver`  
  ![install 01](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-05-install-01.png)

2. Click `OK`.  
  ![install 02](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-05-install-02.png)

3. Select `Red Hat VirtIO SCSI controller` with `w11` in the path.  
   Then `Next`.  
  ![install 03](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-05-install-03.png)

The above not only load the VirtIO SCSI driver, but also the network driver.

Finish the installation process and boot into Windows. Do not remote the virtio-win ISO yet. We still need it in next phase.

### VirtIO Guest Tool

After Windows installation and initial setup, go CDROM drive with `wirtio-win`, run `virtio-win-guest-tools.exe`. That will install all remaining drivers and most importantly, the display driver allow for remote resizing.

![guest 01](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-06-guest-01.png)

Turn on auto resize in `virt-manager`.

![guest 02](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-kvm-06-guest-02.png)
