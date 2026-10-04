---
title: "zk_phone — Programming a Payphone on Raspberry Pi"
date: 2017-09-14T10:12:42Z
draft: false
tags: ["diy", "hardware", "raspberry-pi", "python", "retro"]
---

**zk_phone** is a pet project of programming a physical payphone using a Raspberry Pi and Python.

* **Source Code:** [github.com/rrader/zk_phone](https://github.com/rrader/zk_phone)
* **Hardware:** Payphone chassis, Raspberry Pi, HD44780 character LCD, matrix keypad, hook switch (reed switch)

![zk_phone Payphone](/images/zk_phone/phone1.jpg)

---

## 1. How the Logic Works

The software is written in Python and structured around a simple state machine in `zk_phone/app.py`.

### State 1: Handset on Hook (`HandsetPut`)
* The LCD displays a greeting: `Hello!`.
* Service keypad codes are available while on hook:
  * `*1#` — prints the local IP addresses of the Raspberry Pi to the LCD.
  * `*7#` — queries an internal stats API and displays the current Zakupki.Prom release version.

### State 2: Handset Lifted (`HandsetRaised`)
* Lifting the handset triggers the reed hook switch.
* A text-to-speech synthesizer speaks into the earpiece: *"Hello. Type station number and hash"*.
* The LCD prompts: `Station and #`.
* The user dials a station number followed by `#`:
  * `1#` — Radio ROKS (`http://www.radioroks.ua/RadioROKS.m3u`)
  * `2#` — Lounge FM (`http://cast.loungefm.com.ua:8000/loungefm.m3u`)
* A background `mplayer` process starts streaming the chosen radio station straight into the handset earpiece, while the LCD displays `Playing <number>`.

### State 3: Handset Hung Up
* As soon as the handset is returned to the cradle, audio playback is terminated immediately (`player.kill()`).
* The LCD displays `Thank you!`, and the system resets back to idle mode.
