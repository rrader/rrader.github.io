---
title: "Why You Should Avoid the SIM900A GSM Module: SIM900A Mini v3.4 Board Review"
date: 2015-01-15T16:06:00+02:00
draft: false
tags: ["diy", "hardware", "gsm", "sim900", "fail", "msp430", "uart"]
---

*Related series articles:*
* [Connecting MSP430 to SIM900A](/diy_posts/msp430-interfacing-sim900a/)
* [MSP430-based Hardware UART Monitor](/diy_posts/msp430-uart-monitor/)

---

I ordered a breakout board featuring the **SIM900A Mini v3.4**, without thoroughly researching the architectural differences between the SIM900 and SIM900A hardware revisions.

The main datasheet distinction is that **SIM900** is a quad-band modem (850/900/1800/1900 MHz), while **SIM900A** is dual-band (900/1800 MHz). On paper, dual-band should have been sufficient for European mobile networks. **However, there is a catch.**

The SIM900A module enforces a strict **firmware-level regional lock**.

Here is the list of officially supported territories and Mobile Country Codes (MCC):

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
