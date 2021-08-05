---
layout: post
title: "Getting child objects from assets in Unity"
date: 2021-08-05 00:00:00
tags:
  - post
  - unity3d
  - game-development
---

As part of the development for [Electric Noir](http://electricnoirgame.com) I've written a custom Asset Import pipeline for Aseprite files. You can read more about [scripted importers on unitys site](https://docs.unity3d.com/Manual/ScriptedImporters.html). Anyway, this pipeline handles things like 
- Generating and importing all the sprites from a aseprite file
- Automatically creating animations
- Creating Emission, Normal and Rim lighting maps from specially named layers
- Creating a palette map and default palette for my [recently added palette swap solution](/post/palette-swapping/)

As part of this import process there are a lot of objects added to the aseprite file. I chose to do this to keep the references intact from import to import as well as to keep my textures directory clean.

The part of the code that handles adding these... child objects to the aseprite file looks like this:

```csharp
foreach (var secondarySpriteTexture in secondaryTextures) {
    ctx.AddObjectToAsset(secondarySpriteTexture.name, secondarySpriteTexture.texture);
}

aseFileDescriptor.Sprites = new List<Sprite>();
foreach (var sprite in textureOutput.sprites) {
    ctx.AddObjectToAsset(sprite.name, sprite);
    aseFileDescriptor.Sprites.Add(sprite);
}

var animations = aseFile.GetAnimations();

aseFileDescriptor.Name = name;
aseFileDescriptor.FrameCount = frameCount;
aseFileDescriptor.AnimationCount = animations.Length;
aseFileDescriptor.Atlas = atlas;
ctx.AddObjectToAsset("Asefile", aseFileDescriptor);

ctx.SetMainObject(aseFileDescriptor);
```

The problem comes later, when I want to do something via editor code to one of the assets included in the aseprite file context. There isn't great documentation around this but you can use `AssetDatabase.LoadAllAssetsAtPath()` to pull all of the child assets for a given asset.

```csharp
foreach (var obj in AssetDatabase.LoadAllAssetsAtPath(AssetDatabase.GetAssetPath(Selection.activeObject))) {
    string guid;
    long file;
    if (AssetDatabase.TryGetGUIDAndLocalFileIdentifier(obj, out guid, out file)) {
        // do something with your child asset
    }
}
```

And there you have it.