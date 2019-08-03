---
type: blog
date: 2016-10-11T04:18:35.000Z
description: 'Angular Simple Time Service'
tags:
    - javascript
    - angular
    - typescript
title: 'Angular Simple Timer Service'
aliases:
    - /angular-simple-timer-service
    - /angular2-simple-timer-service
    - /blog/angular2-simple-timer-service
    - /index.php/angular-simple-timer-service
    - /index.php/angular2-simple-timer-service
---

`ng2-simple-timer` is a simple timer service for Angular, base on RxJS.

<!--more-->

Name/ID(string) base API. RxJS object not exposed.

### Install

```sh
npm install ng2-simple-timer
```

### Usage

#### Import into Angular RC5 application (typescript)

`ng2-simple-timer` is implemented as Angular injectable service name **SimpleTimer**.

**For module using SimpleTimer**

Add `SimpleTimer` into module providers (eg. [app.module.ts](https://github.com/J-Siu/ng2-simple-timer-example/blob/master/app/app.module.ts)).

```ts
import { SimpleTimer } from 'ng2-simple-timer';

@NgModule({
    providers: [SimpleTimer]
})
```

**For each child component using SimpleTimer**

```ts
import {SimpleTimer} from 'ng2-simple-timer';

export class ChildComponent {

    constructor(private st: SimpleTimer) { }

}
```

### API

##### newTimer

`newTimer(name: string, sec: number): boolean`

`newTimer` will create timer `name` and tick every ‘number’ of seconds. Creating timer with the same name multiple times has no side effect.

Return `false` if timer `name` exist.

```ts
this.st.newTimer('5sec', 5);
```

##### delTimer

`delTimer(name: string): boolean`

`delTimer` will delete timer `name`

Return `false` if timer `name` does not exist.

```ts
this.st.delTimer('5sec');
```

##### getTimer

`getTimer(): string[]`

`getTimer` will return all timer name in string array.

```ts
let t: string[] = this.st.getTimer();
```

##### getSubscription

`getSubscription(): string[]`

`getSubscription` will return all subscription id in string array.

```ts
let ids: string[] = this.st.getSubscription();
```

##### subscribe

`subscribe(name: string, callback: (any) => void): string`

`subscribe` will link `callback` function to timer `name`. Whenever timer `name` tick, `callback` will be invoked.

Return subscription id(string).

Return empty string if timer `name` does not exist.

Either use Lambda(fat arrow) in typescript to pass in callback or bind `this` to another variable in javascript, else `this` scope will be lost.

**Lambda(fat arrow)**

```ts
counter: number = 0;
timerId: string;

ngOnInit() {
    // lazy mode
    this.timerId = this.st.subscribe('5sec', e => this.callback());
}

callback() {
    this.counter++;
}
```

##### unsubscribe

`unsubscribe(id: string): boolean`

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```ts
timerId: string;

this.st.unsubscribe(this.timerId);
```


### Example

- GitHub: [ng2-simple-timer-example](https://github.com/J-Siu/ng2-simple-timer-example)
- Plunker: [Angular2 Simple Timer Example](http://embed.plnkr.co/HaTd8q/)
