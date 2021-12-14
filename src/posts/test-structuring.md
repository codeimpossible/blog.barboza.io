---
layout: post
title: "Test Structuring in C#"
date: 2021-11-30 00:00:00
updatedDate: 2021-12-14 00:00:00
tags:
  - post
  - programming
  - unit-testing
---

I've been working a lot on adding unit and integration tests to my game and I think ive refined my test structure to a point where it's really helping me organize cases better.

So let's say I'm writing a unit test for the `StateMachine` class, I'd create a `StateMachineTests.cs` in a similar namespace to where the class exists in my test assembly project (so if it's at Library.State normally, in my tests it would be LibraryTests.State).

Then I'll define the higher level use cases of the StateMachine within the StateMachineTests.cs as child classes:

```csharp
public class StateMachineTests {
  public class GivenAStateFinishes : StateMachineTests {
  }
  
  public class GivenAStateThrowsAnException : StateMachineTests {
  }
}
```

And I know this looks verbose and odd - and it is a little, but it has a few benefits:

1. I can share mocks/fakes as `private` fields instead of using helpers or re-declaring mocks
2. Setup and Teardown methods can be declared in outter classes and overridden in child test cases as needed.

It works the deeper we go too.

```csharp
public class StateMachineTests {
  public class GivenAStateFinishes : StateMachineTests {
    public class AndNoNextStateIsSet : GivenAStateFinishes {
      [Test]
      public void WhenStateExits_OnExecutionFinishedIsInvoked() {
      }
    }
  }
}
```

In the test reports, this will show as `StateMachineTests+GivenAStateFinishes+AndNoNextStateIsSet+WhenStateExits_OnExecutionFinishedIsInvoked` which though it is long, reads really nicely when you're trying to figure out what a test is really testing.

Curious what you all think. Is this something you've thought about before? How are you structuring your tests? As always, shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)
