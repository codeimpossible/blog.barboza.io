---
layout: post
title: "Enemy Culling"
date: 2021-10-26 00:00:00
updatedDate: 2021-10-26 00:00:00
tags:
  - post
  - electric-noir
  - unity3d
  - game-development
---

I've been in a bit of a depression lately, which has made posting here difficult and feeling good about the progress I'm making even harder.

But I'm proud of the work I did this morning, so I figured I'd share.

First, I tweaked the sound "fall off" distance for enemies, so you won't hear the audio for an enemy if they are off the screen. Also, their positional audio is now correct, if they are above and to the left, that is where the sound feels like it is coming from.

Next, enemy spawn points no longer all spawn at the start of a level. They will wait until they are within 1 "screen" of distance from the current camera before spawning an enemy. Also, enemies now only run their AI and controller code when they are within 1 "screen" of the current camera, saving some cycles.

## Level Lifecycle
Changing the enemy spawn points to only activate when within a certain distance from the camera was pretty easy thanks to some work I did a while ago. `ILevelCallbackReceiver` is a interface I built to allow objects to receive event notifications from a level when it goes through its lifecycle: `BeforeInitialize -> AfterInitialize -> Activate -> Deactivate`. 

The level object will call any children that implement that interface at those points during the lifecycle, allowing me to hook in and run code without having to special case certain behaviours.

The only "hard part" was checking to see if the spawn point or enemy is within 1 "screen" of the camera, but even this isn't very hard, just maths.

```csharp
if (_isReadyToSpawn) {
    var units = CameraUtility.GetCameraViewportUnits();
    var activationDistance = Mathf.Max(units.x, units.y) * 1.5f;
    var camPos = CameraUtility.GetActiveCameraPosition();
    var distance = Vector2.Distance(transform.position, camPos);
    if (distance <= activationDistance) {
         SpawnEnemy();
    }
}
```

`GetCameraViewportUnits()` returns a `Vector2` with the height and width of the camera view in unity units. From there I take the largest number and use that as a distance check against the camera position. It's not perfect, but it's definitely good enough for right now.

Here's an example of it working in Unity. I'm dragging the camera around a test level and you can see the enemies becoming activated/deactivated (the green lines of their ground checks showing/not showing) based on their distance from the camera.
<img src="/electricnoir/EnemyCulling.gif" />

That's all I have for now, as always, shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)
