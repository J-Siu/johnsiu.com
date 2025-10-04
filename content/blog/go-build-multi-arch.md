---
author: "John Siu"
date: 2025-09-07T15:31:30-04:00
description: "Build Golang application for multiple architectures."
draft: false
tags: ["Golang"]
title: "GoLang Build Multi Arch"
type: "blog"
---
Build Golang application for multiple architectures.
<!--more-->

## Shell Script

Run following script at root of a Golang project. Binaries will be put into `build/<PLATFORM>`.

```sh
# Define the list of target platforms
# To list all Go platform: "go tool dist list"
PLATFORMS="
darwin/amd64
darwin/arm64
linux/amd64
windows/amd64
"

# Check go.mod and go.sum
if [ ! -f go.mod ] || [ ! -f go.sum ]; then
  echo "$PWD is not a Go project."
  echo "$(basename "$0") must be run at root of a Go project"
  exit 1
fi

APP=$(basename "$PWD")
DIR_BUILD=build

# Create the dist directory if it doesn't exist
for PLATFORM in $PLATFORMS; do
  # Extract the GOOS and GOARCH values from the platform string
  export GOOS=$(echo "$PLATFORM" | cut -d/ -f1)
  export GOARCH=$(echo "$PLATFORM" | cut -d/ -f2)

  DIR_PLATFORM=$DIR_BUILD/$GOOS/$GOARCH
  mkdir -p "$DIR_PLATFORM"

  # Determine the binary extension based on the target OS
  BIN_EXT=""
  if [ "$GOOS" = "windows" ]; then
    BIN_EXT=".exe"
  fi

  # Build the executable
  echo "Building $APP for $GOOS/$GOARCH..."
  go build -o "$DIR_PLATFORM/$APP$BIN_EXT"
done
```

Modify `PLATFORMS` to add or remove platforms for building. Get platform list by `go tool dist list`.

Script is posix compatible.

## Reference

This script is inspired by this Stack Overflow answer: https://stackoverflow.com/a/78404410/1810391
