---
layout: post
title: "Electric Noir .plan #4"
excerpt: ""
date: 2018-06-25 16:00:54
updatedDate: 2018-06-25 16:00:54
path: electric-noir-plan-4
path_prefix: /post/
tags:
  - post
  - Meta
  - unity3d

---

[c/w pets, death, dying]

*Originally written 5/22/18:*

### Stuff I Did


- Started and finished the active weapon/active combat action choosers.
- The currently selected weapon and combat action for that weapon are stored in The gamestate, so when the player clicks to attack we can know what they are trying to do.

It might be a good idea to add some helper methods to the state object.

- GetSelectedPartyMember()
- GetMainCharacter()
- GetSelectedWeapon(int character)
- GetSelectedCombatAction(int character)

These would probably work better as extension methods. I don't want to store helper methods on the state object. It's a semi-firm rule (my own) that scriptable objects should only have data and no functionality. I violate this in the combatactionsheet, but i haven't found a decent way to avoid that yet.

Also, i don't like the way I have to access GameDirector.Instance.State/Config. It feels really long-winded. I wish there was an easier way to get the current state and the current config.

I supose I could write extension methods on top of MonoBehaviour...

```text
GetState()
GetConfiguration()
```

interesting idea... i mean it's just syntactic sugar, it doesn't actually make anything better (other than typing). I mean even if I used a service locator i'd still need a static accessor for it since unity doesn't have built-in support for DI. Sounds more and more like something I don't need to worry about at this point.

I demo'd some of the stuff I'd been working on to a friend but he didn't seem to be too interested. In fact he seemed pretty surprised that I was still working on this project.

I'll have to see when I started working on this (back in my gamedev-side-projects repo) and count the months. I bet it's been 7 months now. I can't remember if I was working on it before shiva passed or not.

I miss her a lot. Still hurts today. I don't think it will ever stop hurting.