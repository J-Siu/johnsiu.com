---
type: "blog"
date: 2016-10-11T02:26:54Z
tags: ["javascript", "typescript", "angular"]
title: "Angular Simple API Client Service"
description: "simple-api-client-ng2 is an Angular api service, which work with simple-api-express, an ExpressJS api handler."
aliases:
    - /simple-api-client-for-angular
    - /index.php/simple-api-client-for-angular
    - /index.php/2016/10/11/simple-api-client-for-angular
---

[simple-api-client-ng2](https://github.com/J-Siu/ng2-simple-api-lib) is an Angular api service, which work with [simple-api-express](https://github.com/J-Siu/simple-api-express), an ExpressJS api handler.

<!--more-->

> __simple-api-client-ng2__ uses Angular CLI starting 8.2.0. New repository https://github.com/J-Siu/ng2-simple-api-lib/ contains both library and server example.
>
> Version < 8.2.0 are in old repository https://github.com/J-Siu/simple-api-client-ng2/

### Install

```sh
npm install simple-api-client-ng2
```

### Usage

`simple-api-client-ng2` is implemented as Angular 2 injectable service name __SimpleApiClient__.

#### Module

Add `SimpleApiClient` into module providers:

```javascript
import { SimpleApiClient } from 'simple-api-client-ng2';

@NgModule({
  providers: [SimpleApiClient]
})
```

#### Component

```javascript
import {SimpleApiClient, SimpleApiObj} from 'simple-api-client-ng2';

export class ChildComponent implement OnInit {

  apiObject: SimpleApiObj;

  constructor(private api: SimpleApiClient) { }

  ngOnInit() {
    this.apiObject = this.api.get('/demo');

    let reply = '';
    this.apiObject.call(
      'echo',
      'This is a test',
      r => this.reply = r);

    console.log(this.reply);
  }

}
```

### API

#### SimpleApiClient.get

`SimpleApiClient.get(baseUrl: string = '/'): SimpleApiObj`
will return a SimpleApiObj configure with `baseUrl`.
Previous created SimpleApiObj will be returned if the same baseUrl is used.

```javascript
  this.apiObject = this.api.get('/demo');
```

#### SimpleApiClient.list

`SimpleApiClient.list(): string[]` will return a string array containing the baseUrl of all SimpleApiObj created.

#### SimpleApiObj.call

`SimpleApiObj.call(method, params, callback, errorHandler)`

- __method: string__ Name of api
- __params: any__ Argument of api, can be basic type like string, number, or object
- __callback: (result: any) => void__ Callback function for handling api result
- __errorHandler: (error: any) => void = this.errorHandler__ Optional error handler to handle api call error

#### SimpleApiObj.setErrorHandler

`SimpleApiObj.setErrorHandler(handler: (any) => void)` replace SimpleApiObj default error handler with the specified one.

### Error Handling

For detail example on error handling, please refer to [error.component.ts](https://github.com/J-Siu/ng2-simple-api-lib/blob/master/src/app/error.component.ts) contain in full example below.

### Example

```sh
├── dist/
│   ├── ng2-simple-api-lib/     // Compiled angular application
│   └── simple-api-client-ng2/  // Compiled library
├── projects/
│   └── simple-api-client-ng2/  // Library source
├── server/                     // Example server.
└── src/
    └── app/                    // Example app source
```

> The example server is not an angular application. It is a nodejs application.

You will need Angular CLI to build the library and run the example.

- Angular CLI: 8.2.2
- Node : v10.10.0

```sh
git clone https://github.com/J-Siu/ng2-simple-api-lib.git
cd ng2-simple-api-lib
npm i
```

Build the library:

```sh
ng build simple-api-client-ng2
```

Build the Angular app:

```sh
ng build
```

Run the server:

```sh
cd server
node server.js
```

Connect your browser to http://localhost:4000 .

### Repository

- [ng2-simple-api-lib](https://github.com/J-Siu/ng2-simple-api-lib)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Changelog

- 1.2.0
  - Publish to NPM.
- 1.2.1
  - Fix Readme.md typo
- 1.2.2
  - Update package.json
  - Update Readme.md
- 8.2.0
  - Support Angular 8.2.0
  - Switch to Angular Cli for faster update.
  - Include example
- 8.2.1
  - README.md clean up

### License

The MIT License

Copyright (c) 2019

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.