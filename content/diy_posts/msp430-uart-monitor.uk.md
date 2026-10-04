---
title: "Замітка: UART-монітор — спостереження за передачею по UART"
date: 2015-01-18T21:08:00+02:00
draft: false
tags: ["hardware", "just-for-fun", "msp430", "schematics", "serial", "uart"]
---

[Підключення MSP430 до SIM900](/uk/diy_posts/msp430-interfacing-sim900a/)

При використанні UART, з метою налагодження, мені було необхідно моніторити що посилає msp430 і що відповідає другий пристрій (sim900).

Для цього необхідно вийняти МК з LaunchPad і підключити незалежно (наприклад, на breadboard).  
А сам LaunchPad підключити до комп'ютера, щоб моніторити UART.

Схема підключення UART MSP430 -> Device так, щоб на комп'ютері можна було бачити відповіді Device:

![Схема підключення UART для моніторингу](/images/msp430-uart-monitor/image-01.png)

На комп'ютері для читання з UART я користуюся Serial Monitor в IDE Energia (підійде будь-який інший спосіб читати з послідовного порту).

![Serial Monitor в IDE Energia](/images/msp430-uart-monitor/image-02.png)

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/uart-uart.html).*
