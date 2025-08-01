---
author: "John Siu"
date: 2025-07-31T14:25:14-04:00
description: "PowerShell cheat sheet that I use myself."
tags: ["powershell", "cheatsheet"]
title: "Shell - PowerShell"
type: "blog"
---

PowerShell cheat sheet.

<!--more-->

### Zip Files Individually

Zip all log files (`*.log`) in folder:

```sh
Get-ChildItem -Path . -Filter *.log | ForEach-Object {
	Write-Output $_.FullName
	$zip = $_.BaseName + ".zip"
	Compress-Archive -Path $_.FullName -DestinationPath $zip -Force
	Remove-Item $_.FullName
}
```