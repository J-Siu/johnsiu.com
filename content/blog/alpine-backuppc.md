---
type: "blog"
date: 2019-08-03T00:10:20-04:00
author: "John Siu"
title: "Alpine BackupPC 4 With Nginx"
description: "Install BackupPC 4.x on Alpine Linux with Nginx"
tags: ["alpine","linux","backuppc","nginx"]
draft: false
---
Deploying BackupPC 4.x on Alpine require some efforts.
<!--more-->
### BackupPC 4.x

[BackupPC](https://github.com/backuppc/backuppc) is a Linux base backup software with a web frontend. It support client across Linux, Windows, Mac OS and other UNIX-base system.

#### Dev Dependencies

We will install all the dependencies for rsync-bpc, BackupPC-XS and BackupPC 4.x.

- Following can be removed after the build process.

  ```sh
  apk add \
    acl-dev \
    attr-dev \
    build-base \
    expat-dev \
    git \
    gnu-libiconv-dev \
    perl-dev \
    popt-dev \
    samba-dev \
    zlib-dev
  ```

- Following will be kept after building BackupPC.

  ```sh
  apk add \
    acl \
    apache-utils \       # For htpasswd
    expat \
    fcgiwrap \
    nginx \
    openssh-client \
    perl \
    perl-archive-zip \
    perl-cgi \
    perl-encode-utils \
    perl-file-listing \
    perl-xml-rss \
    popt \
    rrdtool \
    rsync \
    samber-client \      # For Windows backup
    zlib
  ```

#### Create User

Create user `backuppc`.

```sh
adduser backuppc
```

#### Compiling & Install

[BackupPC github](https://github.com/backuppc/backuppc) page list out 2 dependency packages.

##### rsync-bpc

```sh
git clone https://github.com/backuppc/rsync-bpc.git
cd rsync-bpc
./configure
make install
```

##### BackupPC-XS

```sh
git clone https://github.com/backuppc/backuppc-xs.git
cd backuppc-xs
perl Makefile.PL
make install
```

##### BackupPC 4.x

```sh
wget https://github.com/backuppc/backuppc/releases/download/4.3.1/BackupPC-4.3.1.tar.gz
cd BackupPC-4.3.1
perl configure.pl
```
> **Note:** Following are settings I choose that will affect configuration files in later part.
>
    $Conf{TopDir}      = '/home/backuppc/data';
    $Conf{RunDir}      = '/home/backuppc';
    $Conf{InstallDir}  = '/home/backuppc';
    $Conf{CgiDir}      = '/home/backuppc/cgi-bin';
    $Conf{CgiImageDir} = '/home/backuppc/img';
    $Conf{CgiImageDirURL} = '/img';

#### Clean Up

You can keep the build dependencies or remove them.

```sh
  apk del \
    acl-dev \
    attr-dev \
    build-base \
    expat-dev \
    git \
    gnu-libiconv-dev \
    perl-dev \
    popt-dev \
    samba-dev \
    zlib-dev
```

### Nginx Configuration

> **Note:** Check and modify according to what is in your `config.pl`.

```apache
server {
  listen 80;
  listen [::]:80;
  server_name a64-hp-01;

  access_log /var/log/nginx/backuppc.access_log;
  error_log  /var/log/nginx/backuppc.error_log;


  location / {
    auth_basic "BackupPC admin";
    auth_basic_user_file /etc/BackupPC/htpasswd;
    alias /home/backuppc/cgi-bin/;
    return 302 http://a64-hp-01/BackupPC_Admin;
  }

  location /img {
    alias /home/backuppc/img;
  }

  location ~ ^/BackupPC_Admin(/|$) {
    gzip off;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/run/fcgiwrap/fcgiwrap.sock;
    fastcgi_param REMOTE_ADDR     $remote_addr;
    fastcgi_param REMOTE_USER     $remote_user;
    fastcgi_param SCRIPT_FILENAME /home/backuppc/cgi-bin/BackupPC_Admin;
  }
}
```

### Startup Scripts

#### /etc/init.d/fcgiwrap

fcgiwrap's socket is not group writable. I cannot get around it even with filesystem ACL setting default group write permission for /run/fcgiwrap/.

One solution is to run Nginx as user `backuppc`. However that make nginx almost exclusively for BackupPC.

The other solution is use `chmod` after the socket is created. I modified `/etc/init.d/fcgiwrap` to do exactly just that.

```shell
#!/sbin/openrc-run

name="fcgiwrap"
description="fcgiwrap cgi daemon"

command="/usr/bin/fcgiwrap"
command_background="yes"
user="backuppc"
group="nginx"
: ${socket:=unix:/run/fcgiwrap/fcgiwrap.sock}

depend() {
  need net localmount
  after firewall
}

start_pre() {
  command_args="-c ${nproc:-$(nproc)} -s $socket"
  case "$socket" in
  unix:/*)
    local socket_path=${socket#unix:}
    checkpath --directory --mode 2775 --owner ${user}:${group} \
      ${socket_path%/*}
    ;;
  esac
}

start_fcgiwrap() {
  start-stop-daemon --exec ${command} \
    --background \
    -u ${user} -g ${group} \
    --start -- ${command_args}
}

start_chmod() {
  chmod g+w /run/fcgiwrap/fcgiwrap.sock
}

stop_post() {
case "$socket" in
unix:/*)
  rm -f "${socket#unix:}"
  ;;
esac
}

start() {
for i in fcgiwrap chmod
do
  ebegin "Starting $i"
  start_$i
  eend $?
done
}
```

#### /etc/init.d/backuppc

As BackupPC `configuration.pl` only comes with systemd service file, we will use Alpine BackupPC 3.x startup script and modify accordingly.

```sh
#!/sbin/openrc-run

extra_started_commands="reload"

: ${user:="backuppc"}
: ${logdir:="/var/log/BackupPC"}
: ${command_args:="-d"}

command="/home/backuppc/bin/BackupPC"
start_stop_daemon_args="--interpreted --user $user"
pidfile="/home/backuppc/BackupPC.pid"
retry="30"

depend() {
  after firewall modules
}

start_pre() {
  checkpath -d -o $user -m 755 "${pidfile%/*}"
}

reload() {
  ebegin "Reloading $name"
  start-stop-daemon --signal 1 --pidfile "$pidfile" -x /usr/bin/perl
  eend $?
}
```

### Conclusion

This should give a very good starting point of running BackupPC 4.x with Nginx on Alpine.

### Reference

[freebsd + nginx + backuppc](https://wiki.k2patel.in/doku.php?id=freebsd_nginx_backuppc)
