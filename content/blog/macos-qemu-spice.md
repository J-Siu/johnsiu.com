---
type: "blog"
date: 2020-07-10T19:43:28-04:00
author: "John Siu"
title: "MacOS Qemu & Spice"
description: "Running qemu with spice on MacOS using brew formula"
tags: ["macos","brew","qemu","spice","kvm","how-to"]
---
Spice is again compilable on MacOS ...
<!--more-->

### Brew Formula

`spice-gtk` and `spice-protocol` have been available through `brew` for quite some time. And finally [Spice](//www.spice-space.org/) is working on MacOS. There is no official brew formula for spice yet. We have to create our own.

#### Spice

Run following command to create spice formula:

```sh
brew create https://gitlab.freedesktop.org/spice/spice.git
```

Replace the content with following:

`spice.rb`

```rb
class Spice < Formula
  homepage "https://www.spice-space.org/"
  url "https://gitlab.freedesktop.org/spice/spice.git"
  version "master"

  depends_on "autoconf" => :build
  depends_on "autoconf-archive" => :build
  depends_on "autogen" => :build
  depends_on "automake" => :build
  depends_on "gobject-introspection" => :build
  depends_on "intltool" => :build
  depends_on "libtool" => :build
  depends_on "pkg-config" => :build
  depends_on "vala" => :build

  depends_on "atk"
  depends_on "cairo"
  depends_on "gdk-pixbuf"
  depends_on "gettext"
  depends_on "glib"
  depends_on "gst-libav"
  depends_on "gst-plugins-bad"
  depends_on "gst-plugins-base"
  depends_on "gst-plugins-good"
  depends_on "gst-plugins-ugly"
  depends_on "gstreamer"
  depends_on "gtk+3"
  depends_on "jpeg"
  depends_on "json-glib"
  depends_on "libusb"
  depends_on "lz4"
  depends_on "openssl@1.1"
  depends_on "opus"
  depends_on "pango"
  depends_on "pixman"
  depends_on "spice-protocol"
  depends_on "usbredir"

  def install
    system "./autogen.sh"
    system "./configure", "--disable-debug",
                          "--disable-dependency-tracking",
                          "--disable-silent-rules",
                          "--prefix=#{prefix}"
    system "make", "install"
  end

end
```

#### Qemu

Run following command to create qemu5 formula:

```sh
brew create https://download.qemu.org/qemu-5.0.0.tar.xz --set-name qemu5
```

Replace the content with following:

`qemu5.rb`

```rb
class Qemu5 < Formula
  desc "Emulator for x86 and PowerPC"
  homepage "https://www.qemu.org/"
  url "https://download.qemu.org/qemu-5.0.0.tar.xz"
  sha256 "2f13a92a0fa5c8b69ff0796b59b86b080bbb92ebad5d301a7724dd06b5e78cb6"

  depends_on "libtool" => :build
  depends_on "pkg-config" => :build
  depends_on "glib"
  depends_on "gnutls"
  depends_on "jpeg"
  depends_on "libpng"
  depends_on "libssh"
  depends_on "libusb"
  depends_on "lzo"
  depends_on "ncurses"
  depends_on "nettle"
  depends_on "pixman"
  depends_on "snappy"
  depends_on "vde"
  depends_on "spice"

  # 820KB floppy disk image file of FreeDOS 1.2, used to test QEMU
  resource "test-image" do
    url "https://dl.bintray.com/homebrew/mirror/FD12FLOPPY.zip"
    sha256 "81237c7b42dc0ffc8b32a2f5734e3480a3f9a470c50c14a9c4576a2561a35807"
  end

  def install
    ENV["LIBTOOL"] = "glibtool"

    args = %W[
      --prefix=#{prefix}
      --cc=#{ENV.cc}
      --host-cc=#{ENV.cc}
      --disable-bsd-user
      --disable-guest-agent
      --enable-curses
      --enable-libssh
      --enable-vde
      --extra-cflags=-DNCURSES_WIDECHAR=1
      --enable-cocoa
      --disable-sdl
			--disable-gtk
			--enable-spice
			--enable-vnc
			--enable-vnc-jpeg
			--enable-vnc-png
    ]
    # Sharing Samba directories in QEMU requires the samba.org smbd which is
    # incompatible with the macOS-provided version. This will lead to
    # silent runtime failures, so we set it to a Homebrew path in order to
    # obtain sensible runtime errors. This will also be compatible with
    # Samba installations from external taps.
    args << "--smbd=#{HOMEBREW_PREFIX}/sbin/samba-dot-org-smbd"

    system "./configure", *args
    system "make", "V=1", "install"
  end

  test do
    expected = build.stable? ? version.to_s : "QEMU Project"
    assert_match expected, shell_output("#{bin}/qemu-system-aarch64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-alpha --version")
    assert_match expected, shell_output("#{bin}/qemu-system-arm --version")
    assert_match expected, shell_output("#{bin}/qemu-system-cris --version")
    assert_match expected, shell_output("#{bin}/qemu-system-hppa --version")
    assert_match expected, shell_output("#{bin}/qemu-system-i386 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-lm32 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-m68k --version")
    assert_match expected, shell_output("#{bin}/qemu-system-microblaze --version")
    assert_match expected, shell_output("#{bin}/qemu-system-microblazeel --version")
    assert_match expected, shell_output("#{bin}/qemu-system-mips --version")
    assert_match expected, shell_output("#{bin}/qemu-system-mips64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-mips64el --version")
    assert_match expected, shell_output("#{bin}/qemu-system-mipsel --version")
    assert_match expected, shell_output("#{bin}/qemu-system-moxie --version")
    assert_match expected, shell_output("#{bin}/qemu-system-nios2 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-or1k --version")
    assert_match expected, shell_output("#{bin}/qemu-system-ppc --version")
    assert_match expected, shell_output("#{bin}/qemu-system-ppc64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-riscv32 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-riscv64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-rx --version")
    assert_match expected, shell_output("#{bin}/qemu-system-s390x --version")
    assert_match expected, shell_output("#{bin}/qemu-system-sh4 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-sh4eb --version")
    assert_match expected, shell_output("#{bin}/qemu-system-sparc --version")
    assert_match expected, shell_output("#{bin}/qemu-system-sparc64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-tricore --version")
    assert_match expected, shell_output("#{bin}/qemu-system-unicore32 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-x86_64 --version")
    assert_match expected, shell_output("#{bin}/qemu-system-xtensa --version")
    assert_match expected, shell_output("#{bin}/qemu-system-xtensaeb --version")
    resource("test-image").stage testpath
    assert_match "file format: raw", shell_output("#{bin}/qemu-img info FLOPPY.img")
  end
end
```

This is a modified version of the original `qemu.rb` formula with `spice` enabled.

### Install

Remove `qemu` if it is already installed with brew:

```sh
brew uninstall qemu
```

Install the new `qemu5`:

```sh
brew install qemu5
```

It will automatically install the `spice` formula.

### Testing

Start a vm:

```sh
IMAGE=ubuntu.qcow2

qemu-system-x86_64 \
-M q35,accel=hvf,usb=off,vmport=off \
-chardev spicevmc,id=spicechannel0,name=vdagent \
-device virtio-blk-pci,drive=ssd1 \
-device virtio-net-pci,netdev=nic1 \
-device virtio-serial-pci \
-device virtio-tablet-pci \
-device virtio-vga \
-device virtserialport,chardev=spicechannel0,name=com.redhat.spice.0 \
-drive id=ssd1,file=${IMAGE},if=none,format=qcow2 \
-m 16G \
-netdev user,id=nic1,ipv4=on,hostfwd=tcp::2222-:22 \
-no-user-config \
-nodefaults \
-overcommit cpu-pm=off \
-overcommit mem-lock=off \
-rtc base=utc,clock=host \
-smp 8 \
-spice port=5900,addr=127.0.0.1,disable-ticketing,image-compression=off,seamless-migration=on
```

Connect to it with [remote-viewer](/blog/macos-kvm-remote-viewer/):

```sh
remote-viewer spice://127.0.0.1:5900
```