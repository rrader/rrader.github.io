---
title: "Елегантний спосіб отримати об'єкт дескриптора в Python"
date: 2014-02-10T23:22:00+02:00
draft: false
tags: ["python", "programming"]
---

![Python](/images/neat-way-to-get-descriptor-object/image-01.jpg)
*(c) [zaper3095](http://zaper3095.deviantart.com/art/Python-182991031)*

Сьогодні на роботі виникло цікаве питання:
Цитата зі StackOverflow:

> У Python 3:
>
> ```python
> class A(object):
>     attr = SomeDescriptor()
>     ...
>     def somewhere(self):
>         # need to check is type of self.attr is SomeDescriptor()
>         desc = self.__class__.__dict__[attr_name]
>         return isinstance(desc, SomeDescriptor)
> ```
>
> Чи є кращий спосіб це зробити? Мені не дуже подобається ця штука з `self.__class__.__dict__`

Коротко кажучи, відповідь — **НІ**. Немає іншого способу отримати об'єкт дескриптора (без виклику `__get__`), крім як дістати його з `__dict__`.

**Проте**, є кілька обхідних шляхів ;)

### 1) Повертати self у `__get__`, якщо instance дорівнює None

Повертати `self` у методі `__get__`, якщо `instance` є `None` (це відбувається, якщо викликати `getattr` на об'єкті класу, тобто `type(self)`):

```python
class SomeDescriptor():
    def __get__(self, inst, instcls):
        if inst is None:
            # instance attribute accessed on class, return self
            return self
        return 4

class A():
    attr = SomeDescriptor()
    def somewhere(self):
        attr_name = 'attr'
        desc  = getattr(type(self), attr_name)
        # desc = self.__class__.__dict__[attr_name]  # b.somewhere() would raise KeyError
        return isinstance(desc, SomeDescriptor)
```

### 2) Призначити атрибут на функцію, яку повертає дескриптор

Друге рішення запропонував мій колега Максим Панібратенко:
Оскільки наш дескриптор є callable, і `__get__` повертає функцію, ми можемо призначити атрибут цій функції та перевіряти під час виконання, чи має функція цей атрибут за допомогою `hasattr()`:

```python
class SomeDescriptor():
    def __get__(self, inst, instcls):
        def func():
            pass
        func.implemented = True
        return func

class A():
    attr = SomeDescriptor()
    def somewhere(self):
        attr_name = 'attr'
        desc  = getattr(self, attr_name)
        return hasattr(desc, 'implemented')
```

Посилання на повне обговорення:
http://stackoverflow.com/questions/21629397/neat-way-to-get-descriptor-object

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/02/neat-way-to-get-descriptor-object.html).*
