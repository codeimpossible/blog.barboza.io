---
layout: post
title: "Adding an AI Player"
excerpt: ""
date: 2021-04-15 00:00:00
updatedDate: 2021-04-15 00:00:00
tags:
  - post
  - csharp
  - dotnet
  - unity3d
---

I've been hammered with gameplay bugs this past few months. Most of them are related to combat and statemachine interactions and as such they are really hard to debug. I sunk a lot of time into trying to manually reproduce events with little success, though they seem to happen pretty regularly when I'm demoing the game or play testing it myself outside of Unity... 🤷.

Anyway, to help me get more test data I built out an AI player that can perform each combo/attack and I can set traps for specific cases so I no longer have to manually test each scenario, I can code them up or let the AI run until it encounters them. This is a huge time-saver. Here's a gif of the AI Player in action.

![1EKbPUO](https://user-images.githubusercontent.com/176476/113904220-d5f30580-979f-11eb-926a-7a49263f7625.gif)

It's built in a separate `MonoBehavior` which I can drop into any scene. At startup it finds the player object and replaces the input object on the player with a custom one, so it drives the player character by simulating game inputs, so none of the player code has to change for it to function.

All of the actions the AI can perform are coded as [Coroutines](https://docs.unity3d.com/Manual/Coroutines.html) in Unity, here's the code for a light punch:

```csharp
private IEnumerator Punch() {
    _actions.Add($"Punch");
    _player.Facing.Face(_currentEnemy);
    yield return null;
    _input.Input.QuickAttack = true;
    yield return null;
    yield return _inputWait.Yield();
}
```

This let's me code up combos that the AI can perform really easily:

```csharp
public delegate IEnumerator Move();
// ... later on
_moveList = new List<Move[]>() {
    new Move[] { Punch, Punch, Punch, HeavyPunch },
    new Move[] { Punch, Punch },
    new Move[] { Punch, Punch, HeavyPunch },
    new Move[] { Block },
    new Move[] { Dodge, ShootPistol },
    new Move[] { HeavyPunch },
    new Move[] { ShootPistol },
    new Move[] { Dodge },
};
```

I should be able to use this to create a suite of tests that can run on build to test out combos, attacks etc. I'm pretty happy with this solution.
