---
layout: post
title: 'Practical ScriptableObjects Part 1: Variables'
excerpt: ''
tags:
  - post
  - unity3d
  - game-development
  - programming
---

- Why is this useful?
  - Games need lots of data, some data is constant, it isn't supposed to change but a lot of the data games need is related to the players progress and needs to change with the experience.
  - Creates a separation between the game logic and the data values that alter that logic.
  - ScriptableObjects can be referenced easily in the editor, drag and drop into MonoBehaviour fields
  - Changing a scriptable object doesn't cause a recompile, can be done during runtime within the editor/player
  - ScriptableObjects can be put into asset bundles, changing game behaviour doesn't require shipping new code
  - ScriptableObjects are just assets, can be easily discovered, looped over within editor for easy automation
  - ScriptableObjects have built-in support for serialization
  - include link to unity talk on scriptable objects: https://www.youtube.com/watch?v=raQ3iHhE_Kk
- Very basic example

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
