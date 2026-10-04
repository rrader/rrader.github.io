---
title: "Підключення мікроконтролера MSP430 до GSM-модуля SIM900A"
date: 2015-01-17T12:58:00+02:00
draft: false
tags: ["diy", "hardware", "msp430", "launchpad", "sim900", "gsm", "uart", "energia"]
---

*Пов'язані статті серії:*
* [Чому не варто купувати GSM-модуль SIM900A (огляд плати)](/uk/diy_posts/sim900a-mini-v34-caution/)
* [UART-монітор на базі MSP430 для налагодження зв'язку](/uk/diy_posts/msp430-uart-monitor/)

---

Про підводні камені плати SIM900A Mini v3.4 [читати тут](/uk/diy_posts/sim900a-mini-v34-caution/).

Схема підключення UART проста: RX в TX, TX в RX.  
Живлення для SIM900A: для запуску мені вистачило живлення 3.3V від LaunchPad'а, але це порушує даташит — необхідно 4V. Тим не менш, все працює.

![Схема підключення MSP430 Launchpad до SIM900A](/images/msp430-sim900a/image-01.png)

Спочатку джампери знаходяться в такому положенні для перетворення UART через MAX232:

![Початкове положення джамперів для MAX232](/images/msp430-sim900a/image-02.jpg)

Але нам не потрібно підключати плату до COM-порту комп'ютера, нам потрібен неперетворений UART-сигнал. Тому перемикаємо джампери так, щоб вони «висіли» на одному піні, а в другий отвір джампера підключаємо кабелі:

![Модифікація джамперів для зняття прямого UART](/images/msp430-sim900a/image-03.jpg)

На картинці: зелений кабель — RX, білий — TX.

### Мінімальна програма для Energia

Задача мінімум — відправляти команду "AT", поки нам не дадуть відповідь "OK". Це означає, що ми синхронізувалися за швидкістю передачі і можемо відправляти більш складні команди.

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

    // Пропуск сміття в буфері
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

  // Успішна синхронізація
  while (1);
}
```

Зібраний тестовий стенд:

![Зібрана схема на макетній платі](/images/msp430-sim900a/image-04.jpg)

---

*Цей матеріал було перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/01/msp430-interfacing-to-sim900a.html).*
