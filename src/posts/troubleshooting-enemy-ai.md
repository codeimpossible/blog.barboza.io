---
layout: post
title: "Toubleshooting Enemy AI"
date: 2020-09-21 19:45:00
updatedDate: 2020-09-21 19:45:00
tags:
  - post
  - electric-noir
  - programming
excerpt: "Spending time to get better debugging tools isn't usually wasted time."
---

I've been having a lot of difficulty troubleshooting enemy AI routines. The process sucks a lot currently, it basically requires me to toggle a few different compiler flags to enable/disable logging calls, play the game to try to produce the behavior(s) I'm looking for and then dig through logs that can be a few hundred lines per second of gameplay.

It's not great. It's not even good.

It's pretty bad actually.

Jeesh.

Anyway, just so we're on the same page about what I mean by "AI routines", there's nothing extremely special under the hood, the enemy AI is made up of the following components:

- State Machines to perform specific actions: `Death`, `Walking`, `Attacking`, `Standing Idle`, etc.
- A Blackboard for enemies to share information about their environment: last player position, their next destination, etc.
- A lot of helper methods to check environment state: health of the player, collision, player location, etc.

With so many moving pieces you can kinda see why it might be hard to answer questions like:

1. How did the statemachine get there?
2. Why is this object disabled?
3. Why is that animation playing?

Which is why I built a rough but pretty useful system to help me troubleshoot enemy AI. I sat down and quickly thought up a list of "must-haves" for what I wanted:

- Must be seperate from the logging system
- No disk i/o
- Available within the Unity UI, ideally related or linked to the enemy that the info comes from
- Represents the order of operations that the AI went through to reach its current state

The last two points are the really critical ones. The first two are nice, but I'd still be ok with the system if it needed to write a log file.

## Extending the Enemy Entity

First step was to update the `EnemyEntity` class with some helper functions and properties. This code displays a textbox in the inspector area and allow me to copy its contents to the clipboard with a button click! Note I'm using [Odin Inspector](https://odininspector.com/) to make adding items to the inspector a lot easier here. If you don't have Odin Inspector, you can do the same here with a [custom editor](https://docs.unity3d.com/Manual/editor-CustomEditors.html).

```csharp
#if UNITY_EDITOR
        [ShowInInspector]
        [MultiLineProperty(20)]
        [HideLabel]
        [InfoBox("This box displays diagnostic logs from the Enemy AI routines.")]
        [PropertyOrder(-2)]
        public string EnemyDecisionLog { get; private set; }

        [Button("Copy Decision Log")]
        [PropertyOrder(-1)]
        public void CopyDecisionLog() {
            UnityEditor.EditorGUIUtility.systemCopyBuffer = EnemyDecisionLog;
        }

        public void LogDecision(string decision) {
            EnemyDecisionLog += $"{decision}\n";
        }
#endif
```

The statemachine states that run on the enemy will be able to call `LogDecision()` to add entries to the `EnemyDecisionLog` and since its a property and not a field Unity won't bother serializing it, which will save us a lot of grief later on.

Copying the decision log to the clipboard is incredibly simple: `UnityEditor.EditorGUIUtility.systemCopyBuffer = EnemyDecisionLog;` is all you need!

Also note I'm using the `UNITY_EDITOR` compiler directive to only add this code when the game is runing in Unity.

## States of mind

Next up, I extended the state objects with some helper methods to wrap the `LogDecision()` function. I figured breaking out the entries into different types would help make the logs easier to read. A bit like how if you're looking through logs the log levels can help you separate `ERROR` logs from `INFO`, `DEBUG` etc.

I had a few more types, but in the end I got rid of a few that weren't very helpful and landed on the following three types of entries:

- Question: Environmental checks to determine the next outcome: _Am I near my target?, Should I Run?_
- Filter: Logging data values that can impact Question results. 
- Decision: An outcome, usually a state change

```csharp
    protected void LogQuestion(string question, bool result) {
        Enemy.LogDecision($"QUESTION: {question} :: [{result.ToString().ToUpper()}]");
    }
    protected void LogFilter(string filter) {
        Enemy.LogDecision($"FILTER: {filter}");
    }
    protected void LogDecision(string decision) {
        Enemy.LogDecision($"DECISION: {decision}");
    }

    // ... and this is how they're used

    protected bool IsNearTarget() {
        var distance = DistanceToTarget;
        var result = distance <= Enemy.AI.TargetDistanceMax && distance >= Enemy.AI.TargetDistanceMin;
        LogQuestion("Am I near my target?", result);
        return result;
    }
```

All I needed to do at this point was decorate the other helper methods within the state base classes with the relevant logging calls to get the decision log filled out.

Now I can play the game (or better yet create a player AI that plays the game) and when an enemy AI gets into a state that it shouldn't be in I can pause the game and copy their AI log out to see the issue.

Example: During on play-test I noticed that some enemies were playing their walk animation but not moving. Using this system I was able to figure out that it only happened when they had been hit by an attack with only horizontal knockback. This led me to the bug: the object that is responsible for moving the enemy according to physics was being disabled for the knockback, but never re-enabled if the knockback had no vertical movement.

Here's an example of one of the AI Decision Logs from that play-test:

```text
QUESTION: Do I have an attack slot already? :: [FALSE]
QUESTION: Is there an attack slot open? :: [FALSE]
DECISION: Changing to EnemyAggroIdle with a NoopTransition
DECISION: Idling for 7.057306 seconds.
HIT: attack=Animation_Player-PunchLeftJab, knockback=True
DECISION: Playing animation Animation_Human-Hurt2
HIT: attack=Animation_Player-PunchLeftJab, knockback=True
DECISION: Playing animation Animation_Human-Hurt1
HIT: attack=Animation_Player-PunchLeftJab, knockback=True
QUESTION: Do I have a valid target? :: [FALSE]
DECISION: Changing to EnemyAggroIdle with a NoopTransition
DECISION: Idling for 4.588106 seconds.
DECISION: Done idling.
QUESTION: Am I Aggressive? :: [TRUE]
QUESTION: Do I have an attack slot already? :: [FALSE]
QUESTION: Is there an attack slot open? :: [FALSE]
DECISION: Changing to EnemyWander with a NoopTransition
QUESTION: Should I be running? :: [FALSE]
DECISION: Playing animation Animation_Human-Walk
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
QUESTION: Am I near my destination? :: [FALSE]
FILTER: stuckFrames=11, moverEnabled=False
QUESTION: Am I near my destination? :: [FALSE]
```

The log is lacking the knockback force (something I need to add later), but the `Animation_Player-PunchLeftJab` attack only includes horizontal knockback.

Also you can see the `FILTER: stuckFrames=11, moverEnabled=False` filter log, which will be used later on to help the AI re-enable it's movement object if/when it gets stuck in the future.