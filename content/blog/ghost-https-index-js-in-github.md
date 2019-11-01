---
type: "blog"
date: 2017-03-13T07:00:18Z
tags: ["ghost", "https", "nodejs", "blog", "http2", "spdy"]
title: "Ghost Https index.js in GitHub"
description: "Ghost Https index.js in GitHub"
aliases:
    - /ghost-https-index-js-in-github
    - /index.php/ghost-https-index-js-in-github
    - /index.php/2017/03/13/ghost-https-index-js-in-github
---

In an earlier __[post](/ghost-blog-self-hosted-with-https-using-nodejs-only/)__ I talk about running __[Ghost Blog](//ghost.org)__ with https using nodejs only.
<!--more-->

> Update 2017/03/16 - Code in this post work for Ghost 0.11.4 but not 0.11.7.
>
>If you are running Ghost 0.11.7 or later, please check the latest version from my GitHub repository. Link provided at the end of post.

Since then I have enhanced it according to my need. Replaced the `https` package with `spdy` to support http2.

The resulting `index.js` can be divided in two parts.

### Part 1

Part 1 contain 99% of the code added to the original Ghost index.js file.

In addition to pulling in required libraries, it also set the cypher suite, and handle http to https redirect.

Just remember to fill-in your certificate info.

```js
// HTTPS

const fs = require('fs');
const url = require('url');
const http = require('http');
const https = require('spdy');

// Fill in your certificate files
const serverKey='';
const serverCrt='';
const serverCa='';

const httpsOptions = {
  key: fs.readFileSync(serverKey),
  cert: fs.readFileSync(serverCrt),
  ca: fs.readFileSync(serverCa),
  ciphers: [
    "ECDHE-RSA-AES256-SHA384",
    "DHE-RSA-AES256-SHA384",
    "ECDHE-RSA-AES256-SHA256",
    "DHE-RSA-AES256-SHA256",
    "ECDHE-RSA-AES128-SHA256",
    "DHE-RSA-AES128-SHA256",
    "HIGH",
    "!aNULL",
    "!eNULL",
    "!EXPORT",
    "!DES",
    "!RC4",
    "!MD5",
    "!PSK",
    "!SRP",
    "!CAMELLIA"
  ].join(':'),
};

// HTTP Redirect to HTTPS

http.createServer(function (req, res) {
  res.writeHead(301, { "location": "https://johnsiu.com" + req.url });
  res.end();
}).listen(80, '0.0.0.0');
```

### Part 2

Part 2 is mainly the original Ghost `index.js` file with only one line comment out and one line for starting the Ghost with https.

```js
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
  //ghostServer.start(parentApp);

  https.createServer(httpsOptions, parentApp).listen(443, '0.0.0.0');
}).catch(function (err) {
  errors.logErrorAndExit(err, err.context, err.help);
});
```

### Conclusion

Putting the two parts together give you a drop-in replacement of the original `index.js` file and enable you run Ghost with https without additional packages.

The file is hosted in GitHub __[ghost-https-indexjs](//github.com/J-Siu/ghost-https-indexjs)__ with instructions.

A standalone proxy version is here: __[ghost-https-nodejs-proxy](//github.com/J-Siu/ghost-https-nodejs-proxy)__.
