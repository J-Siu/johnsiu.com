---
author: "John Siu"
date: 2019-08-22T15:54:28-04:00
description: "A list of Google IP addresses."
tags: ["google","cheatsheet","ip"]
title: "Google IP Addresses"
type: blog
---
All Google IP addresses.
<!--more-->

### Auto Update

> Update using javascript + DoH at browser. Will not work if DoH(dns.google) is blocked.

IPv4|IPv6
---|---
|<div id="v4">Not Available</div>|<div id="v6">Not Available</div>|

### Command Line Check

#### nslookup

```sh
nslookup -q=TXT _spf.google.com 8.8.8.8
nslookup -q=TXT _netblocks.google.com 8.8.8.8
nslookup -q=TXT _netblocks2.google.com 8.8.8.8
nslookup -q=TXT _netblocks3.google.com 8.8.8.8
```

#### dig

```sh
dig @8.8.8.8 _spf.google.com txt
dig @8.8.8.8 _netblocks.google.com txt
dig @8.8.8.8 _netblocks2.google.com txt
dig @8.8.8.8 _netblocks3.google.com txt
```

### Manual Check Result

> In case auto update does not work. Last update 2019-09-15.

|IPv4|IPv6
|---|---
|35.190.247.0/24|2001:4860:4000::/36
|35.191.0.0/16|2404:6800:4000::/36
|64.233.160.0/19|2607:f8b0:4000::/36
|66.102.0.0/20|2800:3f0:4000::/36
|66.249.80.0/20|2a00:1450:4000::/36
|72.14.192.0/18|2c0f:fb50:4000::/36
|74.125.0.0/16
|108.177.8.0/21
|108.177.96.0/19
|130.211.0.0/22
|172.217.0.0/19
|172.217.32.0/20
|172.217.128.0/19
|172.217.160.0/20
|172.217.192.0/19
|173.194.0.0/16
|209.85.128.0/17
|216.239.32.0/19
|216.58.192.0/19

### Reference

[Google IP address ranges for outbound SMTP](//support.google.com/a/answer/60764)

<script>

// Get SPF result
fetch('//dns.google/resolve?name=_spf.google.com&type=txt')
.then(j=>j.json())
.then(j=>spf2blocks(JSON.parse(j.Answer[0].data)))
.then(b=>{
  var ip = []
  ip.v4=[]
  ip.v6=[]
  for (i=0;i<b.length;i++){
    fetch('//dns.google/resolve?name='+b[i]+'&type=txt')
    .then(k=>k.json())
    .then(k=>block2ip(JSON.parse(k.Answer[0].data)))
    .then(c=>{
      ip.v4=ip.v4.concat(c.v4).sort(ip_compare)
      ip.v6=ip.v6.concat(c.v6).sort(ip_compare)
      document.getElementById("v4").innerHTML=ip2table("IPv4",ip.v4)
      document.getElementById("v6").innerHTML=ip2table("IPv6",ip.v6)
    })
  }
})

// ---

// Get blocks from SPF
function spf2blocks(msg){
  // split by space
  var str = msg.split(" ")
  var blocks = []
  var tmp = []
  for (i=0;i<str.length;i++){
    tmp=str[i].split(":")
    // add "include" to block list
    if (tmp[0]==="include"){
      blocks.push(tmp[1])
    }
  }
  return blocks
}

// IPv4/6 list
function block2ip(msg){
  // split by space
  var str = msg.split(" ")
  var ip = []
  ip.v4=[]
  ip.v6=[]
  for (i=0;i<str.length;i++){
    if (str[i].startsWith("ip4:")){
      ip.v4.push(str[i].substring(4,str[i].length))
    }
    if (str[i].startsWith("ip6:")){
      ip.v6.push(str[i].substring(4,str[i].length))
    }
  }
  return ip
}

// IP list to table
function ip2table(title,list){
  var str=""
  str+="<table>"
//  str+="<thead><tr><th>"+title+"</th></tr></thead>"
  str+="<tbody>"
  for(i=0;i<list.length;i++){
    str+="<tr><td>"+list[i]+"</td></tr>"
  }
  str+="</tbody>"
  str+="</table>"
  return str
}

function ip_compare(a,b){
  var delimiter = "." // IPv4
  if (a.indexOf(":") > -1){
    delimiter = ":" // IPv6
  }
  var ip1 = a.split(delimiter)
  var ip2 = b.split(delimiter)
  for (i=0;i<ip1.length;i++){
    if (ip1[i]!=ip2[i]){
      return (ip1[i]-ip2[i])
    }
  }
  return 0
}

</script>