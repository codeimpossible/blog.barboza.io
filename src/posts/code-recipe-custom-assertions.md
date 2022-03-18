---
layout: post
title: "Code Recipe: CustomAssertions"
tags:
  - post
  - programming
  - unity3d
  - game-development
  - code-recipe
---


Unity used Nunit for it's test framework and there doesn't seem to be a straight forward way to replace it, so I'm stuck with it for now. I've been really unhappy with Nunits `Assert` structure, specifically how hard it is to craft custom assertions and constraints. 

So I wrote my own wrapper for it.

```csharp
    public class CustomAssertions {
        public CustomAssertionContext<T> That<T>(T context) {
            return new CustomAssertionContext<T>() { Target = context };
        }
    }

    public interface ICustomAssertionContext<out T> {
        T Target { get; }
    }

    public class CustomAssertionContext<T> : ICustomAssertionContext<T> {
        public T Target { get; internal set; }
    }
```

Using that little bit of code I can just new up a CustomAssertions object as a property in my test base class:

```csharp
public CustomAssertions Asserts { get; private set; } = new CustomAssertions();
```

And then I can add extensions methods to my hearts content. And since the ICustomAssertionContext interface uses covariance, I can easily add extension methods that target interfaces that the class implements. Here's how I wrote my own IsWithinRange assertion:

```csharp
    using NUnit.Framework;
    public static class CustomNumberAssertions {
        public static void IsWithinRange<T>(this ICustomAssertionContext<T> context, 
            T min, T max, bool inclusive = true) where T : IComparable {
            
            if (inclusive) {
                Assert.That(context.Target.CompareTo(min) >= 0 && context.Target.CompareTo(max) <= 0, Is.True);
                return;
            }

            Assert.That(context.Target.CompareTo(min) > 0 && context.Target.CompareTo(max) < 0, Is.True);
        }
    }
```

So now I can easily extend my tests with custom assertions and since I'm just wrapping the Nunit basic assertions here, all of these asserts work within the test framework without any additional Nunit changes.

```csharp
Asserts.That(distanceFloat).IsWithinRange(0f, 32f);
```

What do you think? Shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)