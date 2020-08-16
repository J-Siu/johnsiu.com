---
type: blog
date: 2019-09-06T11:36:46-04:00
author: "John Siu"
title: "Angular Cheat Sheet"
description: "My Angular cli cheat sheet."
tags: ["angular","cli","cheatsheet"]
---
Some Angular CLI usage.
<!--more-->

### No Default Application

Mainly for library project.

```sh
ng new myLib --create-application=false
```

### Generate Library With Project Name

```sh
ng generate library myLib-lib --prefix=myLib
```

### Generate Application

```sh
ng generate application myLibTest
```
