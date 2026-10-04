---
title: "Security System Keypad on MSP430"
date: 2015-03-05T16:20:00+02:00
draft: false
tags: ["energia", "hardware", "keypad", "msp430", "security"]
---

Зробив інтерфейсну частину охоронної системи.  
Зняття та встановлення охорони буде проводитися за допомогою пароля, тому потрібен спосіб ввести пароль і змінити його.

MSP430G2553 містить флеш-пам'ять, 4 сегменти даних по 64 байти. Там і будемо зберігати пароль.

Також, на випадок забування пароля, необхідний "суперпароль", який буде скидати пам'ять на пароль за замовчуванням.

Для зчитування натискань клавіш із клавіатури необхідно періодично опитувати кожну кнопку. Крім того, треба позбавлятися від брязкоту. Бібліотека для Arduino "Keypad" реалізує захист від брязкоту і вміє опитувати клавіші, а також відмінно підходить для Energia.

### Доступні команди

Аутентифікація: `<пароль>` + **#**  
Скасування вводу: **\***  
Скидання за суперпаролем: `<суперпароль>` + **D**  
Зміна пароля: `<старий пароль>` + **D** + `<новий пароль>` + **D**  

### Відео роботи

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0;">
  <iframe src="https://www.youtube.com/embed/wLLoZa_CDJM" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen title="Security System Keypad on MSP430"></iframe>
</div>

Відео: <https://www.youtube.com/watch?v=wLLoZa_CDJM>  
Бібліотека Keypad: <http://playground.arduino.cc/Code/Keypad>  
Вихідний код: <https://github.com/rrader/msp430-experiments/tree/master/energia/keypad_main>

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/4x4-msp430.html).*
