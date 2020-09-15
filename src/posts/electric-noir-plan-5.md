---
layout: post
title: "Electric Noir .plan #5"
excerpt: ""
date: 2018-07-02 16:00:12
updatedDate: 2018-07-02 16:00:12
path: electric-noir-plan-5
path_prefix: /post/
tags:
  - post
  - unity3d

---

*Originally written 5/23/2018: *

After building out the combat action chooser i am thinking that the interface doesn't seem to work very well. After choosing a combat action the player will have to click another button (or click the same button, but maybe in a different area) in order to start using the action. Fallout gets around this by having you change combat actions with a right-click but using the action with a left-click. I don't think i need to do this, but something like it would be better than what i have now.

perhaps if the combat actions displayed right next to the selected weapon? just before the "spells" area? they could display there and since there are max 5 that means I could still allow 5 spells to be equipped. Yeah this seems like the best option to continue forward with. I should be able to get that done in about an evening or so.

so what about after that? quests? redressing the conversation ui?
### Quests

Quests are complicated because they need to be accessible programmatically (so they can be triggered/updated via conversations and events) and they need to persist (so that their state can be saved).

- How do we know when a quest is complete (other than an NPC or event telling us it is)
- Exploration quests?
- Character Development Quests? (Learn your first spell, get your first gun, etc)
- UI for reviewing quest progress. Something like the journal entries in DOS would be cool. Fallout just had a basic "you need to go here now" kind of quest log (minimal information).
- Should you be able to abandon quests?
### Conversation UI

This isn't really complicated. It's more just really not exciting. I mean there is some modification work to Yarn that is involved - because I want to have the previous line(s) of text be available as you read over your responses. But other than that it's pretty straight forward. Still though, it's straight up UI work which should be fast. Another item I should be able to get done in an evening.
### Spells

More like "hacks" than spells (tho internally I might just call them spells). This is more discovery and thinking (like quests but more so).

- How are spells recharged? Straight up cooldown? Based on some other in-game resource (power? computer memory? CPU?).
- How likely is it that a Spell could have multiple combat actions?
- How do you learn/unlearn spells? (essentially how do you equip/unequip them). Should they be in a separate UI from the wearable items?
- What skill(s) govern spells? Multiple skills? A single skill?

Could be fun to start thinking through those items and sketching the idea out more in here.