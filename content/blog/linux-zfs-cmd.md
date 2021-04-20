---
author: "John Siu"
date: 2021-04-19T00:00:00-04:00
description: "Linux zfs cheatsheet."
tags: ["linux","cheatsheet"]
title: "Linux ZFS Command"
type: "blog"
---
Cheatsheet for Linux OpenZFS.
<!--more-->

> This page serve as a quick cheatsheet, `man zfs` and `man zpool` are your friends!

### Installation
On Ubuntu:
```sh
sudo apt install zfsutils-linux
```

### ZPOOL

`zpool` command manage storage pool of zfs.

#### Virtual Devices Type
Different type of virtual devices (vdev).

vdev type|Description
---|---
disk|Block device listed in `/dev`
file|Regular file. Only recommended for testing.
mirror|Mirror of 2 or more devices.
raidz / raidz1, raidz2, raidz3|Variation of RAID-5.
spare|pseudo-vdev keeping track of hotspares.
log|Device for logging.
dedup|Device for deduplication table.
special|Device for metadata.
cache|Caching device for the pool.

#### Create VDEV
```sh
sudo zpool create <pool> <vdev type> <device list>
sudo zpool create mypool sda
sudo zpool create mypool sda sdb
sudo zpool create mypool mirror sda sdb
```

- Pool without specifying vdev is created as dynamic stripe, like RAID-0.
- Pool name should not be same as any type.
- Device list accept with and without base path `/dev/`. Both `/dev/<device>` and just `<device>` work.

##### File Based vdev

> File based vdev is NOT recommended for any production use.

When creating file based vdev uses pre-allocated file with absolute path, and don't need specify vdev type.

Allocating file:
```sh
sudo mkdir /zfs-storage
sudo truncate -s 1G /zfs-storage/zfs-disk-01
sudo truncate -s 1G /zfs-storage/zfs-disk-02
sudo truncate -s 1G /zfs-storage/zfs-disk-03
```

Create file based pool:
```sh
sudo zpool create <pool> <absolute path ...>
sudo zpool create mypool /zfs-storage/zfs-disk-01 /zfs-storage/zfs-disk-02 /zfs-storage/zfs-disk-03
```

##### Log
Create a log vdev (SLOG) when creating pool:
```sh
sudo zpool create <pool> <vdev type> <device list> log <vdev type> <device list>
sudo zpool create mypool mirror sda sdb log sdc
sudo zpool create mypool mirror sda sdb log mirror sdc sdd
```

Log vdev can be added after pool creation:
```sh
sudo zpool add mypool log sdc
```

#### Destroy
```sh
sudo zpool destroy <pool>
sudo zpool destroy mypool
```

#### Check Pool Status
Detail status:
```sh
zpool status
zpool status <pool>
zpool status mypool
```

Utilization and statistic summary:
```sh
zpool list
```

#### Scrub (Check and Repair)
```sh
sudo zpool scrub mypool
```

#### Replace
Replace a disk in a raid or mirror:
```sh
sudo zpool replace <pool> <old device> <new device>
```

#### Attach

Use attach on mirror:

```sh
sudo zpool attach <pool> <a disk in mirror> <new disk>
sudo zpool attach mypool sda sdd
```

#### Detach

Use detach on mirror:

```sh
sudo zpool detach <pool> <disk>
sudo zpool detach mypool sdd
```

#### Add

Add top level vdev, including cache, log, etc:
```sh
sudo zpool add <pool> <vdev type> <new disk>
sudo zpool add mypool sdd
sudo zpool add mypool cache sdd ade
sudo zpool add mypool logs sdd ade
sudo zpool add mypool mirror sdd ade
```

#### Remove
Remove disk from top level vdev, including cache, log, etc:
```sh
sudo zpool remove <pool> <disk>
```

#### Export/Import

Export specific pool:
```sh
zpool export mypool
```

Export all pools:
```sh
zpool export -a
```

Import by auto detecting /dev
```sh
zpool import
zpool import mypool
```

Import by file based pool by specifying absolute path and pool name
```sh
zpool import -d /zfs-storage mypool
```

### ZFS

`zfs` command manage dataset within storage pool.

#### Dataset Type

Dataset Type|Description
---|---
filesystem|Use as common file storage.
volume|Use as raw or block. (ZVOL)
snapshot|Read only file system or volume at a given point.
bookmark|Similar to snapshot

#### Create Dataset

Create filesystem:
```sh
sudo zfs create <pool>/<fs>
sudo zfs create mypool/files
```
Create volume:
```sh
sudo zfs create -V <size> <pool>/<vol>
sudo zfs create -V 1G mypool/disk01
```
ZVOL will exist as system device in:
- `/dev/zvol/<pool>/<zvol>`
- `/dev/<pool>/<zvol>`

#### Check Disk Status
```sh
sudo zfs list
sudo zfs list <pool>
sudo zfs list <pool> -r
sudo zfs list <pool> -t <all|filesystem|snapshot|volume>
```

#### Snapshot
```sh
sudo zfs snapshot <pool>/<fs|vol>@<snapshot>
sudo zfs snapshot mypool/files@snap01
sudo zfs snapshot mypool/disk01@snap01
```

#### Destroy
```sh
sudo zfs destroy <pool>/<fs|vol>@<snapshot>
sudo zfs destroy mypool/files@snap01
sudo zfs destroy mypool/files
```

#### Send & Receive

> Always create snapshot or bookmark before sending.

Send to file:
```sh
sudo zfs send <pool>/<fs|vol>@<snapshort> > <file>
sudo zfs send mypool/files@snap01 > /backup/files-snap01.img
```

Receive from file:
```sh
sudo zfs receive <pool>/<new fs|vol> < <file>
sudo zfs receive mypool/new-fs < /backup/files-snap01.img
```

Send to remote:
```sh
sudo zfs send <pool>/<fs|vol>@<snapshort> | ssh <remote> "sudo zfs receive <pool>/<new fs|vol>"
sudo zfs send mypool/files@snap01 | ssh user@remote "sudo zfs receive mypool/new-fs"
```

---
Reference:
- [OpenZFS Documentation](https://openzfs.github.io/openzfs-docs/index.html)
- [ZFS Administration by Aaron Toponce](https://pthree.org/2012/04/17/install-zfs-on-debian-gnulinux/)