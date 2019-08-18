---
type: "blog"
date: 2016-10-11T04:57:04Z
tags: ["javascript", "typescript", "angular"]
description: "A message queue service for Angular inter-component communication base on RxJS."
title: "Angular Simple MQ Service"
aliases:
    - /angular-simple-mq-service
    - /angular2-simple-mq-service
    - /blog/angular2-simple-mq-service
    - /index.php/angular-simple-mq-service
    - /index.php/angular2-simple-mq-service
    - /index.php/2016/10/11/angular-simple-mq-service
    - /index.php/2016/10/11/angular2-simple-mq-service
---
A message queue service for Angular inter-component communication base on RxJS.
<!--more-->

Name/ID(string) base API. RxJS object not exposed.

(This package does not communicate with RabbitMQ or any other message queue software/service.)

> __ng2-simple-mq__ uses Angular CLI starting 8.2.0. New repository https://github.com/J-Siu/ng2-simple-mq-lib/ contains both library and example.
>
> Version < 8.2.0 are in old repository https://github.com/J-Siu/ng2-simple-mq/

### Install

```sh
npm install ng2-simple-mq
```

### Usage

__ng2-simple-mq__ is implemented as Angular 2 injectable service name __SimpleMQ__.

#### Module

Add `SimpleMQ` into module providers (eg. [app.module.ts](https://github.com/J-Siu/ng2-simple-mq-lib/blob/master/src/app/app.module.ts)).

```javascript
import { SimpleMQ } from 'ng2-simple-mq';

@NgModule({
  providers: [SimpleMQ]
})
```

#### Component

```javascript
import { SimpleMQ } from 'ng2-simple-mq';

export class ChildComponent {

  constructor(private smq: SimpleMQ) { }

}
```

### API

#### newQueue(name: string): boolean

`newQueue` will create queue `name`.

Return `false` if queue `name` exist.

```javascript
this.smq.newQueue('broadcast');
```

#### delQueue(name: string): boolean

`delQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```javascript
this.smq.delQueue('broadcast');
```

#### getQueue(): string[]

`getQueue` will return all queue name in string array.

```javascript
let q: string[] = this.smq.getQueue();
```

#### getSubscription(): string[]

`getSubscription` will return all subscription id in string array.

```javascript
let ids: string[] = this.st.getSubscription();
```

#### publish(name: string, msg: any, lazy = true): boolean

`publish` will put `msg` into queue `name`.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return true if successful.

Return false if any of following is true:

- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `msg` is undefined.

```javascript
// lazy mode
message = 'This is a broadcast message';
this.smq.publish('broadcast',message);
```

#### subscribe(name: string, callback: (any) => void, lazy = true): string

`subscribe` will link `callback` function to queue `name`. Whenever queue `name` receive a new message, `callback` will be invoked.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return subscription id if successful.

Return empty string if any of following is true:

- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `callback` is undefined.

Either use Lambda(fat arrow) in typescript to pass in callback or bind `this` to another variable in javascript, else `this` scope will be lost.

__Lambda(fat arrow)__

```javascript
broadcastMsg;

ngOnInit() {
  // lazy mode
  this.smq.subscribe('broadcast', e => this.receiveBroadcast(e));
}

receiveBroadcast(m) {
  this.broadcastMsg = m;
}
```

#### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```javascript
id: string;

this.st.unsubscribe(this.id);
```

### Example

You will need Angular CLI to build the library and run the example.

```sh
git clone https://github.com/J-Siu/ng2-simple-mq-lib.git
cd ng2-simple-mq-lib
npm i
ng build ng2-simple-mq
ng serve --open
```

### Repository

- [ng2-simple-mq-lib](https://github.com/J-Siu/ng2-simple-mq-lib)

### Contributors

- [John Sing Dao Siu](https://github.com/J-Siu)

### Changelog

- 0.1.0-alpha - Initial
- 0.1.1-alpha - Add Readme.md
- 0.1.2-alpha - Readme.md fix
- 0.1.3-alpha - Fix components.js
- 0.2.0
  - Complete Readme.md
  - Fix index.js and index.d.ts
- 0.2.1
  - API change
  - newQueue return boolean
  - API new
  - delQueue
  - getSubscription
  - unsubscribe
- 0.2.2
  - Support Angular2 RC5
- 0.2.3
  - Fix Readme.md
- 1.2.4
  - Support Angular2 ^2.0.0
  - Clean up package
- 1.2.5
  - Add Plunker example
- 1.2.6
  - Support Angular2 ^2.4.1
  - Replace node-uuid with angular2-uuid
  - Add instruction for `"noImplicitAny": false`
*- 1.2.7
  - Due to the rapid release cycle of Angular, to minimize
    update purely due to `peerDependencies`,
    it is modified as follow:
     `"peerDependencies": { "@angular/core": ">2.4.1" }`
- 1.2.8
  - Update to support Angular 4.3.1. Please use previous version for Angular 2.x.x.
- 1.2.9
  - Fix issue#2 `delQueue`
- 8.2.0
  - Support Angular 8.2.0
  - Switch to Angular Cli for faster update
  - Include example
- 8.2.1
  - README.md clean up

### License

The MIT License

Copyright (c) 2019

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
