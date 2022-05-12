---
type: "blog"
date: 2019-07-27T02:32:48-04:00
author: "John Siu"
title: "Alpine MPD Lite"
description: "Compiling MPD (Music Player Daemon), a lite version."
tags: ["alpine-linux","mpd"]
---
Didn't get my hand dirty for a long time.
<!--more-->

---

> Music Player Daemon (MPD) is a flexible, powerful, server-side application for playing music. Through plugins and libraries it can play a variety of sound files while being controlled by its network protocol. - [www.musicpd.org](//www.musicpd.org/)

Above is a short description from MPD developer site. Indeed too short. MPD is powerful and feature rich. On one hand it has too many features I don't need. I just want a music player that can be control remotely. On the other hand the `mpd` package from Alpine repository some how has a high cpu usage and I have no clue how to debug it. Eventually I decided to just roll my own version and cut everything to the bare minimum.

### Download MPD Source

Get latest source from [musicpd.org](//www.musicpd.org/).

### Install Build Tools

```zsh
apk add build-base boost ninja boost-dev meson
```

### Install Build Dependencies

```zsh
apk add alsa-lib-dev sqlite-dev ffmpeg-dev
```

Library|Usage
---|---
`alsa-lib-dev`|Linux ALSA sound system. This is for sound output.
`ffmpeg-dev`|This take care of 99% of audio file playback.
`sqlite-dev`|For mpd song database.

### Compile

Following [MPD instructions](//www.musicpd.org/doc/html/user.html#compiling-from-source) and some modification from [Alpine community APKBUILD](//git.alpinelinux.org/aports/tree/community/mpd?h=master)

```zsh
meson . output/release \
  --prefix=/usr \
  --sysconfdir=/etc \
  --mandir=/usr/share/man \
  --localstatedir=/var \
  --buildtype=release \
  -Dcue=true \
  -Ddaemon=true \
  -Ddatabase=true \
  -Depoll=true \
  -Deventfd=true \
  -Dfifo=true \
  -Dinotify=true \
  -Dlocal_socket=true \
  -Dpipe=true \
  -Dsignalfd=true \
  -Dtcp=true \
  -Dalsa=enabled \
  -Dffmpeg=enabled \
  -Dipv6=enabled \
  -Dsqlite=enabled \
  -Dsyslog=enabled \
  -Ddocumentation=false \
  -Ddsd=false \
  -Dhttpd=false \
  -Dneighbor=false \
  -Drecorder=false \
  -Dtest=false \
  -Dwave_encoder=false \
  -Dadplug=disabled \
  -Dao=disabled \
  -Daudiofile=disabled \
  -Dbzip2=disabled \
  -Dcdio_paranoia=disabled \
  -Dchromaprint=disabled \
  -Dcurl=disabled \
  -Ddbus=disabled \
  -Dexpat=disabled \
  -Dfaad=disabled \
  -Dflac=disabled \
  -Dfluidsynth=disabled \
  -Dgme=disabled \
  -Diconv=disabled \
  -Dicu=disabled \
  -Did3tag=disabled \
  -Diso9660=disabled \
  -Djack=disabled \
  -Dlame=disabled \
  -Dlibmpdclient=disabled \
  -Dlibsamplerate=disabled \
  -Dmad=disabled \
  -Dmikmod=disabled \
  -Dmms=disabled \
  -Dmodplug=disabled \
  -Dmpcdec=disabled \
  -Dmpg123=disabled \
  -Dnfs=disabled \
  -Dopenal=disabled \
  -Dopus=disabled \
  -Doss=disabled \
  -Dpcre=disabled \
  -Dpulse=disabled \
  -Dqobuz=disabled \
  -Dshine=disabled \
  -Dshout=disabled \
  -Dsidplay=disabled \
  -Dsmbclient=disabled \
  -Dsndfile=disabled \
  -Dsndio=disabled \
  -Dsolaris_output=disabled \
  -Dsoundcloud=disabled \
  -Dsoxr=disabled \
  -Dsystemd=disabled \
  -Dtidal=disabled \
  -Dtremor=disabled \
  -Dtwolame=disabled \
  -Dudisks=disabled \
  -Dupnp=disabled \
  -Dvorbis=disabled \
  -Dvorbisenc=disabled \
  -Dwavpack=disabled \
  -Dwebdav=disabled \
  -Dwildmidi=disabled \
  -Dyajl=disabled \
  -Dzeroconf=disabled \
  -Dzlib=disabled \
  -Dzzip=disabled

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
apk add sqlite-libs alsa-lib alsa-utils ffmpeg
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

> Must add `<user>` to group `audio`, else mpd cannot connect to ALSA device.

### Result

MPD features is cut to the bare minimum, a music player that can be control remotely from my main desktop with GUI or command line, and from my phone. CPU usage remain ~2% when playing on my 10yrs old laptop.
