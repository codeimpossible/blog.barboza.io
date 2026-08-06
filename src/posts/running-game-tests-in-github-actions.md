---
layout: post
title: 'Running Game Tests in GitHub Actions'
tags:
  - post
  - programming
  - unity3d
  - github-actions
  - slack
---

This week my time has been spent getting my tests running. they've been failing to run in GitHub for a while but i've been too focused on other stuff to dive in - plus they ran fine locally so it wasn't much of a issue, but this week i decided to get them running again because i had broken a few of them during some other work and didn't find out until I ran them manually.

So I setup my old alienware machine as a self-hosted GitHub Action runner and was able to migrate my unit test action over. Since the machine runs Windows i wasn't able to keep using the actions from [Game-CI](https://game.ci) but i don't think that will be too big of an issue. I also updated the action to use some of the newer features in GHA.

Here's a screenshot of the job summary page after the update. I upload the Unity Editor log files, my own games log files and the test results as artifacts so I can check them later on if there's a failure.

<img src="/tests-in-github-actions/image1.png" />

The parts i'm really excited about is the new job summary feature which lets you upload markdown and display it on the job summary view. I wrote a nodejs script to convert the test result XML file into a nicer markdown table and that gets shown in the job summary now.

<img src="/tests-in-github-actions/image2.png" />

And finally the results get posted to a slack channel so I get notified when tests fail and I can click a button and get taken directly to the job page.

<img src="/tests-in-github-actions/image3.png" />
