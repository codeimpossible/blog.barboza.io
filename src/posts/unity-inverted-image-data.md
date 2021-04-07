---
layout: post
title: "Weird inverted image data in Unity"
excerpt: ""
date: 2021-04-07 00:00:00
updatedDate: 2021-04-07 00:00:00
tags:
  - csharp
  - dotnet
  - unity3d
---
I've been working on some pipeline tools this weekend and came across an issue when moving some code out from unity into a netcore project. I have code written to process `*.aseprite` files directly, so I can read their image data without having to generate PNG files, and in Unity I use this code to create textures and sprites for each aseprite file automatically and it works without issue. I started out by porting some of the code from https://github.com/martinhodler/unity-aseprite-importer over into my own project.

I am also converting some of this aseprite code to netcore so I can do some extra processing outside of unity (eventually I'll add it back in, but I have a lot of files to process and don't want to do it all in Unity for the first go around) and I noticed that when I was writing the aseprite image data the images were all vertically inverted.

Now, this doesn't happen when I run the code in Unity and the code that reads the pixel data from the aseprite file is unchanged between the two environments. After thinking it through for a bit and reading through the image data code I found this section:

```csharp
for (int y = cel.Y; y < celYEnd; y++) {
	if (y < 0 || y >= canvasHeight) {
		pixelIndex += cel.Width;
		continue;
	}
	for (int x = cel.X; x < celXEnd; x++) {
		if (x >= 0 && x < canvasWidth) {
			int index = (canvasHeight - 1 - y) * canvasWidth + x;
			colors[index] = cel.RawPixelData[pixelIndex].GetColor();
		}
		++pixelIndex;
	}
}
```

This code is looping through a `Cel` struct within the aseprite file, which is defined as

> A cel (from celluloid) is one image in a specific frame and layer, at a specific xy-coordinate in the canvas.

So it's essentially a sub-region of a layer within a frame inside an aseprite file. It has a offset, in `cel.X` and `cel.Y` and a height and width `celYEnd` and `celXEnd`.

When writing color data to an image, the batch version of `SetPixel()` only accepts a single dimension array of color data, so there is some math done to convert a two dimensional coordinate to a single dimension. Normally, this looks like `I = Y * Height + X` where `X` and `Y` are the pixel coordinates in image space, because `Y` increases as you travel further into the image data.

However, this code is using `int index = (canvasHeight - 1 - y) * canvasWidth + x;` which is almost the same, but it **decreases** `Y` as you travel further into the image data. This was pretty surprising to me, but I confirmed it with the Unity docs: https://docs.unity3d.com/ScriptReference/Texture2D.SetPixels.html

> The colors array is a flattened 2D array, where pixels are laid out left to right, bottom to top (i.e. row after row).

So once again, Unity behaves in a way that is completely unique and how a user might expect by default.
