---
type: "blog"
date: 2019-09-15T18:33:11-04:00
author: "John Siu"
title: "Screen Command"
description: "Screen command cheat sheet"
tags: ["screen","cheatsheet","command-line"]
aliases:
    - /blog/screen-cmd
---
Cheat sheet.
<!--more-->

---

### Start and Exit

Command|Usage
---|---
screen|Start a screen session with a window with a shell. Start a new window if already in a screen session.
exit|Exiting the shell will exit the current window. Screen session will also end if it is the last window.
screen \<program\>|Start a program within a screen window. Exiting the program will also terminate the window.

---

### Hot Key

Screen default hot-key is <kbd>ctrl</kbd>+<kbd>a</kbd>, then follow by a command key. Following are some frequently used command keys:

> Press <kbd>ctrl</kbd>+<kbd>a</kbd>, then press one of the following keys.

Command Key|Usage
---|---
<kbd>?</kbd>|Display help.
<kbd>c</kbd>|Create and enter a new window.
<kbd>"</kbd>|List and choose window.
<kbd>A</kbd>|Change name / title of a window.
<kbd>S</kbd>|Split the terminal.
<kbd>Q</kbd>|Remove all split areas other than the current focused one.
<kbd>X</kbd>|Remove the currently focused split area.
<kbd>ctrl</kbd>+<kbd>I</kbd>|Cycle cursor focus through split area.
<kbd>0</kbd> <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> <kbd>5</kbd> <kbd>6</kbd> <kbd>7</kbd> <kbd>8</kbd> <kbd>9</kbd>|Quick switch between window 0-9.
<kbd>k</kbd>|Kill current window.
<kbd>d</kbd>|Detect the screen session.
<kbd>ctrl</kbd>+<kbd>\\</kbd>|Kill all windows and exit screen.

---

### Command Line Options

Some frequently use command line options:

```sh
screen <option>
```

Options|Usage
---|---
-ls|List socket name and status.
-D|If inside a screen session, will detach the session and terminate the terminal process with it.
-r \<socket\>|Re-attach to a detached screen session.
-x \<socket\>|Join a screen session.
-S|Set socket name other than \<pid\>.\<tty\>.\<host\>.