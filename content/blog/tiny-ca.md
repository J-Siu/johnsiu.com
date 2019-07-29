---
type: "blog"
date: 2019-07-27T14:48:25-04:00
author: "John Siu"
title: "Tiny CA - OpenSSL-CA"
description: "Create a tiny CA"
tags: ["openssl","ca","certificate","authority"]
draft: false
---
Bite the bullet and create a tiny CA for local network.
<!--more-->

### Background

As browsers are getting more secure and packed with more safeguards to prevent malicious actors from doing their biddings, they are becoming much less friendly with self-signed certificates. This become a pain in small lab and other wall-offed network. While using http for non-prod/testing can be the solution, it is not ideal and may create other issues.

### Goals

- Create the simplest CA setup that can be recreated and throw away at wish.
- Create one wildcard server certificate for any servers in the network.

### Fast Forward

The result is a simple script with a openssl config file that will generate a CA and a wildcard certificate.

GitHub: [tiny_ca](https://github.com/J-Siu/tiny_ca)

> ***WARNING:*** This is intended for testing/throw-away environment. Don't use it for production.

#### Usage

```zsh
git clone https://github.com/J-Siu/tiny_ca.git
cd tiny_ca
# Change line 1 of cert-gen.sh if you want to use domain other than local.local.
cert-gen.sh
```

#### Output

```zsh
--- Prepare directory
./cert-gen.sh: line 22: Certificate: not found
--- Generate Root Key
Generating a RSA private key
......................................................+++++
...........................................+++++
writing new private key to './ca/ca.local.local.key.pem'
-----
--- Generate Server Key
Generating RSA private key, 2048 bit long modulus (2 primes)
..........+++++
................+++++
e is 65537 (0x010001)
--- Generate Server CSR
--- Generate Server Certificate
Using configuration from openssl-root.cnf
Check that the request matches the signature
Signature ok
Certificate Details:
        Serial Number: 4096 (0x1000)
        Validity
            Not Before: Jul 29 05:35:25 2019 GMT
            Not After : Jul 26 05:35:25 2029 GMT
        Subject:
            countryName               = CA
            stateOrProvinceName       = local.local
            organizationName          = local.local
            commonName                = *.local.local
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            Netscape Cert Type:
                SSL Server
            Netscape Comment:
                OpenSSL Generated Server Certificate
            X509v3 Subject Key Identifier:
                D2:7B:C9:DF:15:D6:5E:37:61:BC:64:57:91:A9:8F:99:17:D7:76:6D
            X509v3 Authority Key Identifier:
                keyid:AC:0A:54:5E:BA:44:1F:71:C8:B7:2F:15:6F:06:87:B5:15:4E:1B:1F
                DirName:/C=CA/ST=local.local/O=local.local/CN=root
                serial:14:78:AE:7D:B1:BB:D0:0E:E3:03:C1:9F:BE:51:4E:F4:14:1B:7A:A8

            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage:
                TLS Web Server Authentication
Certificate is to be certified until Jul 26 05:35:25 2029 GMT (3650 days)
Sign the certificate? [y/n]:

1 out of 1 certificate requests certified, commit? [y/n]Write out database with 1 new entries
Data Base Updated

--- CA Certificate:
./ca/ca.local.local.crt.pem
--- Server Certificate:
./srv/wildcard.local.local.key.pem
./srv/wildcard.local.local.crt.pem
```

Install CA certificate into browser.
Install server certificate and key into webserver.

### Reference

[OpenSSL Certificate Authority](https://jamielinux.com/docs/openssl-certificate-authority/index.html) by Jamie Nguyen.

[openssl-ca](https://www.openssl.org/docs/manmaster/man1/ca.html) man page.
