---
layout: post
title: "Just one person"
date: 2021-11-19 00:00:00
tags:
  - post
  - game-development
---

I realized this week that I've been sort of going about building this game the wrong way. Being a one-person development shop really boils down to time. I don't have the same amount of time that a larger shop does, really.

This probably seems obvious, and yeah, it **is**. But I hadn't contextualized that into how it would affect the actual day-to-day building of the game.

For example: the more bugs I find later in the process, the more time it will take me to fix them and there is a high likelyhood of that time needing to be spent on other critical tasks. I've realized that I need to really put all my chips into automating things as much as I can. Simple tasks like releases, creating bug tickets to intermediate tasks like making my asset pipeline as frictionless as possible to advanced tasks like adding tests to the game itself.

I've had tests in various states of the game, from actual unit tests that run on small, isolated classes, to play-mode integration tests, but the majority of testing so far has been done by me playing through a piece of functionality in a test level. And that last part isn't going to scale well. I'm not seeing the usual problems of cascading bugs (make a change to A and B breaks) but I am experiencing a lot of trouble around inspecting what is happening during complex interactions.

Here's a good example of this: Player gets a new ability - The Shield Dash - they can hold down a button and charge forward very fast with an energy shield that breaks through certain walls and damages enemies.

I found a bug during testing where the shield wasn't damaging enemies though. All my in-game and in-editor tooling was telling me that the hit boxes were enabled but it just wasn't damaging the enemy for some reason. The reason for this ended up being really complicated but something that a test would easily cover. only problem: writing tests against Unity components is not the easiest, nor is it the most performant

SO that brings me to a recap of what I've been doing this week: refactoring! I've been changing the core of the combat classes so that there is separation between the Unity side of things (behaviour classes, game events, update, physics) and the core combat logic (hit box collisions, attack selection, combos).

The end goal here is that I will have a set of tests covering how the combat systems should behave and then a layer on top of that that sits in unity to integrate that system into the various behaviours that objects need to participate in combat.

From there I can, as needed, create specific unity tests to run the behaviours through specific scenarios and verify that all the pieces are working as I make changes to the rest of the game.
