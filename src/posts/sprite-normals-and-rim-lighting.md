---
layout: post
title: "Pipeline update: Normal maps and rim lighting masks for sprites"
excerpt: ""
date: 2021-04-10 00:00:00
updatedDate: 2021-04-10 00:00:00
tags:
  - post
  - aseprite
  - unity3d
---

I updated my aseprite import code to filter out "special" layers and import them differently. Currently it supports `@normal`, `@mask` and `@emission` layers and imports the data there as normal maps, light masks and emission maps respectively. These special layers are imported as secondary textures for the sprite sheet, so they work with the built-in Unity 2D lighting effects:

![o7Jlhwg](https://user-images.githubusercontent.com/176476/113903372-e8207400-979e-11eb-8e4b-6600431e5f76.gif)

And here are the layers within aseprite, there's a gif below of me toggling each layer on/off.
![image](https://user-images.githubusercontent.com/176476/113903048-8b24be00-979e-11eb-8753-44b12790dcc9.png)

![OdeNormalsOnOff](https://user-images.githubusercontent.com/176476/113903217-b7d8d580-979e-11eb-8f92-023935e1622e.gif)

