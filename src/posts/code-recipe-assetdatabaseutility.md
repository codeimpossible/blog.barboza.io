---
layout: post
title: 'Code Recipe: AssetDatabaseUtility'
tags:
  - post
  - programming
  - unity3d
  - unity-editor
---

Working in Unity can be a frustrating endeavor, especially when working with the `AssetDatabase`. It's public methods just aren't all that helpful, at least in most of the cases where I've needed to use it.

So I've built out a helper class that makes working with assets a lot easier and I wanted to open source it in the hopes that maybe someone else finds it useful one day.

## AssetDatabaseUtility

You can check out the code [here, in the Noir.Unity](https://github.com/troublecatstudios/noir-unity/blob/stable/Editor/AssetDatabaseUtility.cs) project. It's MIT licensed so please use it or remix it as you need.

The class has three methods, each of which are pretty well documented both in the code and on the [docs site for the library](https://troublecatstudios.github.io/noir-unity/api/NoirUnityEditor.AssetDatabaseUtility.html), but I'll give a quick overview of them here.

### [Mkdirp(String)](https://troublecatstudios.github.io/noir-unity/api/NoirUnityEditor.AssetDatabaseUtility.html#NoirUnityEditor_AssetDatabaseUtility_Mkdirp_System_String_)

If you've used the command line `mkdir -p` then you know what this does. It takes a relative path like `some/path/to/some/thing` and ensures it's full hierarchy is created within the `Assets/` folder.

### [TryGetReferencesToObject(UnityEngine.Object, out IEnumerable<String>)](NoirUnityEditor_AssetDatabaseUtility_TryGetReferencesToObject_UnityEngine_Object_System_Collections_Generic_IEnumerable_System_String___)

This method searches through the asset database looking for any asset that has a reference to the given GameObject. The path to each asset file will be returned in the IEnumerable. This does read the contents of all the assets on the disk, so definitely cache the results and don't call this in a loop.

This is really useful if you're using scriptable objects as data containers or event messages. You can find out exactly which objects have a reference to in the editor so you can know if an event is safe to delete or what needs to be tested if you change a weapon.

```csharp
private void RenderMetadata(NoirGameEvent ev) {
  EditorGUI.indentLevel++;
  if (AssetDatabase.TryGetGUIDAndLocalFileIdentifier(ev, out var guid, out long localId)) {
    using (new EditorGUILayout.HorizontalScope()) {
      using (new EditorGUILayout.VerticalScope()) {
        EditorGUILayout.SelectableLabel($"ID: {guid}");
        EditorGUILayout.SelectableLabel($"Local ID: {localId}");
      }
      if (GUILayout.Button("Refresh Consumers") &&
          AssetDatabaseUtility.TryGetReferencesToObject(ev, out var usedBy)) {
            if (_eventUsedByTracker.ContainsKey(guid))
                _eventUsedByTracker[guid] = usedBy;
            else _eventUsedByTracker.Add(guid, usedBy);
      }
    }
  }

  EditorGUI.indentLevel--;
}
```

<img src="/electricnoir/inspector-game-events.png" />

### [Load<T>(String, Func<String, Boolean>, String[])](https://troublecatstudios.github.io/noir-unity/api/NoirUnityEditor.AssetDatabaseUtility.html#NoirUnityEditor_AssetDatabaseUtility_Load__1_System_String_System_Func_System_String_System_Boolean__System_String___)

This method is the first method I wrote for the helper and it's definitely the most used out of all of them in my projects. This searches the asset database for assets of a certain type, loads them and returns them. You can filter the results a few different ways:

1. Passing a search query. Any query from the search field in the project tab will work.
2. Passing a predicate Func that will get called with the path to each asset that matches the given type or query.
3. Setting a specific set of directories to search through.

Here's an example

```csharp
// find all assets with GameLevel behaviour,
// the "Level" label and only look within
// the Assets/Prefabs/Levels directory
var levels = AssetDatabaseUtility.Load<GameLevel>(
  "l:Level",
  searchPaths: "Assets/Prefabs/Levels");
```

You can check out the code [here, in the Noir.Unity](https://github.com/troublecatstudios/noir-unity/blob/stable/Editor/AssetDatabaseUtility.cs) project and on the [docs site for the library](https://troublecatstudios.github.io/noir-unity/api/NoirUnityEditor.AssetDatabaseUtility.html). It's MIT licensed so please use it or remix it as you need.

Until next time! You can always shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)
