---
author: "John Siu"
date: 2023-07-01T12:18:20-04:00
description: "Openssl cheatsheet"
tags: ["linux","command-line","cheatsheet","openssl"]
title: "OpenSSL Cheatsheet"
type: "blog"
---
<!--more-->
### Download
```sh
DOMAIN=<domain>
openssl s_client -connect $DOMAIN:443 -showcerts </dev/null | openssl x509 -outform pem > $DOMAIN.pem
```
### Decode
#### All
`-text`
```sh
openssl x509 -in <file> -noout -text
openssl x509 -in domain.pem -noout -text
```
#### Extension
`-ext` `<extension>`
```sh
openssl x509 -in <file> -noout -ext subjectAltName
openssl x509 -in <file> -noout -ext keyUsage
```
#### Issuer
`-issuer`
```sh
openssl x509 -in <file> -noout -issuer
```
#### Serial
`-serial`
```sh
openssl x509 -in <file> -noout -serial
```
Subject: `-subject`
```sh
openssl x509 -in <file> -noout -subject
```
### Fingerprint
```sh
openssl x509 -in <file> -noout -fingerprint
openssl x509 -in <file> -noout -fingerprint -md5
openssl x509 -in <file> -noout -fingerprint -sha1
openssl x509 -in <file> -noout -fingerprint -sha256
```