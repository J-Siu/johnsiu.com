---
author: "John Siu"
date: 2025-08-03T22:59:32-04:00
description: ""
draft: true
tags: [""]
title: "IPv6"
type: "blog"
---
Some old notes on Ipv6
<!--more-->
### RFC

- IPv6 RFC2460
- IPv4 RFC791

128bit / 32byte / 8 "hextet"

Global Unicast Address (GUA): public routable addresses 2000::/3

Link-local Unicast address start with fe80: only usable within same network segment, not routable.

Multicast address: start with ff02:, eg RA usually use ff02::1

unique local address (ULA) fc00::/7 to fdff::/7

loopback ::1

- fc00::/8 (1111 1100): When the L flag is set to 0, may be defined in the future.
- fd00::/8 (1111 1101): When the L flag is set to 1, the address is locally assigned.

Because the only legitimate value for the L flag is 1, the only valid ULA addresses today are in the fd00::/8 prefix.

IPv4 Embedded Address

IPv4-mapped IPv6 addresses
::ffff:ipv4

unspecified unicast address

Solicited-node multicast addresses

IPv4 ARP = IPv6 NDP

ICMPv6
- Neighbor Discovery Protocol (NDP)
- Neighbor Solicitation (NS)
- Neighbor Advertisement (NA) Messages
- Router Solicitation (RS)
- Router Advertisement (RA) Messages
  - SLAAC
  - SLACC and stateless DHCPv6
  - Statefull DHCPv6

Prefix : network portion of the address
Prefix length: The prefix length is the number of most-significant or leftmost bits that define the prefix, the network portion of the address. This is equivalent to the subnet mask in IPv4. IPv6 addresses are 128 bits, so the prefix length can be /0 to /128.

Image Interface ID: The Interface ID is equivalent to the host portion of an IPv4 address. IPv6 uses the term Interface ID because any type of device can have an IP address, not just a host computer. A device with an IPv6 interface may range anywhere from a common server or client computer to an espresso machine or biomedical sensor. The term interface is used because an IP address (IPv4 or IPv6) is assigned to an interface, and a device may have multiple interfaces.
