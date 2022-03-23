---
layout: post
title: "float-ing through time"
tags:
  - post
  - programming
  - unity3d
---

I was curious this morning about Unitys [Time.realTimeSinceStartup](https://docs.unity3d.com/ScriptReference/Time-realtimeSinceStartup.html), specifically how much time it would take to overflow the value. Reading the Unity docs says: 

> The real time in seconds since the game started (Read Only).
 
Ok. Well that's not very helpful. It's a `float` so I guess first, I'll check what the max value for a float is in c#. [Microsoft docs](https://docs.microsoft.com/en-us/dotnet/api/system.single.maxvalue?view=net-6.0) say its `3.40282347E+38` ... that seems incredibly big. But, how big? 

Well, let's start doing some quick and dirty math. `$maxValue / 60` will get us the minutes.

<div style="text-align: center">
  <code>3.40282347E+38 / 60 = 5.6713724e+36</code>
</div>

Oh. Uhm, well shit, ok that's still huge. Fine, how about days?


<div style="text-align: center">
  <code>3.40282347E+38 / 60 / 60 / 24 = 3.9384531e+33</code>
</div>

Uhmmmm ok. I'm getting scared. How about centuries?

<div style="text-align: center">
  <code>3.40282347E+38 / 60 / 60 / 24 / 365 / 100 = 1.0790282e+29</code>
</div>

Oh, ok well that's 107,902,820,000,000,000,000,000,000,000 **CENTURIES**...in seconds...
So yeah, that value would overflow if someone left the game running for one hundred seven octillion, nine hundred two septillion, eight hundred twenty sextillion centuries.

<div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/ToMjGpKniGqRNLGBrhu" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/jim-carrey-dumb-and-dumber-so-youre-telling-me-theres-a-chance-ToMjGpKniGqRNLGBrhu">via GIPHY</a></p>
