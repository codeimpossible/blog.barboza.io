---
layout: post
title: 'Practical ScriptableObjects: Data Library'
excerpt: ''
tags:
  - post
  - unity3d
  - game-development
  - programming
---

If you haven't checked out the intro to this series yet, you [should give it a read now](/post/practical-scriptableobjects). It has an overview of what I'm setting out to do with this series as well as links to my other posts and excellent resources on ScriptableObjects.

## Whats the problem?

While building Electric Noir I often needed to reference assets directly from my MonoBehaviour code. The problem is I didn't want to have asset references located in all my Game Objects and prefabs, that would make refactoring or swapping out assets later on a really time consuming task - and this sort of work is always going to happen when making your game, so its worth spending some time on making it easy up front if you can.

## The old ways

So I had assets like Sprites, Textures, AudioClips, and even Materials that I needed to be able to access via code at runtime. The normal method to do this would be to move all the assets I need at runtime into `Resources` folders and load them using `Resources.Load()`. I could also opt to bundle all my assets into Asset Bundles and use `AssetBundle.LoadAsset()`. Both of these are fine options, but I wanted something that would pull in new assets automatically and provide a simpler API to get the assets I needed.

## Enter the Data Library

The data library in Electric Noir is a Scriptable Object (as you probably guessed) that holds references to various assets used throughout the game. It's re-built every time the game is built and can be built manually via in-editor Menus. It also provides a very simple API to access resources, so loading a Sprite at runtime can be done via:

```csharp
var sprite = DataLibrary.Instance.GetSpriteByName("ExampleSprite_0_1");
```

I can also access all the assets of a specific type.

```csharp
var allSprites = DataLibrary.Instance.Sprites;
```

## Basic Implementation

Let's get started with a basic implementation. Let's define our `DataLibrary` class and give it some basic properties.

```csharp
// original by Jared Barboza <https://blog.barboza.io>
// released under MIT licence https://blog.barboza.io/license/
//
// put this code in a DataLibrary.cs file
// make sure to create your DataLibrary asset in a Resources folder
[CreateAssetMenu(fileName = "DataLibrary.asset", menuName = "Practical ScriptableObjects/Data Library", order = 0)]
public class DataLibrary : ScriptableObject {
    // Singleton implementation
    private static DataLibrary _instance;
    public static DataLibrary Instance {
        get {
            if (!_instance) _instance = Resources.Load<DataLibrary>(nameof(DataLibrary));
            return _instance;
        }
    }

    // Internal caching, makes looking up the same assets repeatedly faster
    private Dictionary<string, object> _lookupCache = new Dictionary<string, object>();

    private T GetCachedObject<T>(string lookup, List<T> lookupSource) where T : UnityEngine.Object {
        var key = CreateKey(lookup, typeof(T));
        if (_lookupCache.TryGetValue(key, out var cached)) {
            return cached as T;
        }
        var item = lookupSource.FirstOrDefault(se => se.name == lookup);
        if (item) {
            _lookupCache.Add(key, item);
        } else {
            Debug.Warn($"Lookup for '{lookup}' of type '{typeof(T).Name}' failed. The library will return a default value. This may cause unwanted behaviour.", this);
        }
        return item;
    }

    private string CreateKey(string name, Type objectType) => $"{name}_{objectType.ToString()}";

    // The actual library asset reference properties
    public List<Material> Materials;
    public List<Sprite> Sprites;
    public List<AudioClip> AudioClips;

    public Sprite GetSpriteByName(string spriteName) => GetCachedObject(spriteName, Sprites);
    public Sprite GetMaterialByName(string materialName) => GetCachedObject(materialName, Materials);
    public Sprite GetAudioClipByName(string clipName) => GetCachedObject(clipName, AudioClips);
}
```

With that file created we can now create a new Data Library by selecting **Create/Practical ScriptableObjects/Data Library** menu item from either the **Assets** editor menu or the right-click menu within the Project View. Once the datalibrary is created we can add the assets to each list manually.

## Adding assets manually? That's lame.

Yeah, I agree. Let's add an editor script to make this easy. This script will need to use my `AssetDatabaseUtility` class from my [code recipe post of the same name](/post/Code-Recipe-AssetDatabaseUtility/), so make sure you grab that code and add it to your Editor source files.

```csharp
// original by Jared Barboza <https://blog.barboza.io>
// released under MIT licence https://blog.barboza.io/license/
//
// put this code in a RebuildDataLibrary.cs file
// make sure to add this to an Editor folder
public class RebuildDataLibrary {
    private const string DataDirectory = "Assets";

    [MenuItem("Tools/Practical ScriptableObjects/Refresh Data Library")]
    public static void UpdateDataLibraryMenu() {
        var library = AssetDatabaseUtility.Load<DataLibrary>(searchPaths: DataDirectory).First();
        UpdateDataLibrary(library);
    }

    public static void UpdateDataLibrary(DataLibrary library) {
        library.Materials = AssetDatabaseUtility.Load<Material>();
        library.Sprites = AssetDatabaseUtility.Load<Sprite>();
        library.AudioClips = AssetDatabaseUtility.Load<AudioClip>();

        EditorUtility.SetDirty(library);
    }
}
```

The above class adds a menu to the Unity Editor under **Tools/Practical ScriptableObjects** that will assign the existing Materials, Sprites and AudioClips into the data library asset automatically. Let's also add a button to the Data Library inspector so we can rebuild the library when we have it selected in Unity.

```csharp
// original by Jared Barboza <https://blog.barboza.io>
// released under MIT licence https://blog.barboza.io/license/
//
// put this code in a DataLibraryInspector.cs file
// make sure to add this to an Editor folder
[CustomEditor(typeof(DataLibrary))]
public class DataLibraryInspector : UnityEditor.Editor {
    private DataLibrary Data => (DataLibrary)target;

    public override void OnInspectorGUI() {
        if (GUILayout.Button("Refresh Data")) {
            RebuildDataLibrary.UpdateDataLibrary(Data);
        }
        DrawDefaultInspector();
    }
}
```

The final touch is to add a [build time preprocessor](https://docs.unity3d.com/ScriptReference/Build.IPreprocessBuildWithReport.OnPreprocessBuild.html) to ensure the data library is always built when we create a build of the game. We definitely don't want to ship a build of the game with an outdated data library!

```csharp
// original by Jared Barboza <https://blog.barboza.io>
// released under MIT licence https://blog.barboza.io/license/
//
// put this code in a UpdateDataLibraryPreprocessor.cs file
// make sure to add this to an Editor folder
public class UpdateDataLibraryPreprocessor : IPreprocessBuildWithReport {
    public int callbackOrder => -10;

    public void OnPreprocessBuild(BuildReport report) {
        RebuildDataLibrary.UpdateDataLibraryMenu();
    }
}
```

## Summary

There's not much code to this solution, which (I hope) makes it really easy to extend and customize. Imagine having different player abilities, loot items, spells, hit effects defined in ScriptableObjects and adding them to this DataLibrary. You could easily spawn hit effects or enable abilities from within your MonoBehaviours without them needing their own copy of the data.
