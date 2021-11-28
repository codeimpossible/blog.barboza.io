---
layout: post
title: "Adding automated tests to Electric Noir"
date: 2021-11-28 00:00:00
tags:
  - post
  - game-development
  - unity3d
---

I realized this week that I've been sort of going about building this game the wrong way. Being a one-person development shop really boils down to time. I don't have the same amount of time that a larger shop does, really.

This probably seems obvious, and yeah, it **is**. But I hadn't contextualized that into how it would affect the actual day-to-day building of the game.

Basically, I wasn't thinking about how difficult and time consuming tracking down bugs later on in the process will be. I've realized that I need to really put all my chips into automating things as much as I can. 

I've already spent time automating simple tasks like releases and importing new art assets. They are easy to perform and require as little intervention from me as possible, but more involved tasks - like testing - are all still manually done by me.

I've had a small amount of tests in the game, from actual unit tests that run on small, isolated classes, to play-mode integration tests, but the majority of testing so far has been done by me playing through a piece of functionality in a test level. That isn't going to scale well.

## The problem

I've been working on the abilities that the player will unlock during the game which lead me to implement an upgrade for the players run: A Shield Dash.

When activated the shield dash will move the player forward much faster and they will be able to smash into enemies damaging them and even smash through certain types of walls to open up new areas. So, breaking this down we've got

- A new input that triggers the ability
- A new animation the player should play when the ability is active
- A new attack that takes affect while the ability is active to damage enemies
- A hit check against certain wall types to know if they can be broken or not

## How attacks work in Electric Noir

The attack and combat system is pretty simple in EN. Attacks can be performed in certain sequences and those sequences are the combo attacks in the game.

<img src="/electricnoir/how-attack-selection-works.png" />

It starts with a `CharacterData` scriptable object, which contains various pieces of data for the player and each enemy in the game, including their set of "Root Attacks". Root attacks are just attack objects that act as the root of whatever combo we want to create. From there each root attack contains a list of `ComboAttacks` which are attacks with a set of criteria that need to be met. This criteria can be anything: "The 'X' button is pressed" or "The Ground Slam Ability is Enabled" and they can be used together to create more complicated checks before performing an attack in the combo.

Each frame the character or enemy ai checks the last attack they used, if it has attacks it can combo to, their criteria is checked. If the criteria passes, that attack is "chosen" and performed. If no combo is picked then the Root Attacks are checked. If a root attack criteria passes it is "chosen" and performed, otherwise we wait for the next frame.

When an attack is chosen, the character logic can access that attack via a `CombatContext` and do whatever it needs to to perform the attack. Once the character logic is done with the attack it clears it so the combat system won't check it for combos going forward.

## Adding Shield Dash: Attempt #1

Implementing the shield dash into this system went pretty smoothly. I created a new attack called "ShieldDashHit" which is activated when the player is playing a specific animation (the shield dash animation) and if the player has the shield dash ability activated. Then I wired up the input system to have a new input for the shield dash and I was ready to test.

Everything looked great, until the player made contact with an enemy. Remember that the shield dash is supposed to damage an enemy and knock them back? Yeah, that didn't happen at all. The player ran straight past the enemy and the enemy wasn't phased. Not exactly the sort of gameplay I was looking for.

### Debugging

I started debugging the problem using the in-editor tooling I had built out so far, but nothing looked out of place. The player was playing the animation, the hit boxes were enabled and present, the enemy just wasn't being damaged for **some reason**. After a few hours of poking at the system - and "giving up" by posting `Debug.Log` calls everywhere - I discovered that there was a bug in the combat logic. Specifically around when an attack was "chosen" and when that attack was cleared.

The character logic was discarding the attack after the first loop through the attack animation. When the player and enemy collided, there was no damage because there was no chosen attack. The system ignored the collision and continued on.

## New Problems

So after realizing all this I sort of knew I was in a bad situation. I've got several problems:

1. Attacks are being cleared too soon by the character logic
2. Attack selection has no test coverage
3. No logging when the system encountered an obvious error state (no attack during attack collision)

Looking at issues 1 & 2, it was clear to me that I needed to do a fair amount of refactoring to the combat system logic to make sure it was functioning in a way that would support the features I wanted. However, fixing these issues would also introduce a new issue:

I have no way of guaranteeing that these fixes work in the future and that I haven't broken something else in the process.

SO that brings me to a recap of what I've been doing this week: refactoring! I've been changing the core of the combat classes so that there is separation between the Unity side of things (behaviour classes, game events, update, physics) and the core combat logic (hit box collisions, attack selection, combos).

The end results are ones that I am incredibly happy with. I now have unit tests for the entire combat logic of the game and I have integration tests that cover actual gameplay scenarios, including the shield dash problem from earlier in the post!

<img src="/electricnoir/adding-automated-tests-to-unity-integration.gif" />

Here's what the code for that integration test looks like by the way.

```csharp
[UnityTest]
public IEnumerator WhenShieldDashMakesContactWithAnEnemy_TheEnemyIsDamaged() {
    yield return LoadSceneAsync("SmallRoomWithEnemyHarness");
    LevelHelper.ActivateLevel();
    yield return PlayerHelper.WaitForPlayer();
    yield return PlayerHelper.WaitForPlayerState(PlayerController.PlayerStates.Idle);

    PlayerHelper.PlayerContext.EnableAbility(PlayerAbilities.ShieldDash);

    var playerStartPosition = PlayerHelper.PlayerObject.transform.position;
    var expectedAttack = PlayerHelper.AllAttacks
          .Where(a => a.Name == "Attack-ShieldDashHit")
          .FirstOrDefault();
    Assert.That(expectedAttack, Is.Not.Null);

    var spawnPoint = GameObject.FindObjectOfType<EnemySpawnPoint>();
    foreach(var enemyType in EnemyHelper.AllEnemies) {
        var enemyObject = EnemyHelper.SpawnEnemy(enemyType, spawnPoint);
        var enemyCombatContext = enemyObject.GetComponent<ICombatContext>();
        yield return new WaitForSeconds(0.1f);

        Input.Press(Keyboard.mKey);
        yield return null;
        Input.Press(Keyboard.rightArrowKey);

        yield return new WaitForCondition() {
            MaxTime = 4f,
            Expression = () => enemyCombatContext.IsHitThisFrame
        };

        var currentAttack = PlayerHelper.PlayerCombatContext.CurrentAttack;
        Assert.That(currentAttack.Name, Is.EqualTo(expectedAttack.Name));
        Assert.That(currentAttack, Is.EqualTo(expectedAttack));
        Assert.That(enemyCombatContext.LastHit, Is.Not.Null);
        Assert.That(enemyCombatContext.LastHit.Damage, Is.EqualTo(currentAttack.Damage));

        Input.Release(Keyboard.mKey);
        Input.Release(Keyboard.rightArrowKey);
        yield return null;

        GameObject.DestroyImmediate(enemyObject);
        PlayerHelper.PlayerObject.transform.position = playerStartPosition;
        yield return PlayerHelper.WaitForPlayerState(PlayerController.PlayerStates.Idle);
    }
}
```

Until next time! You can always shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)

