---
layout: post
title: "Electric Noir .plan #1:"
excerpt: ""
date: 2018-06-11 16:24:45
updatedDate: 2018-06-11 16:24:45
path: electric-noir-plan-1
path_prefix: /post/
tags:
  - post
  - electric-noir
  - Meta
  - unity3d

---

_Electric Noir is a game that I am building in my spare time. It's a classic turn-based RPG set in a post-apocalyptic, cyberpunk future with a focus on noir-style story telling. Think fallout meets blade runner._

_This set of posts is going to be a raw dump from my <a href="https://www.scribd.com/doc/14192/John-Carmack-Archive-plan-1998">plan file</a> for the game. I'm not going to edit these much, and they are going to mostly be for me to share some updates about the games progress to more than just myself, and also hopefully track how much stuff I actually get done (because some days it can feel like I haven't done anything)._

*Originally written on 5/18/18:* Time to start writing down the things i've gotten done. I'm not feeling very productive when i think back on the project but I know i've been doing a lot. I'm worried i'm not working smart or i'm not remembering all the things i've done - or how difficult they've been.

So i'm hoping writing stuff down in here - with some regularity - will help me track what I'm working on better and see how much stuff i'm getting done so i feel better as well.

*Goal 1: Able to demo basic gameplay*

- conversations - 95%
- combat - 60%

- inventory - 70%
- healing - 10%
- attacking - 10%


- leveling up - 0%
- quests - 0%

*Goal 2: technical debt*

- merge ui state and gamestate, there should only be one object that has game state on it

## Stuff I Did


- Items can be equipped from the inventory window, but they can't be unequipped yet, and the equipped items window doesn't update automatically
- Started Context Menu work. It's working pretty well, i can now add a behaviour to an object and give it a context menu.
- The inventory screen is almost done. You can drag it around, and scroll the item list. I need to enable interactions with the items within the inventory, add a close button, and bind opening it to "I".
- The weapon refactor has been going well, so far the ScriptableObjects have disappeared each time i restart unity which isn't giving me a lot of confidence. internet peeps said this might be because the classes that I had inheriting from ScriptableObject were abstract, but I changed them to concrete classes and the behavior still occurs. This has cleared out a whole inventory list so far, so I'm hoping that I can find a solution to this soon.

## Health stuff


- stims have been helpful so far, but i've definitely noticed myself being more testy, or aggrivated more easily on days i take them. Also, the crash from them is pretty severe. I think taking a longer acting version at a higher dose 20mg might be the way to go. I like that i don't have to take it every day, we'll see how tomorrow goes without it.
- keto has been successful so far. i need to get on the scale at some point, but i'm not stressing over it. I feel better, and I think that is the most important thing.
