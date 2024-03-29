---
author: "John Siu"
date: 2019-07-30T22:01:22-04:00
description: "Hugo command and config cheat sheet."
tags: ["gohugo","hugo","cheatsheet","command-line"]
title: "Hugo Commands and Config"
type: blog
aliases:
    - /blog/hugo-cmd
---
Some Hugo commands and config.
<!--more-->
### New site

```sh
hugo new site <site name>  # Create Hugo site folder <site name>.
```

### New post

```sh
hugo new post/test.md
hugo new <archetypes>/<post name>.md
```

### Add section

A new section requires:

- An archetype file.
- A `_index.md` inside section folder.
- A `[menu]` entry in `config.toml`.

Following example creates a section call `section9`[^1].

#### Archetype

Copy `archetypes/default.md` to `archetypes/section9.md` and modify `type`:

```toml
---
author: "John Siu"
date: {{ .Date }}
description: ""
draft: true
tags: [""]
title: "{{ replace .Name "-" " " | title }}"
type: "section9"
---
<!--more-->
```

Value of `type` will be section directory name. See below.

#### Title

Create a `test.md` under *section9*

```sh
hugo new section9/test.md
```

That will create directory `section9` under `content` with `test.md` inside. Create `_index.md` to set the title:

`content/section9/_index.md`:

```toml
---
Title: "Section 9 / 公安9課"
---
```

#### Menu

Add a menu entry else the new section will not be shown:

`config.toml`:

```toml
[menu]
[[menu.main]]
name="公安9課" # Menu item.
url="/section9" # Match the directory name under `content`.
```

### Syntax Highlight

Enable syntax highlight in `config.toml`:

```toml
pygmentsCodefences=true # Enable syntax highlight.
pygmentsStyle="Chroma"  # Define highlight style.
```

### Rsync

Ssh rsync `public` folder to remote server:

```sh
rsync -az --delete public <user@hostname>:<dir containing public>
```

---

[^1]: [Wikipedia - Section 9](//en.wikipedia.org/wiki/Public_Security_Section_9)
