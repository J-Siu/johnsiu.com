---
type: "blog"
date: 2019-09-01T20:35:58-04:00
author: "John Siu"
title: "Tiny CI/CD - Build Your Own - Part 1 - Introduction"
description: "CI/CD series covering setup of kubernetes, docker, private (docker)registry, jenkins, git repository."
tags: ["tiny","cicd","kubernetes","docker","registry","jenkins","git"]
draft: true
---
The new tiny series covering setup of docker, kubernetes, private docker registry, jenkins, git repository.
<!--more-->

---

### Series Content

- [Part 1 - Introduction](/blog/tiny-ci-cd-p1-intro/)  <- You are here.
- [Part 2 - Docker](/blog/tiny-ci-cd-p2-docker/)
- [Part 3 - Kubernetes](/blog/tiny-ci-cd-p3-k8s/)
- [Part 4 - Docker Registry](/blog/tiny-ci-cd-p4-k8s-registry/)
- [Part 5 - Gogs (Git Server)](/blog/tiny-ci-cd-p5-k8s-gogs/)
- [Part 6 - Jenkins](/blog/tiny-ci-cd-p6-k8s-jenkins/)
- [Part 7 - Usage](/blog/tiny-ci-cd-p7-usage/)
- [Part 8 - Conclusion](/blog/tiny-ci-cd-p8-conclusion/)

### Why?

- CI: Continuous Integration[^1]
- CD: Continuous Delivery[^2] / Continuous Deployment[^3]

If you are in computer, IT or software related industry, you properly heard about them. Or even using them daily at work.

You are using some of those tools already, but not in a CI/CD environment.

You understand some of the concepts, but don't know all the parts.

You know it is the trend, but don't know how to start.

### What You Get?

Step by step walk through of how to put together a CI/CD setup.

Simple example will be given in each component section.

### What You Need?

#### Hardware

- System running Ubuntu 18.04. It can be a VM.

#### Sills

- Comfortable with Linux command line
- Familia with Kubernetes command line and concept will be a plus
- Familia with Docker Compose will be a plus

---

Next: [Part 2 - Docker](/blog/tiny-ci-cd-p2-docker/)

[^1]: https://en.wikipedia.org/wiki/Continuous_integration
[^2]: https://en.wikipedia.org/wiki/Continuous_delivery
[^3]: https://en.wikipedia.org/wiki/Continuous_deployment
