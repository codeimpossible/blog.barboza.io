---
layout: post
title: "Palette swapping"
date: 2021-08-04 00:00:00
tags:
  - post
  - electric-noir
  - unity3d
  - game-development
  - shaders
---

So [previously](/post/enemies-assemble!/) I mentioned that I wanted to build out a palette swap system to allow me to reuse enemy sprites to fill the game up with more enemies without having to create a ton of assets. I'm just one person after all and my time is better spent fixing bugs and making sure the game is fun vs. endlessly turning out color flips of sprites.

## Palette Swapping Theory

So the general idea is that you have a sprite, made up of pixels full of color data. Then you create a palette that contains all the colors in your sprite at various positions in the image. At runtime, instead of reading the color data from the source sprite you read it from the correct position within the palette. Sounds easy enough right? Ha. Not really.

I found a lot of blogs written on palette swapping, but they all seemed to be way too complicated or would require a lot of pipeline changes on my end.

My main goal was to be able to keep the sprites as they were. No color manipulation and no pipeline changes to replace the color data with a palette map. Here's a break down of the system I ended up with.

<img src="/electricnoir/palette-swap-process.png" />

Each enemy can be assigned a palette map texture, which looks a bit like the enemy sprite, except that it only has RED and GREEN color data in each pixel. The red and green color values map to x and y offsets in the palette. You can see the full array of palette positions to colors in the upper right-hand corner of the image above. This system gives me 16x16 or 256 possible colors for my palettes, which means I shouldn't have to worry about running out of colors.

Now I just needed to create a shader that processes the map texture and performs a lookup in a given palette texture. I've posted the [full shader code on GitHub](http://github.com/troublecatstudios/palettizer) so I'll just cover the fragment function here.

```cpp
float4 frag(v2f IN) : SV_Target
{
    
    // sample the main texture... pretty standard stuff
    float4 mainTex = tex2D(_MainTex, IN.uv);

    // MapTex is a basic Texture2D you might
    // want to change this to a [PerRendererData] 
    // and assign via MaterialPropertyBlock
    float4 mapTex = tex2D(_MapTex, IN.uv);

    // scale up the RED (x) and GREEN (y) values from the color
    int x = round(mapTex.x * 255) / 8;
    int y = round(mapTex.y * 255) / 8;
    
    // convert the values to their respective index within the palette
    x -= 1;
    y -= 1;

    // convert the color values into texture space coords
    float2 uv = float2(x * _PaletteTex_TexelSize.x, y * _PaletteTex_TexelSize.y);

    // PaletteTex is a basic Texture2D you might
    // want to change this to a [PerRendererData] 
    // and assign via MaterialPropertyBlock
    float4 palette = tex2D(_PaletteTex, uv);  // read the palette color value

    float4 c;
    c.rgb = palette.rgb;
    c.a = mainTex.a * palette.a; // palette alpha overrides the main texture alpha
                                    // useful if you want to hide parts of your sprite

    // PaletteEnabled is a [MaterialToggle] float
    // you might want to change this to a 
    // [PerRendererData] and assign via MaterialPropertyBlock
    // if its not set, fallback to the main texture data
    if (PaletteEnabled == 0.0) {
        c.rgb = mainTex.rgb;
        c.a = mainTex.a;
    }

    // ShowMap is a [MaterialToggle] float
    // if its set, then show the map data instead
    if (ShowMap == 1.0) {
        c.rg = mapTex.xy;
        c.b = 0;
        return c;
    }

    return c;
}
```

## Gotchas

Since the shader is expecting specific RGB values from the map, make sure your map image is configured to be in linear color space:

- Select your texture asset and make sure *sRGB (Color Texture)* is **unchecked**. 

This will make sure that colors sampled via the texture in your shader return the color values you are expecting. You can read more about [linear vs gamma color space on this Unity Forum thread](https://forum.unity.com/threads/confusion-about-gamma-vs-linear.496053/).

The end result is that I can now swap out character styles by changing which palette they use!

<img src="/electricnoir/PaletteSwapping.gif" />

Hopefully that shed some light on how palette swapping can be done and as always, shoot me your thoughts on [twitter.](https://www.twitter.com/codeimpossible)