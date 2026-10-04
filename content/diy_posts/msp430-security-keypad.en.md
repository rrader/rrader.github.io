---
title: "MSP430-Based 4×4 Matrix Keypad Controller for Security Alarm"
date: 2015-03-05T16:20:00+02:00
draft: false
tags: ["diy", "hardware", "msp430", "keypad", "security", "energia", "embedded"]
---

*Related series articles:*
* [MSP430 Security Alarm Schematics and Build](/diy_posts/msp430-security-alarm-system/)

---

Built the interface part of the security system.  
Disarming and arming will be done using a password, so we need a way to enter the password and change it.

The MSP430G2553 contains flash memory, 4 data segments of 64 bytes each. That's where we'll store the password.

Also, in case the password is forgotten, a "super-password" is needed to reset memory back to the default password.

To read key presses from the keypad, each button must be polled periodically. In addition, contact bounce must be eliminated. The Arduino "Keypad" library implements debouncing, knows how to poll keys, and works great with Energia.

### Available commands

* Authentication: `<password>` + **#**
* Cancel input: **\***
* Reset via super-password: `<superpassword>` + **D**
* Change password: `<old password>` + **D** + `<new password>` + **D**

### Demo video

{{< youtube wLLoZa_CDJM >}}

* Video: <https://www.youtube.com/watch?v=wLLoZa_CDJM>
* Keypad library: <http://playground.arduino.cc/Code/Keypad>
* Source code: <https://github.com/rrader/msp430-experiments/tree/master/energia/keypad_main>

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/4x4-msp430.html).*
