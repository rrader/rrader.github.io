---
title: "Hardware UART Monitor: Snooping Serial Traffic with MSP430 LaunchPad"
date: 2015-01-18T21:08:00+02:00
draft: false
tags: ["diy", "hardware", "msp430", "launchpad", "uart", "debugging", "serial"]
---

*Related series articles:*
* [Why You Should Avoid the SIM900A GSM Module](/diy_posts/sim900a-mini-v34-caution/)
* [Connecting MSP430 to SIM900A](/diy_posts/msp430-interfacing-sim900a/)

---

When using UART, for debugging purposes, I needed to monitor what the MSP430 was sending and what the second device (SIM900) was responding with.

For this, you need to remove the MCU from the LaunchPad and connect it independently (for example, on a breadboard).  
And connect the LaunchPad itself to the computer to monitor the UART.

UART connection scheme MSP430 -> Device so that you can see the Device's responses on the computer:

![UART interception circuit using LaunchPad bridge](/images/msp430-uart-monitor/image-01.png)

On the computer, to read from UART I use Serial Monitor in the Energia IDE (any other way to read from a serial port will work).

![Intercepted data in Serial Monitor](/images/msp430-uart-monitor/image-02.png)

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/uart-uart.html).*
