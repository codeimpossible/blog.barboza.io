---
layout: post
title: "Code Recipe: GameTime"
date: 2022-02-04 00:00:00
updatedDate: 2022-02-04 00:00:00
tags:
  - post
  - unity3d
  - game-development
  - programming
  - code-recipe
---

Dealing with time in Unity isn't really painful, there is a convenient `Time` static object that unity provides which has a bunch of properties that track the passage of time in your game.

It only becomes painful once you begin to test code that uses that `Time` object. Since it's a static object it's almost impossible to mock. The solution I've used for a while is to create a `GameTime` class that wraps Unitys `Time` object and use that instead.

It's easy enough and doesn't add that much overhead, plus since it implements an interface it's very easy to mock out.

```csharp
public interface IGameTime {
    float deltaTime { get; }
    float fixedDeltaTime { get; }
    int frameCount { get; }
    float time { get; }
    float realtimeSinceStartup { get; }
}

public class GameTime : IGameTime {
    public float deltaTime => Time.deltaTime;

    public float fixedDeltaTime => Time.fixedDeltaTime;

    public int frameCount => Time.frameCount;
    public float time => Time.time;

    public float realtimeSinceStartup => Time.realtimeSinceStartup;
}
```

Putting it to use is really simple:

```csharp
public SomeConstructor(IGameTime time = null) {
    _time = time ?? new GameTime();
    _startTime = _time.realtimeSinceStartup;
}
```

And mocking time in unit tests becomes trivial:

```csharp
var mockTime = new Mock<IGameTime>(MockBehavior.Strict);
mockTime.Setup(m => m.deltaTime).Returns(1000f/60f);

var myObject = new SomeConstructor(mockTime.Object);

// write the rest of your test.
```

What do you think? Shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)