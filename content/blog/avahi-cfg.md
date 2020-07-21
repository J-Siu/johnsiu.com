---
type: blog
date: 2019-07-30T22:06:36-04:00
author: "John Siu"
title: "Avahi Config"
description: "Some avahi config."
tags: ["avahi","cheatsheet"]
---
Some Avahi config.
<!--more-->
### Avahi

To make samba share show up in Mac OS finder network section, create `/etc/avahi/services/smb.service`:

```xml
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
 <name replace-wildcards="yes">%h</name>
 <service>
   <type>_smb._tcp</type>
   <port>445</port>
 </service>
 <service>
   <type>_device-info._tcp</type>
   <port>0</port>
   <txt-record>model=Macmini7</txt-record>
 </service>
</service-group>
```

Then restart avahi.

### Mac OS Icons

- plist: `/System/Library/CoreServices/CoreTypes.bundle/Contents/Info.plist`
- location: `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources`