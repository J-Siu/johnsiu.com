---
type: "blog"
date: 2019-07-27T02:32:48-04:00
author: "John Siu"
title: "My Alpine MPD (Music Player Daemon) Lite"
description: "Compiling my own MPD, a lite version"
tags: ["mpd","alpine"]
draft: false
---
Didn't get my hand dirty for a long time.
<!--more-->

> Music Player Daemon (MPD) is a flexible, powerful, server-side application for playing music. Through plugins and libraries it can play a variety of sound files while being controlled by its network protocol. - (https://www.musicpd.org/)

Above is a short description from MPD developer site. Indeed too short. MPD is powerful and feature rich. On one hand it has too many features I don't need. I just want a music player that can be control remotely. On the other hand the `mpd` package from Alpine repository some how has a high cpu usage and I have no clue how to debug it. Eventually I decided to just roll my own version and cut everything to the bare minimum.

### Download MPD Source

Get latest source from [muscipd.org](https://www.musicpd.org/).

### Install Build Tools

```zsh
apk add build-base boost ninja boost-dev meson
```

### Install Build Dependencies

```zsh
apk add alsa-lib-dev sqlite-dev ffmpeg-dev
```

|Library|Usage|
|-|-|
`alsa-lib-dev`|Linux Alsa sound system. This is for sound output.
`ffmpeg-dev`|This take care of 99% of audio file playback.
`sqlite-dev`|For mpd song database.

### Compile

Following [MPD instructions](https://www.musicpd.org/doc/html/user.html#compiling-from-source) and some modification from [Alpine community APKBUILD](https://git.alpinelinux.org/aports/tree/community/mpd?h=master)

```zsh
meson . output/release \
  --prefix=/usr \
  --sysconfdir=/etc \
  --mandir=/usr/share/man \
  --localstatedir=/var \
  --buildtype=release \
  -Dsyslog=enabled \
  -Dsystemd=disabled \
  -Dipv6=enabled \
  -Dupnp=disabled \
  -Dlibmpdclient=disabled \
  -Dudisks=disabled \
  -Dwebdav=disabled \
  -Dcdio_paranoia=disabled \
  -Dcurl=disabled \
  -Dmms=disabled \
  -Dnfs=disabled \
  -Dsmbclient=disabled \
  -Dqobuz=disabled \
  -Dsoundcloud=disabled \
  -Dtidal=disabled \
  -Dbzip2=disabled \
  -Diso9660=disabled \
  -Dzzip=disabled \
  -Did3tag=disabled \
  -Dchromaprint=disabled \
  -Dadplug=disabled \
  -Daudiofile=disabled \
  -Dfaad=disabled \
  -Dffmpeg=enabled \
  -Dflac=disabled \
  -Dfluidsynth=disabled \
  -Dgme=disabled \
  -Dmad=disabled \
  -Dmikmod=disabled \
  -Dmodplug=disabled \
  -Dmpcdec=disabled \
  -Dmpg123=disabled \
  -Dopus=disabled \
  -Dsidplay=disabled \
  -Dsndfile=disabled \
  -Dtremor=disabled \
  -Dvorbis=disabled \
  -Dwavpack=disabled \
  -Dwildmidi=disabled \
  -Dvorbisenc=disabled \
  -Dlame=disabled \
  -Dtwolame=disabled \
  -Dshine=disabled \
  -Dlibsamplerate=disabled \
  -Dsoxr=disabled \
  -Dalsa=enabled \
  -Dao=disabled \
  -Djack=disabled \
  -Dopenal=disabled \
  -Doss=disabled \
  -Dpulse=disabled \
  -Dshout=disabled \
  -Dsndio=disabled \
  -Dsolaris_output=disabled \
  -Ddbus=disabled \
  -Dexpat=disabled \
  -Dicu=disabled \
  -Diconv=disabled \
  -Dpcre=disabled \
  -Dsqlite=enabled \
  -Dyajl=disabled \
  -Dzlib=disabled \
  -Dzeroconf=disabled \
  -Ddocumentation=false \
  -Dtest=false \
  -Dinotify=true \
  -Ddaemon=true \
  -Depoll=true \
  -Deventfd=true \
  -Dsignalfd=true \
  -Dtcp=true \
  -Dlocal_socket=true \
  -Ddsd=false \
  -Ddatabase=true \
  -Dneighbor=false \
  -Dcue=true \
  -Dwave_encoder=false \
  -Dfifo=true \
  -Dhttpd=false \
  -Dpipe=true \
  -Drecorder=false

meson configure output/release

ninja -C output/release
```

The binary is `output/release/mpd`. Move it to `/usr/bin/`.

### Cleanup

Remove build tools and dev libraries:

```zsh
apk del build-base boost ninja boost-dev meson alsa-lib-dev sqlite-dev ffmpeg-dev
```

### Install Binary Dependency

Basically the non-dev version used during compilation.

```zsh
apk add alsa-utils sqlite ffmpeg
```

> ***`alsa-utils`***
>
> This is Linux "sound driver". Use `alsamixer` to configure and un-mute the master volume.

### Configure

My `mpd.conf`:

```ini
music_directory         "/home/<user>/.mpd/Music"
playlist_directory      "/home/<user>/.mpd/playlists"
log_file                "syslog"
pid_file                "/home/<user>/.mpd/mpd.pid"
state_file              "/home/<user>/.mpd/mpd.state"
sticker_file            "/home/<user>/.mpd/mpd.sticker"
user                    "<user>"
group                   "audio"
bind_to_address         "::"
port                    "6600"
log_level               "default"
auto_update             "yes"
database {
        plugin "simple"
        path "/home/<user>/.mpd/mpd.db"
}
audio_output {
        type            "alsa"
        name            "ALSA"
        auto_format     "no"
        auto_channels   "no"
        auto_resample   "no"
}
```

### Result

MPD features is cut to the bare minimum, a music player that can be control remotely from my main desktop with GUI or cli, and from my phone. CPU usage remain ~2% when playing on my 10yrs old laptop.
