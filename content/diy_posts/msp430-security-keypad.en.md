---
title: "MSP430-Based 4×4 Matrix Keypad Controller for Security Alarm"
date: 2015-03-05T16:20:00+02:00
draft: false
tags: ["diy", "hardware", "msp430", "keypad", "security", "energia", "embedded"]
---

*Related series articles:*
* [MSP430 Security Alarm Schematics and Build](/diy_posts/msp430-security-alarm-system/)

---

I built the user-facing interface subsystem for my custom DIY home alarm.

Arming and disarming the system is guarded by a numeric passcode, necessitating a secure mechanism to authenticate, reject invalid entries, and update the PIN on the fly.

## 1. Non-Volatile Passcode Storage in Flash
The **MSP430G2553** MCU features dedicated internal Flash Information Memory divided into four 64-byte segments. The active security PIN is stored directly in this persistent flash block, ensuring the passcode survives total power disconnections.

In case the customized passcode is forgotten, a fallback master "super-password" is hardcoded to reset the flash segment back to factory defaults.

## 2. Matrix Polling & Contact Debouncing
Reading keystrokes from a 4×4 multiplexed keypad requires cyclical row-and-column scanning. Filtering out mechanical contact bounce (debouncing) is essential to avoid ghost digits.

The *Keypad* library provides robust contact debouncing and efficient multiplexed scanning, compiling seamlessly inside the Energia environment.

## 3. Supported Command Sequences

* **Authentication (Arm / Disarm):** `<PIN> + #`
* **Clear Entry Buffer:** `*`
* **Master Reset to Defaults:** `<Master-PIN> + D`
* **Change Passcode:** `<Old-PIN> + D + <New-PIN> + D`

## 4. Video Demonstration

{{< youtube wLLoZa_CDJM >}}

*(Direct video link: [YouTube](https://www.youtube.com/watch?v=wLLoZa_CDJM))*

## Resources & Source Code
* **Source Code Repository:** [github.com/rrader/msp430-experiments/tree/master/energia/keypad_main](https://github.com/rrader/msp430-experiments/tree/master/energia/keypad_main)
* **Keypad Library:** [Arduino Keypad Library Reference](https://playground.arduino.cc/Code/Keypad/)

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/4x4-msp430.html).*
