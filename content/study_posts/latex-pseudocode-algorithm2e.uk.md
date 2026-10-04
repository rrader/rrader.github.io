---
title: "Оформлення псевдокоду в LaTeX українською"
date: 2014-06-07T22:12:00+03:00
draft: false
tags: ["latex", "algorithms", "pseudocode", "academic"]
---

Для вставлення псевдокоду в латех документи є кілька пакетів, я працював із **algorithm2e**.

Звісно, псевдокод можна вставити як звичайний текст моноширинним шрифтом, але він виглядає набагато краще, коли він оформлений з підсвітлюванням синтаксису.

Я не буду писати як загалом працювати із пакетом **algorithm2e**, тому що в мережі є [детальні](http://en.wikibooks.org/wiki/LaTeX/Algorithms) [інструкції](http://blog.harrix.org/?p=648), [документація](http://blog.harrix.org/wp-content/uploads/2013/04/algorithm2e.pdf), та [інше](https://www.google.com.ua/search?q=algorithm2e+latex+examples).

Для використання пакету в україномовних документах потрібна локалізація для ключових слів та операторів. Викладаю свій переклад (потрібно додати в преамбулу документу):

```latex
\SetKwInput{KwData}{Вхідні параметри}
\SetKwInput{KwResult}{Результат}
\SetKwInput{KwIn}{Вхідні дані}
\SetKwInput{KwOut}{Вихідні дані}
\SetKwIF{If}{ElseIf}{Else}{якщо}{тоді}{інакше\ якщо}{інакше}{кінець\ умови}
\SetKwFor{While}{до\ тих\ пір,\ поки}{виконувати}{кінець\ циклу}
\SetKw{KwTo}{від}
\SetKw{KwRet}{повернути}
\SetKw{Return}{повернути}
\SetKwBlock{Begin}{початок\ блоку}{кінець\ блоку}
\SetKwSwitch{Switch}{Case}{Other}{Перевірити\ значення}{та\ виконати}{варіант}{інакше}{кінець\ варіанту}{кінець\ перевірки\ значень}
\SetKwFor{For}{цикл}{виконувати}{кінець\ циклу}
\SetKwFor{ForEach}{для\ кожного}{виконувати}{кінець\ циклу}
\SetKwRepeat{Repeat}{повторювати}{до\ тих\ пір,\ поки}
\SetAlgorithmName{Алгоритм}{алгоритм}{Список алгоритмів}
```

### Було:

![До локалізації](/images/latex-pseudocode/image-01.png)

### Стало:

![Після локалізації](/images/latex-pseudocode/image-02.png)

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/06/latex.html).*
