---
layout: post
title: "Electric Noir .plan #6 & #7"
excerpt: ""
date: 2018-07-09 16:00:19
updatedDate: 2018-07-09 16:00:19
path: electric-noir-plan-6-7
path_prefix: /post/
tags:
  - post
  - unity3d

---

*Originally written 5/25/18:*
### Stuff I Did



- Combat Action Hotbar is done
- A very rough spell system is in place
- I added a behaviour to randomly spawn items into an inventory
- NPCs don't need to have a inventorylist, one will be created for them on Start()
- I added a behaviour to fill an NPCs inventory with items
- I coded up WaitForBrain and a basic behaviour that lets brains be added to a NPC


*Originally written 5/26/18:*

### Stuff I Did


- Quest system flushed out (rough)
- Can complete quests
- Can check if elligible for a quest
- Quests have item and XP rewards


Not sure how to notify _which_ quest was completed via the event system. I might update the event system to take an optional int param, and use that to pass the quest id. Need to think about that a bit more though.
Also not sure how to reference quests from other areas of the game. For example, starting a quest as a result of completing a dialogue with an NPC, or completing a quest after picking up an item.





### Asset Bundles

I spent some time reading about asset bundles in unity. They look like the answer to a few questions i've had, mostly around saving game data and DLC. From my understanding I could move all the game state objects into a save game asset bundle and use that to store them (which would be the savegame file). Then when they load the save game that saves asset bundle is loaded, adn all the assets load as normal. I _think_ this would work. I'm not sure though. God I'm getting sleepy, I need to rest on the couch for a bit I think.
### Ammo

Started thinking about ammo today. IN fallout ammo is a stackable item (and there are many variations of ammo, 9mm, 5.56, .44, .32, some with JHP or Armor Piercing rounds). I don't really have the concept of stacking in the inventory today, so I don't have the ability to represent large quantities of items nor do I have the ability to represent that in data either. See, scriptableobjects are basically static objects, so if I create an "ammobox" SO that has the ammo type and the number of bullets in it, and put that in my inventory, as I decrease the number of bullets, it decreases in all copies of the scriptable object. Which... isn't how bullets work.

A blog post I read recently had some info about using runtime variables in scriptable objects... maybe that might be part of the answer? <a href="https://unity3d.com/how-to/architect-with-scriptable-objects">https://unity3d.com/how-to/architect-with-scriptable-objects</a>




```text
public class FloatVariable :
  ScriptableObject, ISerializationCallbackReceiver {

    public float InitialValue;

    [NonSerialized]
    public float RuntimeValue;

    public void OnAfterDeserialize() {
        RuntimeValue = InitialValue;
    }

    public void OnBeforeSerialize() {}
}
```




SO if i understand this correctly, `OnAfterDeserialize` sets the value of InitialValue to RunTimeValue, and we use RuntimeValue during code execution. Then if I wanted to save the value back i could add some code to OnBeforeSerialize to maybe save the updated float value back to InitialValue; This doesn't solve my problem with SO references. An intermediate object could work... something that stores the inventory item and how many are there (maybe even calling it a InventoryStack)... seems overkill? Or maybe InventorySlot? I don't know. Seems like it would still have problems ('cause i'd need to create an instance of the InventorySlot object and fill it with the right object and the count).

On top of all of this I want the inventory screen to load fast. Players are going to spend a decent amount of time in their inventory, so it needs to be fast and easy to use.
Well, more stuff to think about tomorrow. When my head isn't so tired.

