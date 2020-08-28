---
type: "blog"
date: 2020-02-08T12:00:00-05:00
author: "John Siu"
title: "Linux Router Dhcpv6 PD Split"
description: "How to split dhcpv6 pd using linux router"
tags: ["linux","how-to","ipv6","router","dhcpv6","pd"]
---
Using dibbler-client / wide-dhcpv6-client to get dhcpv6-pd.
<!--more-->

As IPv6 doesn't have NAT as IPv4, new tools and settings are required for Linux base router. In [Linux IPv6 Router How To](/blog/linux-router/) I covered using wide-dhcpv6-client to get 2 prefix delegations(PD). However that turn out not working for most ISPs. Most service providers will only give out one /64 PD by default, and give out /56 only when requested in settings.

---

### /64 and multiple PDs

`/64` is the most common PD size. However it is not advisable to split it into smaller subnet. If your ISP is supplying multiple /64 PDs, then you can use wide-dhcpv6-client with following config:

```ini
# WAN interface
interface wan {
	send ia-na 1; # NA for wan
	send ia-pd 2; # PD for lan
	send ia-pd 3; # PD for dmz
	send rapid-commit;
};

id-assoc na 1 {
	# id-assoc for wan
};

id-assoc pd 2 {
	prefix ::/64 infinity;
		prefix-interface lan {
		sla-id 0;
		sla-len 0;
		ifid 1;
	};
};

id-assoc pd 3 {
	prefix ::/64 infinity;
		prefix-interface dmz {
		sla-id 0;
		sla-len 0;
		ifid 1;
	};
};
```

`lan` and `dmz` are your internal interfaces. Remember to test IPv6 routing from both network to the internet.

I am not able to configure dibbler-client to get multiple PDs.

---

### /56 & /60 PD

`/56` and `/60` PD sizes are also served by many ISPs. These are much better than `/64` PD for subnetting. However it is getting more and more common that you have to request it specifically in the settings, else you will get a `/64`. Both dibbler-client and wide-dhcpv6-client are able to split them properly.

#### wide-dhcpv6-client

`/etc/wide-dhcpv6-client/dhcp6c.conf`

```ini
# WAN interface
interface wan {
	send ia-na 1; # NA for wan
	send ia-pd 2; # PD
	send rapid-commit;
};

id-assoc na 1 {
	# id-assoc for wan
};

id-assoc pd 2 {
	#prefix ::/56 infinity;  # Uncomment this line for /56 PD
	#prefix ::/60 infinity;  # Uncomment this line for /60 PD

	prefix-interface lan {
		sla-id 0;
		#sla-len 8;      # Uncomment this line for /56 PD
		#sla-len 4;      # Uncomment this line for /60 PD
		ifid 1;
	};
	prefix-interface dmz {
		sla-id 1;
		#sla-len 8;      # Uncomment this line for /56 PD
		#sla-len 4;      # Uncomment this line for /60 PD
		ifid 1;
	};
};
```

Uncomment lines according to the PD size.

`wide-dhcpv6-client` will automatically assign the IPs to the internal internal interfaces.

#### dibbler-client

`/etc/dibbler/client.conf`

```ini
inactive-mode

script "/etc/dibbler/client.sh"

downlink-prefix-ifaces lan,dmz

iface wan {
	rapid-commit 1
	ia
	pd {
		#prefix ::/56  # Uncomment this line for /56 PD
		#prefix ::/60  # Uncomment this line for /60 PD
	}
}
```

Uncomment lines according to the PD size.

`dibbler-client` can automatically split the PD and assign the subnets to interfaces. However the auto assignments part doesn't seems to work for PD < /64. As a result, `client.sh` script is needed.

`/etc/dibbler/client.sh`

```sh
#!/bin/bash

ARGS=$@
SELF=$0
DIBBLER_ACTION=$1

function log () {
	logger $SELF $@
}

log ARG: $ARGS
log ENV: `env`

FLAG=1
IFACE=''
PREFIX=''
for i in $DOWNLINK_PREFIXES
do
	echo IFACE_NAME: $IFACE_NAME >> $LOG
	if [[ $FLAG = 1 ]]
	then
		IFACE=$i
	else
		PREFIX=$i
		PREFIX_ADD=`echo $PREFIX | cut -d/ -f1`
		PREFIX_LEN=`echo $PREFIX | cut -d/ -f2`

		log IFACE:$IFACE PREFIX:$PREFIX PREFIX_ADD:$PREFIX_ADD PREFIX_LEN:$PREFIX_LE
		log `ip address show dev $IFACE`

		# Flash global ipv6 addresse from iface
		ip -6 addr flush dev $IFACE scope global

		if [ "$DIBBLER_ACTION" == "add" -o "$DIBBLER_ACTION" == "update" ]; then
			# set the first IP from the prefix
			CMD="ip address add ${PREFIX_ADD}1/$PREFIX_LEN dev $IFACE"
			log $CMD
			$CMD
		fi
	fi
	let FLAG=3-$FLAG
done
```

The above script should work for any number for internal interfaces without changes.

---

### Prefix Hints

The most important part of all the above config files are prefix hints.

Prefix hints in wide-dhcpv6-client:

```ini
prefix ::/60 infinity;
prefix ::/56 infinity;
```

Prefix hints in dibbler-client:

```ini
prefix ::/60
prefix ::/56
```

Without it, you will likely get a /64 PD.

### ISP Network Behavior

If you currently has a /64 PD and switch to a /56 one, you may get the new PD right away but IPv6 traffic is not routing beyond your router. That is because your ISP router still has your old PD route. The timeout period can range from 24hr to a week.

---

PS: All config files can be found here: [github.com/J-Siu/linux_conf](//github.com/J-Siu/linux_conf)