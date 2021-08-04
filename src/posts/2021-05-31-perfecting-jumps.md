---
layout: post
title: "Perfecting Jumps"
date: 2021-05-31 00:00:00
updatedDate: 2021-05-31 00:00:00
tags:
  - post
  - electric-noir
  - unity3d
  - game-development
---

I changed my player characters jump a bit this weekend. I was testing out the air dash and wall jumping; things were... "fine" but not great. It felt like it was difficult to make the player do what I wanted.

I had a section of the level that required the player to drop off a ledge, fall a bit (to clear a hanging section of the level) and then dash upwards at an angle to reach the next section. I was able to do this, but not consistently and each time I did it it felt more like luck than skill. I decided to change how gravity is applied to the player a bit.

Instead of immediately applying 100% of gravity to the player when they are falling, it ramps up by some factor, so it takes a few frames for them to reach max gravity.

This makes their jumps feel a little more like flying and gives a reaction window to make difficult dashes more easily.
