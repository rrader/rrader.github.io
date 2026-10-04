---
title: "Note: UART monitor - observing transmission over UART"
date: 2015-01-18T21:08:00+02:00
draft: false
tags: ["hardware", "just-for-fun", "msp430", "schematics", "serial", "uart"]
---

[Connecting MSP430 to SIM900](/diy_posts/msp430-interfacing-sim900a/)

When using UART, for debugging purposes, I needed to monitor what the MSP430 sends and what the second device (SIM900) responds.

To do this, you need to remove the MCU from the LaunchPad and connect it independently (for example, on a breadboard).  
And connect the LaunchPad itself to the computer to monitor the UART.

Wiring schematic of UART MSP430 -> Device so that on the computer you can see the Device responses:

![UART monitor wiring schematic](/images/msp430-uart-monitor/image-01.png)

On the computer, to read from UART I use Serial Monitor in the Energia IDE (any other method of reading from the serial port will do).

![Serial Monitor in Energia IDE](/images/msp430-uart-monitor/image-02.png)

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/uart-uart.html).*
