---
author: "John Siu"
date: 2020-04-05T22:06:31-04:00
description: "Angular 8 to 9 upgrade for packages."
tags: ["angular","lib"]
title: "Angular 8 to 9 Package Upgrade"
type: "blog"
---
In season of covid-19, maybe it is time for some upgrade.
<!--more-->

### Packages

I have 4 libraries need upgrading:

- [ng2-simple-api-lib](//github.com/J-Siu/ng2-simple-api-lib.git)
- [ng2-simple-global-lib](//github.com/J-Siu/ng2-simple-global-lib.git)
- [ng2-simple-mq-lib](//github.com/J-Siu/ng2-simple-mq-lib.git)
- [ng2-simple-timer-lib](//github.com/J-Siu/ng2-simple-timer-lib.git)

### Manual Task

After following [Angular Upgrade Guide](//update.angular.io/#8.0:9.0l3), there are 4 files need update manually:

- `LICENSE` : Update year to 2020
- `README.md` : Update change log and license year to 2020
- `package.json` : Update version to 9.1.0
- `projects/<library>/package.json` : Maybe I did something wrong, other than the version, I also have to manually update `"@angular/common": "~9.1.0"`, `"@angular/core": "~9.1.0"`, and `"rxjs": "~6.5.5"`

### Script

Once I get the above figure out, I created a simple script to take care of the rest:

```sh
#!/bin/bash

NG_VER="9.1.0"

# Assume README.md, LICENSE, package.json, projects/<library>/package.json already updated
git commit -a -m $NG_VER

ng update @angular/core@8 @angular/cli@8
git commit -a -m $NG_VER
ng update @angular/core @angular/cli
git add .
git commit -a -m $NG_VER

ng build $1 --prod
cp README.md LICENSE dist/$1/
cd dist/$1
npm publish

cd ../..
git tag -a $NG_VER -m $NG_VER
git push
git push --tags
```

### Conclusion

Except the first one took 30min to figure out everything needed. The remaining 3 took less then 5 minutes each. The migration to angular-cli during version 8 last year really pay off nicely.