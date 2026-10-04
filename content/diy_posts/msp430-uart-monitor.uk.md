---
title: "UART-монітор: спостереження за обміном даними через MSP430 LaunchPad"
date: 2015-01-18T21:08:00+02:00
draft: false
tags: ["diy", "hardware", "msp430", "launchpad", "uart", "debugging", "serial"]
---

*Пов'язані статті серії:*
* [Чому не варто купувати GSM-модуль SIM900A](/uk/diy_posts/sim900a-mini-v34-caution/)
* [Підключення MSP430 до SIM900A](/uk/diy_posts/msp430-interfacing-sim900a/)

---

При використанні UART, з метою налагодження, мені було необхідно моніторити, що посилає MSP430 і що відповідає другий пристрій (SIM900).

Для цього необхідно вийняти МК з LaunchPad і підключити незалежно (наприклад, на breadboard).  
А сам LaunchPad підключити до комп'ютера, щоб моніторити UART.

Схема підключення UART MSP430 -> Device так, щоб на комп'ютері можна було бачити відповіді Device:

![Схема підключення UART для моніторингу через LaunchPad](/images/msp430-uart-monitor/image-01.png)

На комп'ютері для читання з UART я користуюся Serial Monitor в IDE Energia (підійде будь-який інший спосіб читати з послідовного порту).

![Виведення перехоплених даних у Serial Monitor](/images/msp430-uart-monitor/image-02.png)

---

*Цей матеріал було перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/uart-uart.html).*
