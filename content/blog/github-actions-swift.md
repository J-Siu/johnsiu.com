---
author: "John Siu"
date: 2020-10-15T19:15:21-04:00
description: "Github actions for swift program."
tags: ["github","actions","swift","how-to"]
title: "Github Actions For Swift"
type: "blog"
---
Using standard Github actions only.
<!--more-->

### Setup

Create following in swift repo to use Github Action:

```sh
mkdir .github/workflows
touch .github/workflows/swift.yml
```

Following is the dir structure:

```sh
.github
└── workflows
    └── swift.yml
```

`swift.yml` is the workflow/actions configuration.

### Swift.yml

The `swift.yml` contain 3 main parts: `name`, `on` and `jobs`.

#### Name

`name` is the name of this workflow:

```yml
name: Swift

```

#### On

`on` is the trigger condition of this workflow. In this case, the workflow will be triggered whenever a new tag is pushed to Github.

```yml
on:
  push:
    tags:
      - "*"
```

#### Jobs

`jobs` consists of one `build`, which in turn contain `runs-on` and the `steps` section.

```yml
jobs:
  build:
    runs-on: macos-latest
```

Since we are building for MacOS, `macos-latest` is used here.

#### Steps

`steps` contain multiple steps, each with their own name.

##### Checkout

`Checkout` is standard across all workflow. This tell github compiling environment to checkout the repository.

```yml
      - name: Checkout
        uses: actions/checkout@v2
```
##### Build

`Build` is the command line use to build the binary.

```yml
      - name: Build
        run: swift build -v -c release
```

##### Zip

`Zip` step create the zip file and also output information for later steps.

```yml
      - name: Zip
        id: zip
        run: |
          PRG=itpl
          TAG=${GITHUB_REF/refs\/tags\//}
          ZIP_NAME=${PRG}-${TAG}.zip
          ZIP_PATH=./${ZIP_NAME}
          echo ${TAG}
          echo ${ZIP_NAME}
          echo ${ZIP_PATH}
          zip -j ${ZIP_NAME} .build/release/${PRG}
          echo "::set-output name=name::${ZIP_NAME}"
          echo "::set-output name=path::${ZIP_PATH}"
```

Line|Description
---|---
4|`PRG` contains name of the output binary
12,13|These are output/parameters to be used by later steps

##### Release - Create

`Release - Create` will create a release entry for the repository. This is pretty standard and no modification needed in most cases.

```yml
      - name: Release - Create
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

##### Release - Upload

`Release - Upload Asset` will upload the zip file into the release entry. Again, this is pretty standard and mo modification needed in most cases.

```yml
      - name: Release - Upload Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ${{ steps.zip.outputs.path }}
          asset_name: ${{ steps.zip.outputs.name }}
          asset_content_type: application/zip
```

Line|Description
---|---
8,9|Assign parameter with output from the `zip` step.

### Complete Listing

Following is the complete listing:

```yml
name: Swift

on:
  push:
    tags:
      - "*"

jobs:
  build:
    runs-on: macos-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Build
        run: swift build -v -c release

      - name: Zip
        id: zip
        run: |
          PRG=itpl
          TAG=${GITHUB_REF/refs\/tags\//}
          ZIP_NAME=${PRG}-${TAG}.zip
          ZIP_PATH=./${ZIP_NAME}
          echo ${TAG}
          echo ${ZIP_NAME}
          echo ${ZIP_PATH}
          zip -j ${ZIP_NAME} .build/release/${PRG}
          echo "::set-output name=name::${ZIP_NAME}"
          echo "::set-output name=path::${ZIP_PATH}"

      - name: Release - Create
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Release - Upload Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ${{ steps.zip.outputs.path }}
          asset_name: ${{ steps.zip.outputs.name }}
          asset_content_type: application/zip
```

[itpl](/blog/itpl) is my iTunes playlist command line utility.