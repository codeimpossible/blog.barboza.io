---
layout: post
title: 'Practical ScriptableObjects: Variables'
excerpt: ''
draft: true
tags:
  - post
  - unity3d
  - game-development
  - programming
---

If you haven't checked out the intro to this series yet, you [should give it a read now](/post/practical-scriptableobjects). It has an overview of what I'm setting out to do with this series as well as links to my other posts and excellent resources on ScriptableObjects.

## Why use ScriptableObjects?

- Create a separation between the game logic and the data driving that behavior.
- ScriptableObjects can be referenced easily in the editor and changing their values doesn't cause a recompile.
- ScriptableObjects are just another asset so they can be easily discovered, looped over within editor code for easy automation.

* Why is this useful?
  - ScriptableObjects can be put into asset bundles, changing game behaviour doesn't require shipping new code
  - ScriptableObjects have built-in support for serialization
  - include link to unity talk on scriptable objects: https://www.youtube.com/watch?v=raQ3iHhE_Kk
* Very basic example

## A very basic example

```csharp
public abstract class DataVariable : ScriptableObject {
  [ShowInInspector]
  [PropertyOrder(-4)]
  public string Name => name;

  public abstract object ToObject();
  public abstract bool SetValue(object value);
}

public class DataVariable<T> : DataVariable {
  [HideInInspector]
  [SerializeField] private T _savedValue;

  [ShowInInspector]
  public T Value {
    get => _savedValue;
    set => _savedValue = value;
  }

  public override bool SetValue(object value) {
    if (value is T tValue) {
      Value = tValue;
      return true;
    }
    return false;
  }

  public override string ToString() => Value.ToString();
  public override object ToObject() => Value;
}
```

- Add complexity: on change event

```csharp
public delegate void DataVariableChanged<T>(T oldValue, T newValue);

public class DataVariable<T> : DataVariable {
  // snip... brevity
  public event DataVariableChanged<T> OnDataVariableChanged;
  // snip... brevity

  [ShowInInspector]
  public T Value {
    get => _savedValue;
    set {
      var shouldFireChangeEvent = !_savedValue?.Equals(value) ?? true;
      if (shouldFireChangeEvent) OnDataVariableChanged?.Invoke(_savedValue, value);
      _savedValue = value;
    }
  }

```

- Add complexity: casting
- Add complexity: editor property drawer
- wrap-up: gif of it all working in editor
- wrap-up: link to example project in github
