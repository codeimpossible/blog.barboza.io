---
layout: post
title: "Building my own busy indicator"
tags:
- post
- making-stuff
---

_tl;dr: you can check out [the full project over on its GitHub Repository](https://github.com/codeimpossible/diy-meeting-indicator) complete with setup instructions for the server and client as well as a parts list for the indicator light itself._

When you work from home there is a constant set of questions like "are you in a meeting?", "is it an ok time to chat?", things like that. I've been looking for an excuse to build something with a raspberry pi and so my DIY busy light was born.

At the start, I wasn't super confident in my soldering/crafting abilities so I did some research to see if there was something I could buy. The company I work for uses Zoom for all our meetings but I couldn't find anything that had built-in support for Zoom.

This pretty much forced my hand so I figured I could try building something.

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

![image showing the status light as I was assembling it](/diy-meeting-light/IMG_3318.png)
![the completed status light, mounted just outside my office](/diy-meeting-light/IMG_3332.png)

## Setup

I chose to run raspbian as my OS, just because I've used it before and it's a debian based OS so it's easy to install most software. Installation was super easy thanks to the Mini SD card with NOOBs pre-installed. I just had to connect to wifi and pick my OS.

Since the Unicorn HAT uses python to interface with its led panel, I figured I'd keep the rest of the stack python as well. I've done almost no python development except for re-working scripts or really basic development work so I needed a really easy web server framework.

## Creating the server

I went with [Flask](https://flask.palletsprojects.com/en/1.1.x/) because it looked really easy to setup and configure, which it was! Seriously, the code below is the entire server code for the project!

```python
import os
import json
from flask import Flask
from flask_restful import Api, Resource, reqparse
from unicornhatmini import UnicornHATMini
import time

unicornhatmini = UnicornHATMini()
unicornhatmini.set_brightness(0.1)

data = {}
data['status'] = { 'status': 0 }

data_file = os.path.join(os.path.dirname(__file__), 'data.json')
with open(data_file) as json_file:
    data = json.load(json_file)

app = Flask(__name__)
api = Api(app)

class Color:
    def __init__(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b

def set_status(status):
    color = Color(0, 0, 0)
    if status == 0:
        color = Color(0, 196, 0)
    else:
        color = Color(196, 0, 0)
    unicornhatmini.set_all(color.r, color.g, color.b)
    unicornhatmini.show()
    time.sleep(0.05)

class Status(Resource):
    def get(self):
        return data['status'], 200
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('status')
        args = parser.parse_args()

        record = { 'status': args['status'] }
        data['status'] = record
        status = int(args['status'])
        set_status(status)
        with open('data.json', 'w') as outfile:
            json.dump(data, outfile)
        return record, 200

status = int(data['status']['status'])
set_status(status)

api.add_resource(Status, "/status")
app.run(debug=False)
```

The above code creates a REST-ish service on port `5000`. You can POST a JSON payload to `/status` that looks like the following and it will update the unicorn LED color accordingly (1=Red, 0=Green):

```javascript
{
    "status": 1
}
```

Next up, I needed the service to be accessible on port 80 and I wanted the service to be available on startup. You can checkout the [server README for setup instructions](https://github.com/codeimpossible/diy-meeting-indicator/tree/master/server), I used `systemctl` to create the background service and `nginx` to handle forwarding requests from port 80 to port 5000.

## Getting the meeting status

Once this was all done I just needed to have my machine tell the status light whenever I join or leave a Zoom call. This turned out to not be as obvious as I hoped. I originally thought I could use the Zoom API to handle this, but the personal API doesn't support event notifications for when you join or leave a call. This seems to only be supported on the organization level, and I wasn't able to get that level of access.

So I had to figure out another way to tell when my machine was attending a Zoom call. It turns out that Zoom makes a pretty consistent TCP connection to their backend, I presume for update notifications and updating your client settings - like your avatar, name, etc. But when you join a meeting, the Zoom client initiates a UDP connection to handle the video and voice data.

Bingo. I could use this, along with a [cron](https://en.wikipedia.org/wiki/Cron) task to check every so often and see if I was in a meeting. If there were UDP connections to Zoom servers, then I was in a meeting, otherwise, I was considered available.

```bash
status=$(/usr/sbin/lsof -i | grep zoom.us | grep UDP | /usr/bin/wc -l | xargs)
```

This runs `lsof` which lists open files, but it also lists open network sockets, so I can pass this data off to `grep` to search for UDP connections to Zoom servers. Next I use `wc` to count the number of entries. `xargs` here is a cheeky bash way of trimming whitespace from a value. So, when I'm in a meeting `status` will be set to a value >= 1, when I'm out of a meeting it will be set to 0.

Installing the cron task is pretty easy and the [client script has a `install` option](https://github.com/codeimpossible/diy-meeting-indicator/blob/master/clients/client.sh#L25-L33) which will create everything for you.

The cron runs every minute, checking for the UDP connections and then updating the server which let's anyone know whether I'm in a meeting or not with a quick glance at the indicator by my door.

I loved building this device and figuring out some of the inner workings of zoom to get it working right, you can check out [the full project over on its GitHub Repository](https://github.com/codeimpossible/diy-meeting-indicator).
