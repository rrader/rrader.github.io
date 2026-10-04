---
title: "MSP430 Interfacing to SIM900A"
date: 2015-01-17T12:58:00+02:00
draft: false
tags: ["hardware", "launchpad", "msp430", "schematics", "sim900", "uart"]
---

For pitfalls of the SIM900A Mini v3.4 board [read here](/diy_posts/sim900a-mini-v34-caution/).

UART wiring scheme is simple: RX to TX, TX to RX.  
Power supply for SIM900A: for bootup 3.3V from the LaunchPad was sufficient for me, though it violates the datasheet (4V required). Nevertheless, everything works.

![Wiring schematic: MSP430 Launchpad to SIM900A](/images/msp430-sim900a/image-01.png)

Initially jumpers are in this position for UART conversion through MAX232:

![Default factory jumper arrangement for MAX232 RS232 levels](/images/msp430-sim900a/image-02.jpg)

But we don't need to connect the board to a computer COM port, we need the unconverted UART signal. Therefore, we switch the jumpers so they 'hang' on one pin, and plug cables into the second jumper hole:

![Reoriented jumpers for direct TTL UART tapping](/images/msp430-sim900a/image-03.jpg)

In the picture: green cable is RX, white is TX.

### Minimal program for Energia

Task minimum is sending the "AT" command until we receive "OK". This means we synchronized baud rate and can send more complex commands.

```c
int incomingByte = 0;

void setup() {
  Serial.begin(9600);
  pinMode(P1_6, OUTPUT);
  pinMode(P1_7, OUTPUT);
  digitalWrite(P1_6, LOW);
  digitalWrite(P1_7, LOW);
}

int isOK() {
  if (incomingByte == 'O') {
    incomingByte = Serial.read();
    if (incomingByte == 'K') {
      return 1;
    }
  }
  return 0;
}

void loop() {
  boolean ok = false;
  do {
    do {
      digitalWrite(P1_6, HIGH);
      Serial.println("AT");
      digitalWrite(P1_6, LOW);
      delay(500);
    } while (!Serial.available());

    incomingByte = Serial.read();

    // Discard buffer noise
    while (Serial.available() && incomingByte == 255) {
      incomingByte = Serial.read();
    }

    while (Serial.available()) {
      if (isOK()) {
        ok = true;
      } else {
        incomingByte = Serial.read();
      }
    }
  } while (!ok);

  // Sync established
  while (1);
}
```

The completed breadboard test setup:

![Breadboard validation bench](/images/msp430-sim900a/image-04.jpg)

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/msp430-interfacing-to-sim900a.html).*
