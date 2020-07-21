---
type: "blog"
date: 2019-07-23T00:00:00-04:00
author: "John Siu"
title: "Alpine iSCSI Target"
description: "Sharing a file base iSCSI disk from Alpine."
tags: ["alpine","iscsi","how-to"]
---

Sharing a file base iSCSI disk from Alpine.
<!--more-->

### The `targetcli`

Man page description:

> targetcli is a shell for viewing, editing, and saving the configuration of the kernel's target subsystem, also known as LIO. It enables the administrator to assign local storage resources backed by either files, volumes, local SCSI devices, or ramdisk, and export them to remote systems via network fabrics, such as FCoE.

#### Install in Alpine

```zsh
apk add targetcli
rc-update add targetcli
```

#### Start System Service

```zsh
service targetcli start
```

#### targetcli shell

`targetcli` work like a directory tree and you can use `ls` to list the management structure.

```zsh
# targetcli
targetcli shell version 2.1.fb49
Copyright 2011-2013 by Datera, Inc and others.
For help on commands, type 'help'.

/> ls
o- / ...................................... [...]
  o- backstores ........................... [...]
  | o- block ............... [Storage Objects: 0]
  | o- fileio .............. [Storage Objects: 0]
  | o- pscsi ............... [Storage Objects: 0]
  | o- ramdisk ............. [Storage Objects: 0]
  o- iscsi ......................... [Targets: 0]
  o- loopback ...................... [Targets: 0]
  o- sbp ........................... [Targets: 0]
  o- vhost ......................... [Targets: 0]
  o- xen-pvscsi .................... [Targets: 0]
/>
```

### Create iSCSI Target

We will use the targetcli shell mode to create a file base iSCSI target.

#### Backstore

Lets create a 10G disk in /tmp.

```zsh
/> cd backstores/
/backstores> cd fileio
/backstores/fileio> create disk01 /tmp/disk01.img 10G
Created fileio disk01 with size 10737418240
```

We can also do it as follow and get the same result:

```zsh
/> backstores/fileio create disk01 /tmp/disk01.img 10G
```

We will use this shorthand from here on.

Let do a `ls`

```zsh
/> ls
o- / ......................................................... [...]
  o- backstores .............................................. [...]
  | o- block .................................. [Storage Objects: 0]
  | o- fileio ................................. [Storage Objects: 1]
  | | o- disk01 . [/tmp/disk01.img (10.0GiB) write-back deactivated]
  | |   o- alua ................................... [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ....... [ALUA state: Active/optimized]
  | o- pscsi .................................. [Storage Objects: 0]
  | o- ramdisk ................................ [Storage Objects: 0]
  o- iscsi ............................................ [Targets: 0]
  o- loopback ......................................... [Targets: 0]
  o- sbp .............................................. [Targets: 0]
  o- vhost ............................................ [Targets: 0]
  o- xen-pvscsi ....................................... [Targets: 0]
/>
```

#### iSCSI

##### Target

We have to create an iSCSI target:

```zsh
/> iscsi/ create
Created target iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319.
Created TPG 1.
Global pref auto_add_default_portal=true
Created default portal listening on all IPs (0.0.0.0), port 3260.
```

The `iscsi/ create` automatically created the following:

- WWN: `iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319`
- Portal group: `tpg1` and the portals `0.0.0.0:3260`

```zsh
/> ls
o- / ..................................................................... [...]
  o- backstores .......................................................... [...]
  | o- block .............................................. [Storage Objects: 0]
  | o- fileio ............................................. [Storage Objects: 1]
  | | o- disk01 ............. [/tmp/disk01.img (10.0GiB) write-back deactivated]
  | |   o- alua ............................................... [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ................... [ALUA state: Active/optimized]
  | o- pscsi .............................................. [Storage Objects: 0]
  | o- ramdisk ............................................ [Storage Objects: 0]
  o- iscsi ........................................................ [Targets: 1]
  | o- iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319  [TPGs: 1]
  |   o- tpg1 ........................................... [no-gen-acls, no-auth]
  |     o- acls ...................................................... [ACLs: 0]
  |     o- luns ...................................................... [LUNs: 0]
  |     o- portals ................................................ [Portals: 1]
  |       o- 0.0.0.0:3260 ................................................. [OK]
  o- loopback ..................................................... [Targets: 0]
  o- sbp .......................................................... [Targets: 0]
  o- vhost ........................................................ [Targets: 0]
  o- xen-pvscsi ................................................... [Targets: 0]
/>
```

