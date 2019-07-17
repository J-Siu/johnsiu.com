---
type: "blog"
date: 2017-04-08T15:17:58Z
tags: ["ghost", "http2", "spdy", "https", "blog", "nodejs", "proxy"]
title: "H2Ghost - The Revamped Ghost HTTP2/S Solution"
---
<!--more-->

[__H2Ghost__](//github.com/J-Siu/h2ghost) is a http2/https front end for [Ghost Blog](//ghost.org), either via proxy or using Ghost's rootApp directly, providing an Node.js alternative to Nginx or Apache. It is a complete replacement of [ghost-https-indexjs](//github.com/J-Siu/ghost-https-indexjs)(discontinued) and [Ghost Https Nodejs Proxy](//github.com/J-Siu/ghost-https-nodejs-proxy)(renamed to this project).

It can be used as Ghost Blog start up wrapper.

#### Highlight

- Single Node.js process for both H2Ghost and your Ghost instant (configurable).

- HTTP to HTTPS redirect.

- HTTPS primary URL redirect for site with multiple domain/sub-domain.

- Minimum configuration.

 4 - 6 lines if installing in same box with Ghost.

```js
const ghost = {
  start: 'app',
  env: 'production',
  dir: '/home/ghost/ghost',
  // ... no more change for rest of this section
}

const cert = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  //ca: fs.readFileSync(''),
  //pfs: fs.readFileSync('')
}
```

- [Helmet](https://github.com/helmetjs/helmet) support

```js
const helmetOptions = {
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  dnsPrefetchControl: false,
  noCache: false,
  xssFilter: false,
  //contentSecurityPolicy: {},
  //frameguard: {},
  //referrerPolicy: {},
  //hsts: {},
  //hpkp: {}
}
```

#### Full Instruction & Package

__GitHub:__ [__H2Ghost__](//github.com/J-Siu/h2ghost)
