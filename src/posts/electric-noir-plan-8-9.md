---
layout: post
title: "Electric Noir .plan #8 & #9"
excerpt: ""
date: 2018-07-16 16:00:24
updatedDate: 2018-07-16 16:00:24
path: electric-noir-plan-8-9
path_prefix: /post/
tags:
  - post
  - electric-noir

---

*Originally written 5/27/18:*

Gotta think about ammo a bit more.
Like how much does ammo weigh? - Answer: more than I thought in some cases. I ended up going with what I think is the not-so-great but not-so-terrible option. Which is... i hardcoded the ammo types, weights and counts into the game.
So basically it works like this:

- Ammo weights are set in GameConfiguration
- Ammo counts are stored on the InventoryList
- Inventory weight is calculated via extension method on InventoryList

### Next up


- Get the inventory to show the ammo as a stacked item
- Support item stacking
- speed up inventory rendering (optional for now)



*Originally written 5/28/18:*


Storing inventory should probably be different from showing/accessing inventory during the game.
### Stuff I Did


- Got a demo project implementing a stackable inventory and pushed it to github https://github.com/codeimpossible/UnityStackableInventory
- Moved that code over to my game, inventory window renders a lot faster and works pretty good now. A few bugs still need to be sorted out around equipping/unequipping items.

Thoughts:
I could store the inventory items (deduped) in one array, and then the counts for each item in another array.
```text
public InventoryItemSheet[] ItemTypes;

public int[] ItemCounts;
```
i could use a pre-deserialization hook to parse that into a better structure for use in the game.
alertnatively, i can create another object type, one that is serializeable and that stores the InventoryItemSheet and the count together:

```text
[Serializable]
public sealed class InventorySlot
{
    public InventoryObject ItemType;
    public int Count;

    // these could also be extension methods to keep the object 
    // slim (if it needs to be a SO)
    public bool AddItem(InventoryObject item) {
        if (item != ItemType) return false;
        Count++;
        // used by inventory to trigger Item_Added events (local and global)
        return true;
    }

    public InventoryObject RemoveItem() {
        if (Count == 0) return null;
        Count--;
        // used by inventory to trigger Item_Removed events (local and global)
        return ItemType;
    }
}
```

This could be the object that gets created post deserialize. I want to know more about when serialization occurs (and if I can trigger it manually). I don't want to be writing to disk every time they move an inventory item around. Also, just creating the InventorySlot class doesn't solve my other problem of wanting to be able to specify enemy/container loot manually. How would i add 30 9mm bullets to a crate with this system? I've had troubles with collections of custom classes not getting serialized.
Huh, holy fuck. That actually works pretty well.

```text
[CreateAssetMenu]
public class InventoryObject : ScriptableObject {
    public string Description;
    public float Weight;
}

[CreateAssetMenu]
public class InventoryList : ScriptableObject {
    public List<InventorySlot> Items;
}
```

So what about max stack sizes? Well i don't need to enforce that here since this is storage and it's more efficient to store 1 InventorySlot than multiple. I can instead enforce that in the UI. Whenever an item is added/removed i can re-shift the stacks (or not and allow the user to do it to save CPU time).
I got a pretty good demo project up and running showing off the stackable items approach. <a href="https://github.com/codeimpossible/UnityStackableInventory" target="_blank" rel="noopener">https://github.com/codeimpossible/UnityStackableInventory</a>
