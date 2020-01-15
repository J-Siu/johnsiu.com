---
type: "blog"
date: 2019-12-15T03:07:24-05:00
author: "John Siu"
title: "Linux IPv6 Router"
description: "Create a simple Linux router supporting IPv4 and IPv6, with shorewall/6, wide-dhcpv6-client, dnsmasq, hostapd."
tags: ["linux","how-to","ipv6","router","networking"]
draft: false
---
Create a simple Linux router supporting IPv4 and IPv6.
<!--more-->

### Background

My old home wi-fi router is dying and instead of buying one, I decided to build one with Linux this time. This will give me more control and visibility into my network and internet traffic.

---

### Hardware

The new box I am using is [Qotom-Q355G4](https://www.amazon.com/gp/product/B076PKP6G9/ref=ox_sc_act_title_1?smid=AIHFP4MVXMM7V&psc=1):

- Main Port: 1 HD Video Port + 1 COM + 2 USB 2.0 + 2 USB 3.0 + 4 LAN.
- CPU: Intel Core i5-5200U SOC Processor (Broadwell, Dual Core, 3M Cache, 2.2GHz, up to 2.7GHz). Support AES-NI.
- Configuration: 8GB DDR3L RAM, 512GB mSATA SSD, WiFi, NO 2.5" SATA HDD, Fanless
- Audio in/out

It is way overkill for a home router even with 100M+ donwload speed. However it has the extra power to do some docker testing.

---

### Software

Function|Software
---|---
OS|Ubuntu Server
IPv6 DHCP Client|wide-dhcpv6-client
Firewall|shorewall & shorewall6
Wi-Fi Access Point|hostapd
DNS and DHCP Server|dnsmasq

---

### Network Layout

NIC Port|Network Zone|IPv4|IPv6
---|---|---|---
1|WAN (Internet)|from ISP|from ISP
2 & Wi-Fi|DMZ|10.0.0.1/24|PD from ISP
3 & 4|LAN|192.168.0.1/24|PD from ISP

---

### OS Network Setup

The base OS is Ubuntu Server with unnecessary packages removed. You can check my [Ubuntu Commands](/blog/ubuntu-cmd/) page on that.

To support IPv6 and as a router, following need to be set in `/etc/sysctl.conf`

```ini
net.ipv4.ip_forward=1
net.ipv4.conf.all.accept_source_route = 1
net.ipv6.conf.all.accept_source_route = 1
net.ipv6.conf.all.forwarding=1
net.ipv6.conf.enp1s0.accept_ra=2
net.ipv6.conf.enp1s0.router_solicitations=1
```

```enp1s0``` is device name of NIC 1. The last 2 lines are for accepting IPv6 info from upstream ISP.

#### Netplan Setup

The base interface setup is as follow in `/etc/netplan/01-netcfg.yaml`

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      dhcp4: true
      dhcp-identifier: mac
      link-local: [ ]
    enp2s0:
      optional: true
    enp3s0:
      optional: true
    enp4s0:
      optional: true
  bridges:
    dmz:
      addresses:
        - 10.0.0.1/24
      interfaces:
        - enp2s0
    lan:
      addresses:
        - 192.168.0.1/24
      interfaces:
        - enp3s0
        - enp4s0
```

First we have the "wan" interface `enp1s0`:

Option|Usage
---|---
dhcp4: true|We need to IPv4 address from upstream
dhcp-identifier: mac|This is needed to get proper dhcp
link-local: [ ]|This prevent systemd-network from starting dhcp6, explain below.

The ```optional: ture``` for other interfaces allow boot process to continue without delay if no cable is pluged in.

Then we have our two bridges `dmz` and `lan`.

`dmz` is `enp2s0`(NIC2) by itself. `hostapd` will add the wi-fi interfaces to it in later section.

`lan` consist of `enp3s0`(NIC3) and `enp4s0`(NIC4) bridged to gether for internal network.

Plug in your internet cable to NIC 1 and enable the settings:

```sh
netplan apply
```

Internet access should be working with IPv4.

#### Netplan & accept_ra

Though `net.ipv6.conf.enp1s0.accept_ra=2` is set in `sysctl.conf`, netplan will remove it during network start up because `link-local: [ ]` is used. That will prevent the router from receiving IPv6 info from upsgtream.

To make sure accept_ra is set after network interface is up, create following files:

`/etc/systemd/system/accept_ra.service`:

```ini
[Unit]
Description=set net.ipv6.conf.enp1s0.accept_ra to 2
After=network-online.target

[Service]
ExecStart=/root/accept_ra.sh

[Install]
WantedBy=multi-user.target
```

`/root/accept_ra.sh`

```sh
#!/bin/sh
echo 2 > /proc/sys/net/ipv6/conf/enp1s0/accept_ra
```

Enable it during boot:

```sh
chmod +x /root/accept_ra.sh
systemctl daemon-reload
systemctl enable accept_ra
```

#### wide-dhcpv6-client

While dmz and lan IPv4s are configured in netplan, IPv6 use global address even for devices within your network. PD(prefix-delegation) is requied for `lan`, `dmz` interfaces so devices behind them will work correctly.

Netplan doesn't support PD config at the time of writing. Package `wide-dhcpv6-client` is used. It is able to assign PD IPv6 addresses to other interfaces after PDs are received, almost (see sla-len at end of this section) without any address hardcoding in the config file or external helper script.

Install package:

```sh
apt install wide-dhcpv6-client
```

Config file is located at `/etc/wide-dhcpv6/dhcp6c.conf`

```ini
# WAN interface
interface enp1s0 {
  send ia-na 1; # request NA for wan
  send ia-pd 1; # request PD for lan
  send ia-pd 2; # request PD for dmz
  send rapid-commit; # don't wait for ra
};

id-assoc na 1 {
  # id-assoc for wan
};

# PD : LAN

id-assoc pd 1 {
  prefix-interface lan {
    sla-id 0;
    sla-len 0;
    ifid 1;
  };
};

# PD : DMZ

id-assoc pd 2 {
  prefix-interface dmz {
    sla-id 0;
    sla-len 0;
    ifid 1;
  };
};
```

Enable `wide-dhcpv6-client` during startup:

```sh
systemctl enable wide-dhcpv6-client
```

After reboot all 3 interfaces(enp1s0, dmz, lan) should have IPv4 and IPv6(scope global) addresses.

```sh
ip a
```

> `sla-len` : Do `journalctl -t dhcp6c | grep 'IA_PD prefix:'`. If the IA_PD prefix end in /56 instead of /64, change both line to `sla-len 8;`. This config is for /64 prefix and actually not sutitable for /56, which should use a single `id-assoc pd` block with two `prefix-interface`.

---

### Firewall

A firewall is needed for the following:

- stop incoming traffic
- NAT for IPv4 traffic from lan/dmz to internet
- separation of lan and dmz

Shorewall and shorewall6 are used due to their ease of configuration. To install:

```sh
apt install shorewall shoreall6
```

Following are the basic configuration.

#### Shorewall

Shorewall handle IPv4 traffic. Following are config files base on `/usr/share/doc/shorewall/examples/three-interfaces/`.

`/etc/shorewall/zones`

```ini
#ZONE   TYPE    OPTIONS                 IN                      OUT
#                                       OPTIONS                 OPTIONS
fw      firewall
net     ipv4
loc     ipv4
dmz     ipv4
```

`/etc/shorewall/interfaces`

```ini
?FORMAT 2
#ZONE   INTERFACE       OPTIONS
net     NET_IF          dhcp,tcpflags,nosmurfs,routefilter,logmartians,sourceroute=0,physical=enp1s0
loc     LOC_IF          dhcp,tcpflags,nosmurfs,routefilter,logmartians,physical=lan
dmz     DMZ_IF          dhcp,tcpflags,nosmurfs,routefilter,logmartians,sourceroute=0,physical=dmz
```

`/etc/shorewall/policy`

```ini
#SOURCE DEST            POLICY          LOGLEVEL        RATE    CONNLIMIT
loc     net             ACCEPT
loc     $FW             ACCEPT
loc     dmz             ACCEPT
$FW     loc             ACCEPT
$FW     dmz             ACCEPT
$FW     net             ACCEPT
dmz     net             ACCEPT
net     all             DROP            #$LOG_LEVEL
# THE FOLOWING POLICY MUST BE LAST
all     all             REJECT          #$LOG_LEVEL
```

`/etc/shorewall/rules`

```ini
#ACTION         SOURCE          DEST            PROTO   DEST    SOURCE          ORIGINAL        RATE            USER/   MARK    CONNLIMIT       TIME         HEADERS          SWITCH          HELPER
#                                                       PORT    PORT(S)         DEST            LIMIT           GROUP
?SECTION ALL
?SECTION ESTABLISHED
?SECTION RELATED
?SECTION INVALID
?SECTION UNTRACKED
?SECTION NEW
#
# Don't allow connection pickup from the net
#
Invalid(DROP)   net             all             tcp
#
# Accept DNS connections from DMZ to firewall
#
DNS(ACCEPT)     dmz             $FW
#
# Drop Ping from the "bad" net zone.. and prevent your log from being flooded..
#
Ping(DROP)      net             $FW
```

`/etc/shorewall/snat`

This is NAT configuration for both lan and dmz.

```ini
#ACTION                 SOURCE                  DEST            PROTO   PORT    IPSEC   MARK    USER    SWITCH  ORIGDEST        PROBABILITY
MASQUERADE              192.168.0.0/24,\
                        10.0.0.0/24           NET_IF
```

#### Shorewall6

Shorewall6 handles IPv6 traffic. Following are config files base on `/usr/share/doc/shorewall6/examples/three-interfaces`. There is no `snat` for IPv6.

`/etc/shorewall6/zones`

```ini
fw      firewall
net     ipv6
loc     ipv6
dmz     ipv6
```

`/etc/shorewall6/interfaces`

```ini
?FORMAT 2
#ZONE   INTERFACE       OPTIONS
net     NET_IF          dhcp,tcpflags,forward=1,nosmurfs,sourceroute=0,physical=enp1s0
loc     LOC_IF          dhcp,tcpflags,forward=1,nosmurfs,physical=lan
dmz     DMZ_IF          dhcp,tcpflags,forward=1,nosmurfs,physical=dmz
```

`/etc/shorewall6/policy`

```ini
#SOURCE DEST            POLICY          LOGLEVEL        RATE    CONNLIMIT
loc     net             ACCEPT
loc     $FW             ACCEPT
loc     dmz             ACCEPT
$FW     loc             ACCEPT
$FW     dmz             ACCEPT
$FW     net             ACCEPT
dmz     net             ACCEPT
net     all             DROP            #$LOG_LEVEL
# THE FOLOWING POLICY MUST BE LAST
all     all             REJECT          #$LOG_LEVEL
```

`/etc/shorewall6/rules`

```ini
#ACTION         SOURCE          DEST            PROTO   DEST    SOURCE          ORIGINAL        RATE            USER/   MARK    CONNLIMIT       TIME         HEADERS          SWITCH          HELPER
#                                                       PORT    PORT(S)         DEST            LIMIT           GROUP
?SECTION ALL
?SECTION ESTABLISHED
?SECTION RELATED
?SECTION INVALID
?SECTION UNTRACKED
?SECTION NEW

Invalid(DROP)   net             all             tcp
DNS(ACCEPT)     $FW             net
DNS(ACCEPT)     dmz             $FW
Ping(ACCEPT)    $FW             loc
Ping(DROP)      net             $FW
Ping(DROP)      net             loc
Ping(DROP)      net             dmz
ACCEPT          $FW             loc             icmp
ACCEPT          $FW             net             icmp
ACCEPT          $FW             dmz             icmp
```

More detail examples of all the config files are in the example directory.

---

### Wi-Fi AP

Install `hostapd` to create a wi-fi access point.

```sh
apt install hostapd iw
```

`iw` is a command line wifi configuration tool. It can list capabilities of wi-fi adapter.

```sh
iw list
```

Wi-Fi adapter of my box is `wlp5s0`. It will be added to bridge `lan`.

A 2nd virtual interface `wlan0` will be created and join bridge `dmz`.

```ini
driver=nl80211

hw_mode=a
ieee80211d=1    # limit the frequencies used to those allowed in the country
country_code=US # the country code
channel=0       # auto config channel
ieee80211n=1    # 802.11n support
ieee80211ac=1   # 802.11ac support

# Physical adapter
interface=wlp5s0
bssid=<mac address of wlp5s0>
bridge=lan
ssid=lan
wpa_passphrase=<LANpassword>
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP
rsn_pairwise=CCMP
auth_algs=1

# Virtual adapter
bss=wlan0
bssid=<mac address of wlan0>
bridge=dmz
ssid=dmz
wpa_passphrase=<DMZpassword>
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP
rsn_pairwise=CCMP
auth_algs=1
```

`bssid` of the physical wi-fi adapter(`wlp5s0`) is its real mac address.

`bssid` of the virtual wi-fi adapter(`wlan0`) can be any valid mac address format that don't conflict with other devices in the network. I usually just increse the physical adapter mac by 1.

`hostapd` may die during boot up due to interface initialization timing. Add following in hostapd.service `[Service]` section:

```ini
[Service]
...
Restart=always
restartSec=5sec
```

Enable and restart service:

```sh
systemctl daemon-reload
systemctl enable hostapd
systemctl restart hostapd
```

Reference:

- http://wiki.stocksy.co.uk/wiki/Multiple_SSIDs_with_hostapd
- http://lists.infradead.org/pipermail/hostap/2010-February/021127.html

---

### DNS & DHCP

`dnsmasq` is used to provide both dns and dhcp services for dmz and lan. It is able to create IPv6 dhcp range automatically base on IPv6 address of the interface.

```sh
apt install dnsmasq
```

Put the configuration file in `/etc/dnsmasq/`.

```ini
except-interface=enp1s0

no-poll         # don't poll /etc/resolv.con for change
no-resolv       # don't use /etc/resolv.conf
bogus-priv      #
domain-needed   # don't query upstream with hostname only

## IPv4 DNS Forwarder
server=8.8.8.8
server=8.8.4.4
server=1.1.1.1
server=1.0.0.1

## IPv6 DNS Forwarder
server=2001:4860:4860::8888
server=2001:4860:4860::8844
server=2606:4700:4700::1111
server=2606:4700:4700::1001

# DHCP

enable-ra
## LAN
dhcp-range=tag:lan,::1,constructor:lan,ra-names,72h # IPv6
dhcp-range=tag:lan,192.168.0.130,192.168.0.250,72h # IPv4
dhcp-option=tag:lan,option:router,192.168.0.1 # option 3 default gw
dhcp-option=tag:lan,6,192.168.0.1 # option 6 dns

## DMZ
dhcp-range=tag:dmz,::1,constructor:dmz,ra-names,72h # IPv6
dhcp-range=tag:dmz,10.0.0.100,10.0.0.120,72h # IPv4
dhcp-option=tag:dmz,option:router,10.0.0.1 # option 3 default gw
dhcp-option=tag:dmz,6,10.0.0.1 # option 6 dns
```

Disable `systemd-resolved` as it is Ubuntu default dns server and delete existing `/etc/resolv.conf`.

```sh
systemctl disable systemd-resolved
systemctl stop systemd-resolved
rm /etc/resolv.conf
```

Create new `/etc/resolv.conf`

```ini
nameserver ::1
nameserver 127.0.0.1
```

---

### Conslusion

It took much longer than I thought to put all this together.

I had to switch packages a few times due to various reasons, but mostly to avoid creating custome scripts. The most notible one is dnsmasq replacing both systemd-resolverd/powerDNS-recursor and radvd. dnsmasq is able to handle both functions with much cleaner way and more flexibility.

I believe currently, if not using a full router/firewall distro like OpenWrt, pfSense or ClearOS, then dnsmasq with wide-dhcpv6-client is the best combination for DIY Linux router solution. Their ability of auto IPv6 prefix handling, which allow configurations without hardcoding IPv6 prefix, is especially important for location that can't secure their own IPV6 prefix.

---

### Bonus

#### mpd on Qotom-Q355G4

`mpd` has difficulty identifying the alsa PCM on Qotom-Q355G4. Use following `/etc/asound.conf` to solve it:

```ini
defaults.pcm.device 1
defaults.ctl.card 1
defaults.pcm.card 1
```
