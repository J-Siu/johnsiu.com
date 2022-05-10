---
author: "John Siu"
date: 2021-04-15T19:15:15-04:00
description: "Github Actions for Golang"
tags: ["github","actions","golang","how-to"]
title: "Github Actions for Golang"
type: "blog"
---
A simple Github actions with GoReleaser.
<!--more-->

### Setup

Create following in swift repo to use Github Action:

```sh
mkdir .github/workflows
touch .github/workflows/go.yml
```

Following is the dir structure:

```sh
.github
└── workflows
    └── go.yml
```

`go.yml` is the workflow/actions configuration.

### go.yml

The `go.yml` contain 3 main parts: `name`, `on` and `jobs`.

#### Name

`name` is the name of this workflow:

```yml
name: Go
```

#### On

`on` is the trigger condition of this workflow. In this case, the workflow will be triggered whenever a new tag is pushed to Github.

```yml
on:
  push:
    tags:
      - "v*"
  workflow_dispatch:
```

#### Jobs

`jobs` consists of different job section. Only one job section, `release`, in this case, which in turn contains `strategy`, `runs-on`, then the `steps` section.

```yml
jobs:
  release:
    name: Release
    strategy:
      matrix:
        os: [ubuntu-latest]
        go: ["1.18"]
    runs-on: ${{ matrix.os }}
```

`strategy` and `runs-on` here allow for multiple platform building.

#### Steps

`steps` contain multiple step sections, each with their own name.

##### Install Go

`Install Go` will install go version specified in `matrix` above for building the repository.

```yml
      - name: Install Go
        uses: actions/setup-go@v2
        with:
          go-version: ${{ matrix.go }}
```

##### Checkout

`Checkout` is standard across all workflow. This tell github compiling environment to checkout the repository.

```yml
      - name: Checkout
        uses: actions/checkout@v2
```

##### Unshallow

Unshallow the repo so GoReleaser can generate the changelog properly.

```yml
      - name: Unshallow
        run: git fetch --prune --unshallow
```

##### Vars

Prepare variables `version_tag` and `go_cache` for steps follow.

```yml
      - name: Vars
        id: vars
        run: |
          echo "::set-output name=version_tag::${GITHUB_REF/refs\/tags\//}"
          echo "::set-output name=go_cache::$(go env GOCACHE)"
```

##### GoReleaser

GoReleaser[^1] take care of publishing artifacts into the release.

```yml
      - name: Run GoReleaser
        uses: goreleaser/goreleaser-action@v2
        with:
          distribution: goreleaser
          version: latest
          args: release --rm-dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG: ${{ steps.vars.outputs.version_tag }}
```

### Complete Listing

Following is the complete listing:

`go.yml`
```yml
name: go

on:
  push:
    tags:
      - "*"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  release:
    name: Release
    strategy:
      matrix:
        os: [ubuntu-latest]
        go: ["1.18"]
    runs-on: ${{ matrix.os }}

    steps:
      - name: Install Go
        uses: actions/setup-go@v2
        with:
          go-version: ${{ matrix.go }}

      - name: Checkout
        uses: actions/checkout@v2

      - name: Unshallow
        run: git fetch --prune --unshallow

      - name: Vars
        id: vars
        run: |
          echo "::set-output name=version_tag::${GITHUB_REF/refs\/tags\//}"
          echo "::set-output name=go_cache::$(go env GOCACHE)"

      - name: Run GoReleaser
        uses: goreleaser/goreleaser-action@v2
        with:
          distribution: goreleaser
          version: latest
          args: release --rm-dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG: ${{ steps.vars.outputs.version_tag }}
```

[go-png2ico](https://github.com/J-Siu/go-png2ico) is Golang command line utility for creating ICO file from PNG files. It used the above workflow on GitHub.

[^1]: [GoReleaser](https://github.com/goreleaser/goreleaser)