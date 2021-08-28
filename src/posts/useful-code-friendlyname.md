---
layout: post
title: "Useful code: FriendlyName"
date: 2021-08-28 00:00:00
tags:
  - post
  - programming
  - c#
---

Debugging in C# is pretty straightforward and made wicked easy with editors like Visual Studio, VScode and JetBrains Rider. But no matte how great the debugging experience, I find myself needing to write various pieces of information to log files or the console more often than not, and in a lot of cases I'll want to print out the type of an object which is usually pretty easy.

```csharp
Console.WriteLine($"object type is: {whatever.GetType().Name}");
```

And this works really well for like 80% of the cases, but if `whatever` happens to be a generic typed object, you're going to have a bad time.

```bash
object type is: List`1
```

You've probably seen this and then realized that `whatever` is a `List<T>` and you need to update your log statement so that it outputs all the type information.

```csharp
Console.WriteLine($"object type is: {whatever.GetType()}");


// outputs: object type is: System.Collections.Generic.List`1[System.String]
```
This isn't bad _per se_ but it can be a lot better.


## FriendlyName

Below is a C# extension method that will output a much easier to read type name. <code>List\`1</code> from our example above becomes `List<string>`, which is so much easier on the eyes!

```csharp
public static class TypeExtensions {
    public static string FriendlyName(this Type type) {
        string friendlyName = type.Name;
        if (type.IsGenericType) {
            int iBacktick = friendlyName.IndexOf('`');
            if (iBacktick > 0) {
                friendlyName = friendlyName.Remove(iBacktick);
            }
            friendlyName += "<";
            Type[] typeParameters = type.GetGenericArguments();
            for (int i = 0; i < typeParameters.Length; ++i) {
                string typeParamName = FriendlyName(typeParameters[i]);
                friendlyName += (i == 0 ? typeParamName : "," + typeParamName);
            }
            friendlyName += ">";
        }

        return $"{type.Namespace}.{friendlyName}";
    }
}
```

Hope you enjoyed this useful code snippet, until next time! You can always shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)