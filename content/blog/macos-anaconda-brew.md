---
author: "John Siu"
date: 2023-07-05T03:32:11-04:00
description: "MacOS Anaconda with Homebrew"
tags: ["macos","anaconda","homebrew"]
title: "MacOS, Anaconda, and Homebrew"
type: "blog"
---
How to make Anaconda and Homebrew play nicely together.
<!--more-->

Anaconda is a popular python development environment across platforms. However, on MacOS, though Homebrew by default install python as `python3`, it may still create issue sometimes. This blog present a simple way to minimize potential conflict between the two.

### Install Anaconda

Anaconda can be installed by downloading the package directly from official site, or via Homebrew. They do result with a different installation path.

#### Official Download

Download link is on Anaconda homepage: https://www.anaconda.com/

Anaconda directory: `~/anaconda3/`

#### Homebrew

To use homebrew

```sh
brew install anaconda
```

Anaconda directory: `/opt/homebrew/anaconda3/`

### conda init

After installing Anaconda, you need to run following once, depends on how it is installed.

Direct install:
```sh
~/anaconda3/bin/conda init zsh
```

Via Homebrew:
```sh
/opt/homebrew/anaconda3/bin/conda init zsh
```

The command will add following to the end of `~/.zshrc`:

```sh
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/homebrew/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/homebrew/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/opt/homebrew/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/opt/homebrew/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

> The above is created by a homebrew installation. Direct install will see `/opt/homebrew/` changed to your home directory.

### Activate Anaconda On Demand

To minimize conflict with Homebrew, we can wrap the conda initialization code in a zsh function `condaOn()` like following:

```sh
condaOn() {
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/homebrew/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/homebrew/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/opt/homebrew/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/opt/homebrew/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
}
```

Pay attention not to add any indent to the conda initialization code. Just add `condaOn() {` before it, and `}` after it like above.

When you need to use Anaconda, just type `condaOn`:

```sh
$ condaOn
(base) $
```

Then start using `conda` commands.