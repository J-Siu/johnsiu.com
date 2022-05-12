---
author: "John Siu"
date: 2022-05-11T23:48:46-04:00
description: "YJ - Yaml, Toml, Json Conversion Tool"
tags: ["yj","cheatsheet","command-line","json","yaml","toml"]
title: "YJ - Yaml, Toml, Json Conversion Tool"
type: "blog"
---
This is more like a reminder for myself that this tool exist :face_palm:
<!--more-->

As all the options are conversions:

```sh
$ yj -h
Usage: yj [-][ytjcrneikhv]

Convert between YAML, TOML, JSON, and HCL.
Preserves map order.

-x[x]  Convert using stdin. Valid options:
          -yj, -y = YAML to JSON (default)
          -yy     = YAML to YAML
          -yt     = YAML to TOML
          -yc     = YAML to HCL
          -tj, -t = TOML to JSON
          -ty     = TOML to YAML
          -tt     = TOML to TOML
          -tc     = TOML to HCL
          -jj     = JSON to JSON
          -jy, -r = JSON to YAML
          -jt     = JSON to TOML
          -jc     = JSON to HCL
          -cy     = HCL to YAML
          -ct     = HCL to TOML
          -cj, -c = HCL to JSON
          -cc     = HCL to HCL
-n     Do not covert inf, -inf, and NaN to/from strings (YAML or TOML only)
-e     Escape HTML (JSON out only)
-i     Indent output (JSON or TOML out only)
-k     Attempt to parse keys as objects or numeric types (YAML out only)
-h     Show this help message
-v     Show version
```

Example:
```sh
yj -yji < test.yaml > test.json
```