---
layout: post
title: 'Level preview issues'
tags:
  - post
  - programming
  - unity3d
  - game-development
---

today i learned that instantiating a gameobject in Unity is a non atomic operation.

example: this operation will complete and return potentially before all of the child game objects/behaviours are actually loaded.

```csharp
var myGo = GameObject.Instantiate(sourceGameObjectPrefab, Vector3.zero, Quaternion.identity);
```

I noticed this today as I was working on my level editing pipeline. I'm creating more and more levels that are bigger than the target camera resolution (320x180), so my in-editor level previews need to be able to stitch together multiple images to represent the level correctly in the editor (for when I'm connecting doorways and moving levels around in the game world).

This process runs inside the unity editor and is pretty simple, it loads each level in a new scene and then moves a camera taking snapshots of the level and pushes those pieces to a larger texture that I save at the end. However I noticed that the level previews were mostly "black" (no data) except the lower right-hand corner (which is taken later in the process as it runs from left to right, top to bottom).

Here's an example:

<img src="/level-previews/preview_2_4.png" />

I've been debugging this for a while, thinking that the camera was just taking a picture of the wrong part of the scene, or maybe it's z-position was wrong so it was behind the tilemaps in the scene or something

nope, turns out i just need to wait a little bit. I ran the snapshot on an existing scene and the preview came out as I would expect

<img src="/level-previews/preview_2_4_2.png" />

So basically, the tilemaps haven't fully loaded when the process starts but they've loaded part way through

there's no way to check to see if the tilemaps are ready as far as I can tell, so it looks like i'm going to be changing how this process runs a bit.

I changed all the screen capture code so that it uses EditorCoroutines which let's me return control back to the editor so it can load the levels fully before I start taking screenshots and I'm really happy with the results.

<img src="/level-previews/ArrestingBranford-ElevatorRide-ElevatorAssault.png" />
<img src="/level-previews/ArrestingBranford-ElevatorRide-GoingUp.png" />
<img src="/level-previews/Eng-1-0.png" />
<img src="/level-previews/GreyBoxA_1.png" />

I also updated my area builder editor tool so that in-level object positions are shown in the correct positions within each level. Makes connecting doorways up really easy!

<img src="/level-previews/area_builder.png" />

What do you think? Shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)
