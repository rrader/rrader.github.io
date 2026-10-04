---
title: "Don't buy SIM900A! SIM900A Mini v3.4 board"
date: 2015-01-15T16:06:00+02:00
draft: false
tags: ["fail", "hardware", "msp430", "sim900", "uart"]
---

[Connecting MSP430 to SIM900A](/diy_posts/msp430-interfacing-sim900a/)  
[UART monitor - observing data transmission over UART](/diy_posts/msp430-uart-monitor/)

I ordered a soldered SIM900A on the *SIM900A Mini v3.4* board, without fully understanding how the SIM900A modification differs from the SIM900. The main difference is that SIM900A operates in a dual-band range, while SIM900 operates in quad-band. It seemed that for Ukraine, dual-band should fit ideally. **But no.**

SIM900A has a **[regional lock](http://www.blog.zapro.dk/?p=368).**  
Here is the list of countries where SIM900A can be used:

| Country | Supported MCC Codes |
|---|---|
| China | 460 |
| India | 404 / 405 |
| Singapore | 525 |
| Malaysia | 502 |
| Thailand | 520 |
| Indonesia | 510 |
| Cambodia | 456 |
| Vietnam | 452 |
| Laos | 457 |
| Myanmar (Burma) | 414 |
| Brunei | 528 |
| Philippines | 515 |
| East Timor | 514 |

I received this piece of hardware:

![SIM900A Mini v3.4 — Front side](/images/sim900a-mini/image-01.jpg)

![SIM900A Mini v3.4 — Back side](/images/sim900a-mini/image-02.jpg)

Played around with the connection for a long time, and when I finally managed to send AT commands, something strange emerged: the device sees networks (`AT+COPS=?` network scan works), sees the SIM card and the carrier. But does not register on the network:

```text
AT+CREG?
+CREG: 1,0
OK

AT+CPIN?
+CPIN: PH-NET PIN
OK
```

After some googling, it turned out that the highlighted response means the device is **locked**.

Therefore, avoid buying SIM900A chips — without the 'A' is better.

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/sim900a-sim900-mini-v34-board.html).*
