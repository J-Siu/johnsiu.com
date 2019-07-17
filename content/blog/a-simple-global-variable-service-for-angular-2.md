---
type: "blog"
date: 2016-10-11T02:14:51Z
tags: ["javascript", "typescript", "angular"]
title: "Angular2 Simple Global Variable Service"
---
<!--more-->

`ng2-simple-global` a simple global variable service for Angular 2.

## Index

- [Install](#install)
- [Usage](#usage)
- [API](#API)
- [Repository](#Repository)
- [Example](#example)

## Install

```js
npm install ng2-simple-global
```

## Usage

### Import into Angular 2 application (typescript)

`ng2-simple-global` is implemented as Angular 2 injectable service name **SimpleGlobal**.

**For module using SimpleGlobal**

Add `SimpleGlobal` into module providers.

```ts
import { SimpleGlobal } from 'ng2-simple-global';

@NgModule({
    providers: [SimpleGlobal]
})
```

**For each child component using SimpleGlobal**

```ts
import {SimpleGlobal} from 'ng2-simple-global';

export class ChildComponent {

    constructor(private sg: SimpleGlobal) { }

}
```

### API

```ts
import {SimpleGlobal} from 'ng2-simple-global';

@Component({
    selector: 'child-com',
    template: `
        <p>This is a global variable: {{sg.gv}}</p>
        <input type="text" [(ngModel)]="sg.gv">
    `
})
export class ChildComponent {

    localVar;

    constructor(private sg: SimpleGlobal) {
        if (this.sg['gv']) {
            this.localVar = this.sg['gv'];
        }
    }

}
```

Treat `SimpleGlobal` instance as a global object and create/assign additional attributes freely,  
 and it will be accessible to all component using the service.

## Repository

[ng2-simple-global](https://github.com/J-Siu/ng2-simple-global)

## Example

[ng2-simple-global-example](https://github.com/J-Siu/ng2-simple-global-example)

[plunker](http://plnkr.co/J4GvVp)
