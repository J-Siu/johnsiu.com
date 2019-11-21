---
type: "blog"
date: 2019-11-21T16:19:53-05:00
author: "John Siu"
title: "JQ - Json Parser"
description: "jq cheatsheet"
tags: ["jq","cheatsheet"]
draft: false
---
Cheatsheet for simple usage.
<!--more-->

simple.json

```json
{
  "id":"01234567",
  "active":true,
  "name":{
    "first":"John",
    "last":"Siu"
  },
  "address": [
    "address line 1",
    "address line 2",
    "address line 3"
  ]
}
```

Command|Usage
---|---
`jq '.' simple.json`|Print pretty
`jq '.id' simple.json`|Print value of `id`
`jq -r '.id' simple.json`|Print value of `id`, without quote
`jq '.id, .active' simple.json`|Print value of `id` and `active`
`jq '.name.last' simple.json`|Print value of `last` in `name`
`jq '.address[0]' simple.json`|Print first item of array `address`
