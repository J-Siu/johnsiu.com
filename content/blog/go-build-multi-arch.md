---
author: "John Siu"
date: 2025-09-07T15:31:30-04:00
description: ""
draft: true
tags: ["Golang"]
title: "GoLang Build Multi Arch"
type: "blog"
---
Build Golang application for multiple architecture.
<!--more-->

## Go Install

Pro:

Con:

## Shell Script

```sh
# Ref: https://stackoverflow.com/a/78404410/1810391

# detect go.mod and go.sum
if [ ! -f go.mod ] || [ ! -f go.sum ]; then
  echo "$PWD is not a Go project."
  echo "$(basename "$0") must be run at root of a Go project"
  exit 1
fi

APP=$(basename "$PWD")
DIR_BUILD=build

# Define the list of target platforms
# To list all Go platform: "go tool dist list"
PLATFORMS="
darwin/amd64
darwin/arm64
linux/amd64
windows/amd64
"

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

Pro:

Con:

## GitHub Actions

Pro:

Con:
