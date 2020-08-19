---
type: "blog"
title: "Chef Server Installation"
date: 2018-09-30T23:08:41-04:00
description: "Chef server installation walk through."
author: "John Siu"
tags: ["chef","how-to"]
---

This serve as a starting point for installing [Chef](//chef.io) server on local machines.
<!--more-->

### Reference

- [Chef Doc : Install Standalone](//docs.chef.io/install_server.html#standalone)
- [Chef Doc : chef-server-ctl](//docs.chef.io/ctl_chef_server.html)

### Objectives

We will focus on:

- Install Chef server on Ubuntu.
- Install Chef client / development kit.
- Create a user, a organization and setup config file for knife (Chef client).

Version used:

- Server Box
  - Ubuntu Server: 16.04 LTS
  - Hostname: u64s07.local
- Client Box
  - Ubuntu Server: 16.04 LTS
  - Hostname: u64s08.local
- Chef Server: 12.17.33
- Chef Client: 14.5.33
- Chef Development Kit: 3.3.23

Hostname:

- Server box: u64s07.local
- Client box: u64s08.local

### Download Chef packages

Download Chef packages from <https://downloads.chef.io/> or use following links. Choose packages base on your OS version.

You will need:

- [`Chef Server`](//downloads.chef.io/chef-server/)
- [`Chef Client`](//downloads.chef.io/chef/)
- [`Chef Development Kit (ChefDK / DK)`](//downloads.chef.io/chefdk/) (Optional)

### Install Chef Server on Server Box

Install package:

```sh
sudo dpkg -i chef-server-core_12.17.33-1_amd64.deb
```

Initialize:

```sh
sudo chef-server-ctl reconfigure
```

Check status:

```sh
sudo chef-server-ctl status
```

Output:

```sh
run: bookshelf: (pid 25591) 90s; run: log: (pid 25651) 90s
run: nginx: (pid 25417) 94s; run: log: (pid 25974) 86s
run: oc_bifrost: (pid 25309) 96s; run: log: (pid 25347) 95s
run: oc_id: (pid 25401) 95s; run: log: (pid 25410) 94s
run: opscode-erchef: (pid 25827) 87s; run: log: (pid 25805) 89s
run: opscode-expander: (pid 25486) 91s; run: log: (pid 25587) 90s
run: opscode-solr4: (pid 25443) 92s; run: log: (pid 25456) 92s
run: postgresql: (pid 25274) 96s; run: log: (pid 25290) 96s
run: rabbitmq: (pid 26213) 80s; run: log: (pid 26003) 85s
run: redis_lb: (pid 19380) 199s; run: log: (pid 25967) 86s
```

Reboot and Chef server should auto start.

### Install Chef Client/DK on Client Box

We have 2 choices: Chef Client package or Chef Development Kit(DK).

DK includes all client commands with extra as shown in following table.

|Client (Included in DK)|DK Only|
|---|---|
|chef-apply<br/>chef-client<br/>chef-resource-inspector<br/>chef-shell<br/>chef-solo<br/>knife<br/>ohai|berks<br/>chef<br/>chef-run<br/>chef-vault<br/>cookstyle<br/>dco<br/>delivery<br/>foodcritic<br/>inspec<br/>kitchen<br/>print_execution_environment<br>push-apply<br/>pushy-client<br/>pushy-service-manager|

Install client:

```sh
sudo dpkg -i chef_14.5.33-1_amd64.deb
```

Install DK:

```sh
sudo dpkg -i chefdk_3.3.23-1_amd64.deb
```

Testing:

```sh
knife node list
```

Output:

```txt
WARNING: No knife configuration file found. See https://docs.chef.io/config_rb_knife.html for details.
WARN: Failed to read the private key /etc/chef/client.pem: #<Errno::ENOENT: No such file or directory @ rb_sysopen - /etc/chef/client.pem>
ERROR: Your private key could not be loaded from /etc/chef/client.pem
Check your configuration file and ensure that your private key is readable
```

This is normal as we don't have a user yet.

### Setup Admin User

1. `Server Box`

    Create organization

      Syntax:

      ```sh
      sudo chef-server-ctl org-create ORG_SHORT_NAME ORG_FULL_NAME --filename ORG-validator.pem
      ```

      Example:

      ```sh
      sudo chef-server-ctl org-create johnsiu-com JohnSiu.com --filename johnsiu-com-validator.pem
      ```

    Generate USER-PEM file used by knife.

      Syntax:

      ```sh
      sudo chef-server-ctl user-create USERNAME FIRST_NAME [MIDDLE_NAME] LAST_NAME EMAIL PASSWORD --filename USERNAME.pem
      ```

      Example:

      ```sh
      sudo chef-server-ctl user-create johnsiu John Siu me@example.com somepassword --filename johnsiu.pem
      ```

    Associate user with organization

      Syntax:

      ```sh
      sudo chef-server-ctl org-user-add OPTIONS ORG_SHORT_NAME USERNAME
      ```

      Example:

      ```sh
      sudo chef-server-ctl org-user-add johnsiu-com johnsiu
      ```

    Copy / move the USERNAME.pem file to `Client Box`.

2. `Client Box`

    Create `~/.chef` directory

      ```sh
      mkdir ~/.chef
      ```

      Move PEM file in to .chef

      ```sh
      mv johnsiu.pem ~/.chef/
      ```

    Create `knife` configuration file. Following is the input and output of my setup. You should replace the hostname(u64s07.local) in the URL with your own.

    Execute:

      ```sh
      knife configure
      ```

      ```txt
      WARNING: No knife configuration file found. See https://docs.chef.io/config_rb_knife.html for details.
      Please enter the chef server URL: [https://u64s08.local/organizations/myorg] https://u64s07.local/organizations/johnsiu-com
      Please enter an existing username or clientname for the API: [js] johnsiu
      *****

      You must place your client key in:
        /home/js/.chef/johnsiu.pem
      Before running commands with Knife

      *****
      Knife configuration file written to /home/js/.chef/credentials
      ```

    Test and expected error:

      ```sh
      knife node list
      ```

    Output: Instead of an empty line (as we have not add any node yet), we will get following error:

      ```txt
      ERROR: SSL Validation failure connecting to host: u64s07.local - SSL_connect returned=1 errno=0 state=error: certificate verify failed (self signed certificate)
      ERROR: Could not establish a secure connection to the server.
      Use `knife ssl check` to troubleshoot your SSL configuration.
      If your Chef Server uses a self-signed certificate, you can use
      `knife ssl fetch` to make knife trust the server's certificates.

      Original Exception: OpenSSL::SSL::SSLError: SSL Error connecting to https://u64s07.local/organizations/johnsiu-com/nodes - SSL_connect returned=1 errno=0 state=error: certificate verify failed (self signed certificate)
      ```

    Follow the instruction to make `knife` accept Chef server self-signed certificate:

      ```sh
      knife ssl fetch
      ```

    Test again and there should be no error.

### Chef Server Manager (Web GUI)

After Chef server installed, open `https://your-server-box-hostname` will give you the following instruction:

```sh
sudo chef-server-ctl install chef-manage
sudo chef-server-ctl reconfigure
sudo chef-manage-ctl reconfigure
```

Chef Server Manager (Web GUI) and many additional features (mostly web based also) are called *premium* features. They are free to use up to 25 nodes.