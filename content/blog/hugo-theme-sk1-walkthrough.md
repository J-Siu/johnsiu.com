---
author: "John Siu"
date: 2020-08-10T17:00:00-04:00
description: "Hugo Theme SK1 Walk Through"
tags: ["hugo","theme","how-to","lib"]
title: "Hugo Theme SK1 Walk Through"
type: "blog"
---
A starting guide for creating Hugo theme.
<!--more-->
> This guide assume some familiarity on creating a Hugo site using other Hugo themes.

### Base Directory

In an empty directory:

```sh
hugo new theme newtheme
```

This will create a new theme directory `themes/newtheme`:

```sh
.
├── resources
│   └── _gen
│       ├── assets
│       └── images
└── themes
    └── mytheme
        ├── LICENSE
        ├── archetypes/
        │   └── default.md
        ├── layouts/
        │   ├── 404.html
        │   ├── _default
        │   │   ├── baseof.html
        │   │   ├── list.html
        │   │   └── single.html
        │   ├── index.html
        │   └── partials/
        │       ├── footer.html
        │       ├── head.html
        │       └── header.html
        ├── static/
        │   ├── css/
        │   └── js/
        └── theme.toml
```

Only `mytheme` directory is needed. `resources` directory can be deleted.

#### MyGit

> Shameless self promotion! 🤣

If you have [mygit](/blog/mygit/) setup, use following to create repository on github/gogs/gitea:

```sh
cd themes/mytheme
mygit init
mygit repo new
mygit repo description "Hugo Theme - MyTheme"
git add .
git commit -a -m "Initial commit."
mygit push --master
```

Else do following for local git:

```sh
cd themes/mytheme
git init
git add .
git commit -a -m "Initial commit."
```

#### Sample Content

Once git is initialized, pull in Hugo example site content as sub-module:

```sh
# Inside mytheme/
git submodule add https://github.com/gohugoio/hugoBasicExample.git exampleSite
```

Test:

```sh
# Inside mytheme/
cd exampleSite
hugo server --theme mytheme --themesDir ../../
```

On screen:

```sh
                   | EN
-------------------+-----
  Pages            | 19
  Paginator pages  |  0
  Non-page files   |  0
  Static files     |  1
  Processed images |  0
  Aliases          |  9
  Sitemaps         |  1
  Cleaned          |  0

Built in 12 ms
Watching for changes in /Users/js/tmp/themes/mytheme/{archetypes,exampleSite,layouts,static}
Watching for config changes in /Users/js/tmp/themes/mytheme/exampleSite/config.toml
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

Open browser to `http://localhost:1313`, it should show an empty page. That is correct result for now. Keep it running and you will see changes made to theme in real time.

### _default

`mytheme/layouts/_default/` contains 3 files: `baseof`, `list` and `single`. Lets go through them one by one.

#### baseof.html

`_default/baseof.html`

```Handlebars
<!DOCTYPE html>
<html>
{{- partial "head.html" . -}}

<body>
	{{- partial "header.html" . -}}
	<div id="content">
		{{- block "main" . }}{{- end }}
	</div>
	{{- partial "footer.html" . -}}
</body>

</html>
```

`_default/baseof.html`[^1] is the base, outer most wrapper of ALL pages generated. No change required for this project.

