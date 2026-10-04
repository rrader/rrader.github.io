---
title: "Security System Keypad on MSP430"
date: 2015-03-05T16:20:00+02:00
draft: false
tags: ["energia", "hardware", "keypad", "msp430", "security"]
---

Built the interface part of the security system.  
Arming and disarming will be done using a password, so a way to enter and change the password is needed.

The MSP430G2553 has flash memory, 4 data segments of 64 bytes each. That's where we'll store the password.

Also, in case the password is forgotten, a "super password" is required to reset memory to the default password.

To read keypresses from the keypad, each button must be polled periodically. Additionally, contact debounce must be eliminated. The "Keypad" library for Arduino implements debounce protection, handles keypad scanning, and works great with Energia.

### Available commands

Authentication: `<password>` + **#**  
Cancel input: **\***  
Super password reset: `<superpassword>` + **D**  
Password change: `<old password>` + **D** + `<new password>` + **D**  

### Video in action

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0;">
  <iframe src="https://www.youtube.com/embed/wLLoZa_CDJM" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen title="Security System Keypad on MSP430"></iframe>
</div>

Video: <https://www.youtube.com/watch?v=wLLoZa_CDJM>  
Keypad library: <http://playground.arduino.cc/Code/Keypad>  
Source code: <https://github.com/rrader/msp430-experiments/tree/master/energia/keypad_main>

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/4x4-msp430.html).*
