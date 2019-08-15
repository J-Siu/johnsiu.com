---
type: "blog"
date: 2016-10-11T02:26:54Z
tags: ["javascript", "typescript", "angular"]
title: "Angular Simple API Client Service"
aliases:
    - /simple-api-client-for-angular
    - /index.php/simple-api-client-for-angular
    - /index.php/2016/10/11/simple-api-client-for-angular
---

[simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2) is an Angular api service, which work with [simple-api-express](https://github.com/J-Siu/simple-api-express), an expressjs api handler.
<!--more-->

## Install

```sh
npm install simple-api-client-ng2
```

## Usage Flow

### Import into Angular application (typescript)

`simple-api-client-ng2` is implemented as Angular injectable service name **SimpleApiClient**.

#### For module using SimpleApiClient

Add `SimpleApiClient` into module providers:

```ts
import { SimpleApiClient } from 'simple-api-client-ng2';

@NgModule({
    providers: [SimpleApiClient]
})
```

#### For each child component using SimpleApiClient

```ts
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

`SimpleApiClient.get(baseUrl: string = '/'): SimpleApiObj` will return a SimpleApiObj configure with `baseUrl`. Previous created SimpleApiObj will be returned if the same baseUrl is used.

```ts
this.apiObject = this.api.get('/demo');
```

#### SimpleApiClient.list

`SimpleApiClient.list(): string[]` will return a string array containing the baseUrl of all SimpleApiObj created.

#### SimpleApiObj.call

`SimpleApiObj.call(method, params, callback, errorHandler)`

- **method: string** Name of api
- **params: any** Argument of api, can be basic type like string, number, or object
- **callback: (result: any) => void** Callback function for handling api result
- **errorHandler: (error: any) => void = this.errorHandler** Optional error handler to handle api call error

#### SimpleApiObj.setErrorHandler

`SimpleApiObj.setErrorHandler(handler: (any) => void)` replace SimpleApiObj default error handler with the specified one.

### Error Handling

For detail example on error handling, please refer to [error.component.ts](https://github.com/J-Siu/simple-api-example-ng2-express/blob/master/public/app/error.component.ts) contain in full example below.

## Example

A detail example for both [simple-api-express](https://github.com/J-Siu/simple-api-express) and [simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2).

- [simple-api-example-ng2-express](https://github.com/J-Siu/simple-api-example-ng2-express)
