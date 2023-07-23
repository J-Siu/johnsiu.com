---
author: "John Siu"
date: 2023-07-17T14:53:14-04:00
description: "Windows ssh server setup."
tags: ["ssh","windows"]
title: "SSH into Windows"
type: "blog"
---
With Windows 10 and 11, you can ssh into your Windows machine, with ssh key too.
<!--more-->

### Install OpenSSH Server

1. Go to Windows Settings

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-01-menu.png)

2. Select `Apps` then `Optional features`

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-02-settings.png)

3. Click `View features`

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-03-features.png)

4. Search `ssh`, checkmark `OpenSSH Server`, click `Next`

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-04-add.png)

5. Search `Install`

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-05-install.png)

### Enable OpenSSH Service

OpenSSH service not enable by default.

1. Open service manager
2. Double click `OpenSSH SSH Server`
3. In `General Tab`
    - Select `Automatic` for `Startup type`
    - Click `Start`
    - Click `Apply`

    ![Before](//raw.githubusercontent.com/J-Siu/johnsiu.com/master/static/img/win-ssh-06-enable.png)

### Microsoft Account

SSH sign-in to Windows 10/11, both local accounts and Microsoft accounts can be used.

To use Microsoft accounts(eg. Hotmail), you have to find out the shorten name of your account. It is your home directory name in `C:\Users\`. Then you can login ssh with the shorten name using Microsoft account password.

### SSH Key

To use ssh key with Windows, you do the same as Linux, almost.

#### Standard User

For standard Windows user, you do the same as Linux. Put the public key inside

`C:\Users\<username>\.ssh\authorized_key`

#### Administrator

> The first account of Windows is always an administrator account.

Unlike Linux, Windows administrators do not use home directory `authorized_keys`. ALL administrators public keys are to be put in

`C:\ProgramData\ssh\administrators_authorized_keys`

One per line.

If a standard account is promoted to administrator account, its home directory `authorized_keys` file will stop working, and its public key need to be put into the above file.

On the other hand, if an administrator account is demoted to standard, it will revert back to home directory setup like the previous section.