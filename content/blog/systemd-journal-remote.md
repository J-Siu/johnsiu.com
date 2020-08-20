---
author: "John Siu"
date: 2016-02-20T06:49:38Z
description: "Configure Systemd Journal Remote"
tags: ["ubuntu", "systemd"]
title: "How To Configure Systemd Journal Remote"
type: "blog"
---

This one is actually simple, online examples are correct and only need to touch one configuration file.
<!--more-->

### System Info

**OS:** Ubuntu 16.04

**systemd:** 229-1ubuntu2

**systemd-journal-remote:** 229-1ubuntu2

### Upload server configuration

Use following command to install systemd-journal-remote

```sh
sudo apt-get install systemd-journal-remote
```

Edit */etc/systemd/journal-upload.conf*.

```ini
[Upload]
URL=http://10.0.0.1:19532
# ServerKeyFile=/etc/ssl/private/journal-upload.pem
# ServerCertificateFile=/etc/ssl/certs/journal-upload.pem
# TrustedCertificateFile=/etc/ssl/ca/trusted.pem
```

To make sure journal-upload auto start on boot

```sh
sudo systemctl enable systemd-journal-upload.service
```

Restart journal-upload after configuration.

```sh
sudo systemctl restart systemd-journal-upload.service
```

If you are using http, you can do as above and leave the bottom 3 lines commented. For active mode https, uncomment them and create those cert files.

The URL actually dictate the transfer protocol(http/https) and the destination port to use.

Additionally if you want to prevent accidental overwrite by future package update, you can create a */etc/systemd/journal-upload.conf.d* directory and put your config file inside, as long as the file end with a *.conf* extension.

As a side notes, I am doing this within a LXC container and seems the service will not use /etc/hosts for dns resolution, I end up using IP address here. So if you use hostname and see error message that journal-upload cannot reach the target, try switch to IP address.

### Receiving server configuration

The receiving server give me most of the trouble when looking for configuration information. And unlike the uploading server, configuration is scattered on this side.

Use following command to install systemd-journal-remote and enable the listening port

```sh
sudo apt-get install systemd-journal-remote sudo systemctl enable systemd-journal-remote.socket
```

There are two ways, active and passive, to configure journal-remote. I am using passive mode here.

### Port number

The configuration file for journal listening port is */etc/systemd/system/sockets.target.wants/systemd-journal-remote.socket* as follow. **ListenStream** is the port number.

Unlike the uploading side, this setting has nothing to do with which protocol(http/https) to use. It only specify the listening port number.

```ini
[Unit]
Description=Journal Remote Sink Socket
[Socket]
ListenStream=19532
[Install]
WantedBy=sockets.target
```

### Protocol(http/https) and journal/log location

To change the protocol of the journal transfer and the save location, we have to edit */lib/systemd/system/systemd-journal-remote.service* directly.

```ini
[Unit]
Description=Journal Remote Sink Service
Documentation=man:systemd-journal-remote(8) man:journal-remote.conf(5) Requires=systemd-journal-remote.socket
[Service]
ExecStart=/lib/systemd/systemd-journal-remote \
  --listen-http=-3 \
  --output=/var/log/journal/remote/
User=systemd-journal-remote
Group=systemd-journal-remote
PrivateTmp=yes
PrivateDevices=yes
PrivateNetwork=yes
WatchdogSec=3min
[Install]
Also=systemd-journal-remote.socket
```

The **–listen-http=-3** specify the incoming journal is using http. If you want to use https, change it to **–listen-https=-3**.

**–output=/var/log/journal/remote/** specify the sink (saving directory) of incoming journal. If it does not exist, create it and change its owner to systemd-journal-remote.

```sh
sudo mkdir /var/log/journal/remote
sudo chown systemd-journal-remote /var/log/journal/remote
```

Restart journal-remote.socket after configuration.

```sh
sudo systemctl daemon-reload
```

What about the most obvious */etc/systemd/journal-remote.conf*?

```sh
[Remote]
# Seal=false
# SplitMode=host
# ServerKeyFile=/etc/ssl/private/journal-remote.pem
# ServerCertificateFile=/etc/ssl/certs/journal-remote.pem
# TrustedCertificateFile=/etc/ssl/ca/trusted.pem
```

Since I am not using https, don’t need to change anything.
