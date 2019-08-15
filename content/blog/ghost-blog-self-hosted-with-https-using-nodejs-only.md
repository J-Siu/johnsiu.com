---
type: "blog"
date: 2017-02-25T18:15:16Z
tags: ["ghost", "nodejs", "https", "blog"]
title: "Ghost Blog Self Hosted with HTTPS using NodeJS only"
aliases:
    - /ghost-blog-self-hosted-with-https-using-nodejs-only
    - /index.php/ghost-blog-self-hosted-with-https-using-nodejs-only
    - /index.php/2017/02/25/ghost-blog-self-hosted-with-https-using-nodejs-only
---

As of today, the official way for self-hosted __Ghost Blog__ to use HTTPS is to use __[Nginx](http://nginx.org)__ as a front end proxy server. The official guide is __[here](http://support.ghost.org/setup-ssl-self-hosted-ghost/)__.
<!--more-->

#### My Way ...

There are many reasons to use a proxy server in front of NodeJS service such as Ghost. However, it seems overkill in my situation. I come up with 2 ways to just use NodeJS to support HTTPS with __[Ghost 0.11.4](https://ghost.org/developers/)__.

#### Method 1 : Single NodeJS Instance

Install Ghost and test everything working normally. Then modify `index.js` in Ghost installation root as below

```javascript
const fs = require('fs');
const https = require('https');

const httpsOptions = {
  key: fs.readFileSync('<YOUR SERVER KEY FILE PATH>'),
  cert: fs.readFileSync('<YOUR SERVER CERTIFICATE FILE PATH>')
};

// # Ghost Startup
// Orchestrates the startup of Ghost when run from command line.

var ghost = require('./core'),
  express = require('express'),
  errors = require('./core/server/errors'),
  parentApp = express();

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

ghost().then(function (ghostServer) {
  // Mount our Ghost instance on our desired subdirectory path if it exists.
  parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

  // Let Ghost handle starting our server instance.
  // ghostServer.start(parentApp);

  https.createServer(httpsOptions, parentApp).listen(433, '0.0.0.0');

}).catch(function (err) {
  errors.logErrorAndExit(err, err.context, err.help);
});
```

In Ghost installation root, issue following command to install the `https` package:

```sh
npm i https
```

__Pros:__

* Single NodeJS instance.
* No need to configure and maintain additional software packages, like Nginx, outside of the NodeJS knowledge domain.

__Cons:__

* Potential security risk as Ghost NodeJS instance has direct access to certificate files.
* Need to modify and verify each installation or upgrade of Ghost. It may not work in future versions of Ghost.

#### Method 2 : Standalone NodeJS proxy

```js
const fs = require('fs');
const https = require('https');
const proxy = require('http-proxy').createProxyServer();

proxy.on('proxyReq', function (proxyReq, req, res, options) {

  // Ngix: proxy_set_header Host $http_host;
  proxyReq.setHeader('Host', req.headers.host);

  // Ngix: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);

  // Ngix: proxy_set_header X-Forwarded-Proto $scheme;
  proxyReq.setHeader('X-Forwarded-Proto', 'https');

});

const httpsOptions = {
  key: fs.readFileSync('<YOUR SERVER KEY FILE PATH>'),
  cert: fs.readFileSync('<YOUR SERVER CERTIFICATE FILE PATH>')
};
https.createServer(httpsOptions, (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:2368' })
}).listen(443, '0.0.0.0');
```

__Pros:__

* Security risk is lower compare with Method 1 as the proxy can be run under different user than Ghost. Ghost NodeJS instance no longer need nor has access to certificate files.

* No modification within the Ghost installation. It is more future proof.

* No need to configure and maintain additional software packages, like Nginx, outside of the NodeJS knowledge domain.

__Cons:__

* Additional NodeJS instance, but should still use less resources than Nginx or other proxy server.

#### Which method and is this for you?

Maybe, or maybe not.

It works for me, but may not suit your needs. You will have to weight your own pros and cons, like security concern, site traffic, goal, needs, resources, skill set, etc.

There is no definite answer.