It include 3 partials: `head.html`, `header.html` and `footer.html`, which will be looked at in [partials](#partials) section below.

#### list.html

`_default/list.html`[^2] is template for all listing pages. The reason `http://localhost:1313` is blank is because out `list.html` is empty.

Base on Hugo documentation, following is a simple `list.html`:

```handlebars
{{define "main"}}

<!--$paginator-->
{{if .IsHome}}
{{.Scratch.Set "Paginator" (.Paginate (where .Site.RegularPages "Type" "in" site.Params.mainSections))}}
{{else}}
{{.Scratch.Set "Paginator" .Paginator}}
{{end}}
{{$paginator:=(.Scratch.Get "Paginator")}}

<!--list-->
<ul>
	{{range $paginator.Pages}}
	<li>{{.Date.Format "2006-01-02"}} | <a href="{{.RelPermalink}}">{{.Title}}</a></li>
	{{end}}
</ul>

<!--pagination-->
{{template "_internal/pagination.html" .}}

{{end}}
```

Save and refresh browser. However browser will remain blank at this point. That is because `layouts/index.html` is empty.

`index.html` is used as home page when available, else `list.html` is used.

For simplicity of this project, just delete `index.html` and refresh browser.

More information about pagination[^3] is in Hugo doc.

#### single.html

`_default/single.html`[^4] is template for all content pages. The generated file is empty. Clicking on any page link in listing page will show page not found, as no content page is generated.

Supply `single.html` with following content and save.

```handlebars
{{define "main"}}

<!--Title-->
<h2>{{.Title}}</h2>

<!--Date-->
{{.Date.Format "2006-01-30"}}

<!--TOC-->
{{.TableOfContents}}

<!--Content-->
{{.Content}}

<!--Tag-->
<ul>
	{{range (.GetTerms "tags")}}
	<li><a href="{{.RelPermalink}}">{{.LinkTitle}}</a></li>
	{{end}}
</ul>

<!--Prev/Next-->
{{with .PrevInSection}}Prev <a href="{{.RelPermalink}}">{{.Title}}</a>{{end}}
{{with .NextInSection}}Next <a href="{{.RelPermalink}}">{{.Title}}</a>{{end}}

<!--Related-->
{{$related := .Site.RegularPages.Related . | first 5}}
{{with $related}}
<h3>See Also</h3>
<ul>
	{{range .}}
	<li><a href="{{.RelPermalink}}">{{.Title}}</a></li>
	{{end}}
</ul>
{{end}}

{{end}}
```

Content link should be working now.

### partials

`partials` are common section included by other default templates or other partials.

#### head.html

`partials/head.html`, as seen in `_default/baseof.html`, is used outside of `<body>` section.

`head.html` should contain `<head>` section of html page, which usually consist of meta tag, javascript, etc.

As this project focus on making a simple Hugo template, the file is left empty.

#### header.html

`partials/header.html`[^5], contrary to `head.html`, contain display element. It is part of html `<body>` and usually consist of page title, menu, etc.

Following is header of SK1:

```handlebars
<!--Site Title-->
<a href="{{ "" | relLangURL}}">{{site.Title}}</a>
<!--Sub-title-->
{{with site.Params.subtitle}} / {{.}}{{end}}
```

#### footer.html

`partials/footer.html`[^6], similar to `header.html`, contain display element, but for the bottom of all pages. It is part of html `<body>` and usually consist of copyright, menu, etc.

Following is footer of SK1:

```handlebars
{{with .Site.Copyright}}{{.}} / {{end}}
Power by <a href="https://gohugo.io">Hugo</a> /
Theme <a href="https://github.com/J-Siu/hugo-theme-sk1/">SK1</a> by <a href="https://github.com/J-Siu/">J-Siu</a>
```

### Additional Reference

The above give a basic idea of how a Hugo theme is put together. Following are more starting points for Hugo theme development:

- [Hugo Templates](//gohugo.io/templates/)
- [Hugo Variables](//gohugo.io/variables/)
- [Hugo Documentation](//gohugo.io/documentation/)

The search box in Hugo site is your friend!!

### SK Themes

- [hugo-theme-sk1](//github.com/J-Siu/hugo-theme-sk1) Fully functional basic Hugo theme with no css, no javascript. Full example of this walk-through.
- [hugo-theme-sk2](//github.com/J-Siu/hugo-theme-sk2) Fully functional basic Hugo theme with minimum css.
- [hugo-theme-sk3](/blog/hugo-theme-sk3/) Full feature Hugo theme with Google AdSense support.

[^1]: [Define the Base Template](//gohugo.io/templates/base/#define-the-base-template)
[^2]: [Hugo List Defaults](//gohugo.io/templates/lists#list-defaults)
[^3]: [Hugo Pagination](//gohugo.io/templates/pagination)
[^4]: [Hugo Single Page Templates](//gohugo.io/templates/single-page-templates/#postssinglehtml)
[^5]: [Hugo Partials - Header](//gohugo.io/templates/partials/#example-headerhtml)
[^6]: [Hugo Partials - Footer](//gohugo.io/templates/partials/#example-footerhtml)