---
layout: post
title: "Localizations in Unity: Part 3"
date: 2021-08-25 00:00:00
tags:
  - post
  - unity3d
  - game-development
  - localization
---

In my [previous post](/post/localizations-in-unity-part-2) I showed how I created a custom importer for localization data using Unitys [ScriptedImporter](https://docs.unity3d.com/Manual/ScriptedImporters.html) system.

In this post I'll show how to build out some components to allow us to access the translation data from different areas of our game.

to display a translated text value in the game we'll need to know three pieces of information:

1. The key we want the translation for
2. The localization set that contains the key
3. The langauge we want the translated value for

So how do we collect all these pieces of information in an easy and straightforward way?

## LocalizedString is here to help

Enter the `LocalizedString` class.

```csharp
using System;
using UnityEngine;

namespace Localization.Data {
    [Serializable]
    public class LocalizedString {
        [SerializeField] private string _keyName;
        [SerializeField] private string _setName;

        public LocalizedString(string setName, string keyName) {
            _keyName = keyName;
            _setName = setName;
        }

        public string LocalizationSetName => _setName;

        public string KeyName => _keyName;

        public string GetValue() => null;
    }
}
```

This is going to be the main way we interact with our localization system. Whenever we request a translation it will be via the `LocalizedString` class. Right now the `GetValue()` method is hard coded to return null, but eventually we'll have this wired up to return the correct translation value.

But first we need to store a few pieces of data so our game can know what the active language is and what languages we support. Let's create a `LocalizationConfig` scriptable object to hold that information.

```csharp
namespace Localization.Data {
    [CreateAssetMenu(fileName = "LocalizationConfig.asset", menuName = "Game/Localization/Config")]
    public class LocalizationConfig : ScriptableObject {
        [SerializeField] private LocalizationLanguages _availableLanguages;
        [SerializeField] private string _currentLanguage;
        [SerializeField] private List<LocalizationSet> _localizationSets;

        public List<LocalizationSet> LocalizationSets => _localizationSets;

        public LocalizationLanguages AvailableLanguages {
            get => _availableLanguages;
            set => _availableLanguages = value;
        }

        public string CurrentLanguage {
            get => _currentLanguage;
        }

        public void SetCurrentLaguage(LocalizationLanguages currentLanguage) {
            _currentLanguage = currentLanguage.ToBCP47();
        }
    }
}
```

This looks like it will do what we want. However, it's using a type we've not seen before: `LocalizationLanguages`. This is an enum type that we'll use to make picking the supported languages easier in the inspector UI. It has the `[Flags]` attribute which will allow us to pick multiple values here, as long as they are powers of 2.

```csharp
[Flags]
public enum LocalizationLanguages {
    Arabic = 1,
    Czech = 2,
    Danish = 4,
    German = 8,
    Modern = 16,
    English = 32,
    Spanish = 64,
    Finnish = 128,
    French = 256,
    Hebrew = 512,
    Hindi = 1024,
    Hungarian = 2048,
    Indonesian = 4096,
    Italian = 8192,
    Japanese = 16384,
    Korean = 32768,
    Dutch = 65536,
    Norwegian = 131072,
    Polish = 262144,
    Portuguese = 524288,
    Romanian = 1048576,
    Russian = 2097152,
    Slovak = 4194304,
    Swedish = 8388608,
    Thai = 16777216,
    Turkish = 33554432,
    Chinese = 67108864
}
```

Now we just need some extension methods to convert our languages into their appropriate two-character language codes:

```csharp
public static class LocalizationLanguageExtensions {
    private static T[] GetFlags<T>(this T flagsEnumValue) where T : Enum {
        return Enum
            .GetValues(typeof(T))
            .Cast<T>()
            .Where(e => flagsEnumValue.HasFlag(e))
            .ToArray();
    }

    public static string ToBCP47(this LocalizationLanguages language) {
        var result = new List<string>();
        foreach (var flag in language.GetFlags()) {
            switch (flag) {
                case LocalizationLanguages.Arabic: result.Add("ar"); break;
                case LocalizationLanguages.Czech: result.Add("cs"); break;
                case LocalizationLanguages.Danish: result.Add("da"); break;
                case LocalizationLanguages.German: result.Add("de"); break;
                case LocalizationLanguages.Modern: result.Add("el"); break;
                case LocalizationLanguages.English: result.Add("en"); break;
                case LocalizationLanguages.Spanish: result.Add("es"); break;
                case LocalizationLanguages.Finnish: result.Add("fi"); break;
                case LocalizationLanguages.French: result.Add("fr"); break;
                case LocalizationLanguages.Hebrew: result.Add("he"); break;
                case LocalizationLanguages.Hindi: result.Add("hi"); break;
                case LocalizationLanguages.Hungarian: result.Add("hu"); break;
                case LocalizationLanguages.Indonesian: result.Add("id"); break;
                case LocalizationLanguages.Italian: result.Add("it"); break;
                case LocalizationLanguages.Japanese: result.Add("ja"); break;
                case LocalizationLanguages.Korean: result.Add("ko"); break;
                case LocalizationLanguages.Dutch: result.Add("nl"); break;
                case LocalizationLanguages.Norwegian: result.Add("no"); break;
                case LocalizationLanguages.Polish: result.Add("pl"); break;
                case LocalizationLanguages.Portuguese: result.Add("pt"); break;
                case LocalizationLanguages.Romanian: result.Add("ro"); break;
                case LocalizationLanguages.Russian: result.Add("ru"); break;
                case LocalizationLanguages.Slovak: result.Add("sk"); break;
                case LocalizationLanguages.Swedish: result.Add("sv"); break;
                case LocalizationLanguages.Thai: result.Add("th"); break;
                case LocalizationLanguages.Turkish: result.Add("tr"); break;
                case LocalizationLanguages.Chinese: result.Add("zh"); break;
                default: result.Add("en"); break;
            }
        }
        return String.Join(",", result.ToArray());
    }
}
```

I know that looks like a ton of code, _and it **is**_, but it's very very basic code. Unfortunately for me (not you, you can just copy paste this mess into your game), c# doesn't really have anything to help us out here, so I had to type all this out by hand originally.

Now we can create our localization config object using the GameObject menu: **Create -> Game -> Localization -> Config**, and when you open that object in the inspector you should have something that looks similar to the image below.

<img src="/electricnoir/LocalizationConfig.png" />

_In the future, we could build out a UI within our game to allow the user to select an active language from the list of supported languages, but for now I'll leave this as an exercise for you to take care of... unless I happen to build it out before you do, in which case, just keep checking back here I guess..._

We need a component that will be readily available to the rest of our codebase so we can pull the current language, and query for translations against the games list of `LocalizationSet` objects. Thankfully, both of those pieces of data are stored in our `LocalizationConfig`. We'll just need to create an object that will host this data and provide some easy to use methods on top of it.

Enter `LocalizationManager`.

## LocalizationManager and the singleton problem

Unity has a lot of great features but sadly dependency injection is not one of them. There are a bunch frameworks you can use to add it in but personally I've found that they slow things down or make certain Unity features harder to use. For something like accessing our localization data using a singleton pattern perfectly fine. I won't go into all the "controversy" around singletons here it's something you can find pretty easily with some googling. The **tl;dr** on them is that they are great for providing application-wide access to data, but make it easy for your application to become a tightly coupled mess, so tread carefully.

This code will use my own implementation of the pattern, which I've posted as [a GitHub gist](https://gist.github.com/codeimpossible/06dea8032b54165df539789906fefac0) to avoid including more code in this post.


```csharp
public class LocalizationManager : NoirSingleton<LocalizationManager> {
    [SerializeField] private LocalizationConfig _config;

    public string GetValue(LocalizedString localizedString) {
        for (var i = 0; i < _config.LocalizationSets.Count; i++) {
            var set = _config.LocalizationSets[i];
            if (set.name == localizedString.LocalizationSetName) {
                return set.GetItem(localizedString.KeyName).GetValue(_config.CurrentLanguage);
            }
        }
        return null;
    }
}
```

And with this class added to our project we can pull a translation at any time using a `LocalizedString` as our lookup, like so:

```csharp
LocalizationManager.Instance.GetValue(new LocalizedString("LocalizationSetName", "LocalizationKeyName"));
```

We can also update `LocalizedString` to pull directly from the localizations data itself:

```csharp
public string GetValue() {
    return LocalizationManager.Instance.GetValue(this);
}
```

Adding `GetValue()` above will enable us to pull a translation at runtime with very few lines of code, for example we can have our UI use translations automatically.

```csharp
[RequireComponent(typeof(Text))]
public class LocalizedUIText : MonoBehaviour {
    [SerializeField] LocalizedString _localizedText;
    private Text _text;

    private void Awake() => _text = GetComponent<Text>();

    private void Start() => _text.text = _localizedText.GetValue();
}
```

That wraps up part 3, in the next post I'll go over build custom inspectors for some of our localization objects.

Until next time! You can always shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)