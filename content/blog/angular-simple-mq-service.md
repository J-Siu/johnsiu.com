---
type: "blog"
date: 2016-10-11T04:57:04Z
tags: ["javascript", "typescript", "angular"]
title: "Angular Simple MQ Service"
aliases:
    - /angular-simple-mq-service
    - /angular2-simple-mq-service
    - /blog/angular2-simple-mq-service
    - /index.php/angular-simple-mq-service
    - /index.php/angular2-simple-mq-service
---
`ng2-simple-mq` is a simple message queue for Angular inter-component communication base on RxJS.

<!--more-->

Name/ID(string) base API. RxJS object not exposed.

(This pacakge does not communicate with RabbitMQ or any other message queue software/service.)

## Install

```sh
npm install ng2-simple-mq
```

## Usage

### Import into Angular application (typescript)

`ng2-simple-mq` is implemented as Angular injectable service name **SimpleMQ**.

**For module using SimpleMQ**

Add `SimpleMQ` into module providers (eg. [app.module.ts](https://github.com/J-Siu/ng2-simple-mq-example/blob/master/app/app.module.ts)).

```ts
import { SimpleMQ } from 'ng2-simple-mq';

@NgModule({
    providers: [SimpleMQ]
})
```

**For each child component using SimpleMQ**

```ts
import { SimpleMQ } from 'ng2-simple-mq';

export class ChildComponent {

    constructor(private smq: SimpleMQ) { }

}
```

### API

##### newQueue(name: string): boolean

`newQueue` will create queue `name`.

Return `false` if queue `name` exist.

```ts
this.smq.newQueue('broadcast');
```

##### delQueue(name: string): boolean

`delQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```ts
this.smq.delQueue('broadcast');
```

##### getQueue(): string[]

`getQueue` will return all queue name in string array.

```ts
let q: string[] = this.smq.getQueue();
```

##### getSubscription(): string[]

`getSubscription` will return all subscription id in string array.

```ts
let ids: string[] = this.st.getSubscription();
```

##### publish(name: string, msg: any, lazy = true): boolean

`publish` will put `msg` into queue `name`.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return true if successful.

Return false if any of following is true:
 – `lazy = false`, and queue `name` does not exist.
 – `name` is undefined.
 – `msg` is undefined.

```ts
// lazy mode
message = 'This is a broadcast message';
this.smq.publish('broadcast',message);
```

##### subscribe(name: string, callback: (any) => void, lazy = true): string

`subscribe` will link `callback` function to queue `name`. Whenever queue `name` receive a new message, `callback` will be invoked.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return subscription id if successful.

Return empty string if any of following is true:
 – `lazy = false`, and queue `name` does not exist.
 – `name` is undefined.
 – `callback` is undefined.

Either use Lambda(fat arrow) in typescript to pass in callback or bind `this` to another variable in javascript, else `this` scope will be lost.

**Lambda(fat arrow)**

```ts
broadcastMsg;

ngOnInit() {
    // lazy mode
    this.smq.subscribe('broadcast', e => this.receiveBroadcast(e));
}

receiveBroadcast(m) {
    this.broadcastMsg = m;
}
```

##### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```ts
id: string;

this.st.unsubscribe(this.id);
```

## Example

Github: [ng2-simple-mq-example](https://github.com/J-Siu/ng2-simple-mq-example)
Plunker: [Angular2 Simple MQ Example](http://embed.plnkr.co/e8Crbf/)
