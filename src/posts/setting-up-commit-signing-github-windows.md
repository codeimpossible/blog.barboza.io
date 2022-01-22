---
layout: post
title: "Setting up commit signing on Windows 10/11"
date: 2021-12-21 00:00:00
tags:
  - post
  - programming
  - git
  - gpg
---

## Install prerequisites

1. Install [GitHub Desktop](https://desktop.github.com/)
2. Install [Git for Windows](https://git-scm.com/download/win)
3. Install [GPG for Windows](https://gpg4win.org/get-gpg4win.html)

## Setup your gpg key

Follow the steps in [GitHubs GPG creation guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key) and make note of your GPG key ID, you'll need that later on.

## Tell git about your new key

```
$ git config --global user.signingkey <Your GPG key ID>
$ git config --global commit.gpgsign true
$ where.exe gpg
$ git config --global gpg.program "<Path from above command>"
```

💥you are now setup to use commit signing in both `git` and GitHub Desktop.