##### IPv6

To enable IPv6 for the portal, delete IPv4 entry first, then create IPv6.

```zsh
iscsi/iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319/tpg1/portals/ delete 0.0.0.0 3260
iscsi/iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319/tpg1/portals/ create ::0 3260
```

##### Lun

We need to attach our backstore, `disk01`, to the newly created iSCSI entry:

```zsh
/> iscsi/iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319/tpg1/luns create /backstores/fileio/disk01
Created LUN 0.
```

```zsh
/> ls
o- / ....................................................................................................... [...]
  o- backstores ............................................................................................ [...]
  | o- block ................................................................................ [Storage Objects: 0]
  | o- fileio ............................................................................... [Storage Objects: 1]
  | | o- disk01 ................................................. [/tmp/disk01.img (10.0GiB) write-back activated]
  | |   o- alua ................................................................................. [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ..................................................... [ALUA state: Active/optimized]
  | o- pscsi ................................................................................ [Storage Objects: 0]
  | o- ramdisk .............................................................................. [Storage Objects: 0]
  o- iscsi .......................................................................................... [Targets: 1]
  | o- iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319 .................................. [TPGs: 1]
  |   o- tpg1 ............................................................................. [no-gen-acls, no-auth]
  |     o- acls ........................................................................................ [ACLs: 0]
  |     o- luns ........................................................................................ [LUNs: 1]
  |     | o- lun0 ........................................... [fileio/disk01 (/tmp/disk01.img) (default_tg_pt_gp)]
  |     o- portals .................................................................................. [Portals: 1]
  |       o- [::0]:3260 ..................................................................................... [OK]
  o- loopback ....................................................................................... [Targets: 0]
  o- sbp ............................................................................................ [Targets: 0]
  o- vhost .......................................................................................... [Targets: 0]
  o- xen-pvscsi ..................................................................................... [Targets: 0]
/>
```

##### Acls

To allow initiator `iqn.2005-03.org.open-iscsi:a3beddeaf977` to access our target:

```zsh
/> iscsi/iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319/tpg1/acls create wwn=iqn.2005-03.org.open-iscsi:a3beddeaf977
Created Node ACL for iqn.2005-03.org.open-iscsi:a3beddeaf977
Created mapped LUN 0.
```

```zsh
/> ls
o- / ....................................................................................................... [...]
  o- backstores ............................................................................................ [...]
  | o- block ................................................................................ [Storage Objects: 0]
  | o- fileio ............................................................................... [Storage Objects: 1]
  | | o- disk01 ................................................. [/tmp/disk01.img (10.0GiB) write-back activated]
  | |   o- alua ................................................................................. [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ..................................................... [ALUA state: Active/optimized]
  | o- pscsi ................................................................................ [Storage Objects: 0]
  | o- ramdisk .............................................................................. [Storage Objects: 0]
  o- iscsi .......................................................................................... [Targets: 1]
  | o- iqn.2003-01.org.linux-iscsi.alpine-hp-01.x8664:sn.159f1aa77319 .................................. [TPGs: 1]
  |   o- tpg1 ............................................................................. [no-gen-acls, no-auth]
  |     o- acls ........................................................................................ [ACLs: 1]
  |     | o- iqn.2005-03.org.open-iscsi:a3beddeaf977 ............................................ [Mapped LUNs: 1]
  |     |   o- mapped_lun0 ............................................................. [lun0 fileio/disk01 (rw)]
  |     o- luns ........................................................................................ [LUNs: 1]
  |     | o- lun0 ........................................... [fileio/disk01 (/tmp/disk01.img) (default_tg_pt_gp)]
  |     o- portals .................................................................................. [Portals: 1]
  |       o- [::0]:3260 ..................................................................................... [OK]
  o- loopback ....................................................................................... [Targets: 0]
  o- sbp ............................................................................................ [Targets: 0]
  o- vhost .......................................................................................... [Targets: 0]
  o- xen-pvscsi ..................................................................................... [Targets: 0]
/>
```

#### Save Config

Existing `targetcli` save configuration automatically:

```zsh
/> exit
Global pref auto_save_on_exit=true
Last 10 configs saved in /etc/target/backup/.
Configuration saved to /etc/target/saveconfig.json
```

### Conclusion

This end our first iSCSI target creation. As a final note, `targetcli` can be used in command line mode, try:

```zsh
targetcli ls
```
