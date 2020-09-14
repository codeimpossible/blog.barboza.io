---
layout: post
title: "Electric Noir .plan #2-3"
excerpt: ""
date: 2018-06-18 16:00:57
updatedDate: 2018-06-18 16:00:57
path: electric-noir-plan-2-3
path_prefix: /post/
tags:
  - post
  - Meta
  - unity3d

---

_Electric Noir is a game that I am building in my spare time. It’s a classic turn-based RPG set in a post-apocalyptic, cyberpunk future with a focus on noir-style story telling. Think fallout meets blade runner._

_This set of posts is going to be a raw dump from my <a href="https://www.scribd.com/doc/14192/John-Carmack-Archive-plan-1998">plan file</a> for the game. I’m not going to edit these much, and they are going to mostly be for me to share some updates about the games progress to more than just myself, and also hopefully track how much stuff I actually get done (because some days it can feel like I haven’t done anything)._

*Originally written on 5/20/18:* Alright, spent the afternoon and some of the night working on the game.
### Stuff I Did


- Merged the UIState with the GameState object. There will be only one state object from now on, which should make future work a lot easier.
- Refactored the event manager so that events are codified as an Enum, instead of just passing strings around. Makes it easier to have event-bound behaviours and i dont have to store strings in memory.
- updated the UI for the equipped items so that it's fixed, and not a normal inventory list

Since this is a small entry, I'll post another entry as well.

*Originally written on 5/21/18:*

### Stuff I Did


- Started work on codifying the new equipped items window
- uhhh, i finished the equipped items window - for the most part
- there's a weird bug where items are getting duplicated into the inventory after they get removed from the equipped items
- i started working on the equipped weapons toggle window, changing weapons works

### Next Up


- combat action chooser

