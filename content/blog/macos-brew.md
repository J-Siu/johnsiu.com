---
author: "John Siu"
date: 2022-05-28T02:40:48-04:00
description: "MacOS Homebrew Java/JDK"
tags: ["macos","cheatsheet","brew"]
title: "MacOS Homebrew Java/JDK"
type: "blog"
---
Some homebrew packages require extra steps and they are easy to miss.
<!--more-->
### Java/JDK

#### Issue

On MacOS, when using `brew` to install certain packages, like `openapi-generator`, will pull in `java` as dependency.

However when executing `java` from command line, error pop up:
```txt
$ java -version
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

#### Solution

To solve it:
```sh
sudo ln -sfn /usr/local/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
```

Now `java` works:
```txt
$ java -version
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

#### Where is that information

Most `brew` packages display extra steps during installation, if required. However, they are easy to miss when installing multiple packages. The information will be buried inside all the output.

To show that information, we can use `brew info <package>`. Example:

`brew info java`
```txt
openjdk: stable 18.0.1 (bottled) [keg-only]
Development kit for the Java programming language
https://openjdk.java.net/
Not installed
From: https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/openjdk.rb
License: GPL-2.0-only with Classpath-exception-2.0
==> Dependencies
Build: autoconf ✘
==> Requirements
Build: Xcode ✔
Required: macOS >= 10.15 ✔
==> Caveats
For the system Java wrappers to find this JDK, symlink it with
  sudo ln -sfn /usr/local/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk

openjdk is keg-only, which means it was not symlinked into /usr/local,
because macOS provides similar software and installing this software in
parallel can cause all kinds of trouble.

==> Analytics
install: 184,767 (30 days), 621,114 (90 days), 2,377,395 (365 days)
install-on-request: 48,734 (30 days), 172,952 (90 days), 673,642 (365 days)
build-error: 379 (30 days)
```

The information is at line 14.

So next time when a package from `brew` doesn't work, give `brew info` a try.