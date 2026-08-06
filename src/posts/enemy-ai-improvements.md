---
layout: post
title: 'AI: Behavior Trees or State Machines?'
tags:
  - post
  - gamedev
  - ai
---

I'm currently playing the first few levels of Electric Noir over and over, finding bugs, making control and gameplay tweaks searching for "the fun" in preparation for a public playtest release. Ode is moving really well, the controls feel responsive and their attacks have a lot of punch and good feedback. I run into a room with a small dark blobby demon character. A Shadow Imp. Not the biggest threat one on one, but in groups they can be quite dangerous.

At least they are supposed to be. This one is currently facing away from me and walking endlessly into a wall. Not exactly the most intimidating display. I walk up to them and attack them, expecting that their AI routine has somehow gotten into a loop and the smack should interrupt them so they turn and start attacking me. However, they begin to attack the wall and half my face is contorted into a frown of frustration while the other half is flowing and shifting into disbelief.

_"I thought I had fixed this already?"_ I mumble to myself as I pause the Unity Editor and start digging into my AI code to figure out why this Imp is currently projecting their anger on the level geometry. Digging into AI problems has been the focus of a lot of the stories in my backlog the past few weeks. They seem to appear out of nowhere and as I'm finding out they are really hard to exterminate.

The current AI system is admittedly a very jank homegrown implementation of a Finite StateMachine. It works like this: there are a set of states that an enemy can be in, like Idle, Hurt, Attack, Move, you get the idea. Each of these states has a basic implementation that is used by default but each enemy can specify an override for any state. All of these states are Scriptable Objects within the project. To keep behavior isolated to each enemy the states only reference data from a StateBag (basically a strongly typed dictionary).

If this was the end of the AI system it probably wouldn't be all that bad, if a little feature limited. However, I decided to implement conditional transitions, which are really just States that perform some checks in sequence and either invoke a new state or transition to a root level state based on those conditions. So figuring out what an Enemy AI is currently doing is not as simple as inspecting their object in the scene, you also have to track down the state object in the editor and then read the code for that to see what exactly is going on.

Oh, also there is no custom UI for any of this within the Unity Editor, so you have to use the default inspector which can only show you one object at a time.

Yeah, it's not a great process. Up until now it's sort of been limping along, working well enough for me to test out other areas of the game but it's flaws are really starting to show now.

I'd been reading about Behavior Trees and how they are used in a lot of projects to quickly build out complex and dynamic AI behaviors and the idea of starting with a third party system that already provided a lot of features and functionality out of the box was really appealing, especially since most of them included a in-editor UI that allowed designing and debugging trees.

Add in the fact that I had aleady bought NodeCanvas from ParadoxNotion on the Unity Asset Store a while ago and it seemed like I had a really easy path forward to start testing out Behavior Trees.

## Behavior Trees, the basics

I found that behavior trees had a really steep learning curve. The basics are pretty easy understand, trees are made up of nodes and a node can be in one of three states: Running, Failure, or Success. There are various types of nodes but most nodes fall into the following categories:

### Composite Nodes

These nodes are going to execute one or more nodes and return a status based on the outcome of all or some of the nodes. A good example is a "Sequencer" node. It runs all its child nodes in order and if they all succeed it returns success. At the first failure it will stop and return failure.

### Decorator Nodes

These nodes alter the return of their child nodes. A good example is the "Invert" decorator which will change success to failure and vice versa. Decorators allow you to reuse other nodes and branches in really interesting ways.

### Leaf Nodes

These nodes cannot have children and usually perform some kind of modification, either changing variables or creating/destroying objects in the game world.

### Execution

Trees are executed in top-to-bottom and left-to-right order. I've got some examples below that visualize how this works.
