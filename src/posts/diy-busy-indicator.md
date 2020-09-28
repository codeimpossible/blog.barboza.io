---
layout: post
title: "Building my own busy indicator"
date: 2020-09-28 03:49
tags:
- post
- making-stuff
---

It all started with me realizing that my office was feeling a bit cramped. I had set it up with my desk situated so that I was facing the door. The room I use for an office isn't incredibly large but my desk is admittedly ridiculously wide; I think it's 6 to 7 feet long. It's monstrous.

Anyway, the office being the size it is and my desk being the size it is has created this very odd "U" pattern that I have to navigate whenever I want to come in or sit down. So I decided to rearrange things to make it feel more open. After the rearrangement my back now faces the doorway, which means my webcam now has a perfect view of the doorway. 

Normally this wouldn't be a problem, since doors are you know, opaque. But whomever built our house decided they wanted to forgo all thoughts of privacy and installed french doors full of glass panes. It gives the office this wonderful "fish bowl" feel.

So with the doors offering no privacy, it is impossible for my wife Tam to walk up to my office without being visible on my webcam - something she's understandably not okay with. We were talking the other day about how to let her know when my webcam was on before she got to the office door and she suggested I build something.

I wasn't as confident in my abilities so I did some research to see if there was something I could buy. The company I work for uses Zoom for all our meetings and I couldn't find anything that had built-in support for zoom. Also the devices I found ranged in price from $40 - $70. Not cheap.

After being unable to find a OOTB solution I figured I could try my hand at building something.

## PI Time

I decided to go with a Raspberry PI because I've used them in the past and they are really easy to get up and running. While choosing which PI to get, I found the [Raspberry PI Zero](https://shop.pimoroni.com/products/raspberry-pi-zero-wh-with-pre-soldered-header) which has a really small form factor and built-in wifi adapter. I was already imagining hanging whatever I built on a wall somewhere so keeping things small and limiting the number of wires going into it would be a big plus.

I did some googling and found some LED panels that looked easy to work with. The best candidate by far was the [Unicorn MINI by Pimoroni](https://shop.pimoroni.com/products/unicorn-hat-mini). It had a pre-soldered header that would slot right into the PI Zero and an opensource python library to interface with the LED.

I bought some other pieces as well, here is the full list:

- [Pimoroni Unicorn HAT Mini](https://shop.pimoroni.com/products/unicorn-hat-mini)
- [Raspberry PI Zero WH, pre-soldered](https://shop.pimoroni.com/products/raspberry-pi-zero-wh-with-pre-soldered-header)
- [16GB Mini SD Card with NOOBS pre-installed](https://www.adafruit.com/product/4266)
- [RPI Power Adapter](https://www.adafruit.com/product/1995)
- [USB Adapter](https://www.adafruit.com/product/1099)
- [Mini HDMI Adapter](https://www.adafruit.com/product/2819)

## Setup

I chose to run raspbian as my OS, just because I've used it before and it's a debian based OS so it's easy to install most software. Installation was super easy thanks to the Mini SD card with NOOBs pre-installed. I just had to connect to wifi and pick my OS.

Since the Unicorn HAT uses python to interface with its led panel, I figured I'd keep the rest of the stack python as well. I've done almost no python development except for re-working scripts or really basic development work so I needed a really easy web server framework.

# Things to add
- pictures
- nginx configuration
- the project code
- the client shell script
- explanation of how the client works