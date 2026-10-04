---
title: "Використання DjangoTemplates незалежно від Django"
date: 2015-08-17T16:22:00+03:00
draft: false
tags: ["django", "python", "templates", "programming"]
---

Щоб використовувати та налаштовувати DjangoTemplates окремо від самого Django, незалежно від `settings.py` та всього іншого, замість використання об'єкта `Template` набагато краще створити екземпляр власного `Engine` з налаштуваннями (параметри схожі на `settings.py`). Приклад нижче:

```python
from django.template.backends.django import DjangoTemplates

engine = DjangoTemplates(
    {
        'NAME': 'mail',
        'APP_DIRS': False,
        'DIRS': [],
        'OPTIONS': {
            'loaders': [
                'events.loaders.MyLoader',
            ],
        },
    })

template = engine.get_template(template_slug)
rendered = template.render(Context(...))
```

*(Gist: [rrader/602459d44ff8473ad3b3](https://gist.github.com/rrader/602459d44ff8473ad3b3))*

Таким чином ви можете сконфігурувати власний engine у тому місці, де потрібно, з тими параметрами, які вам потрібні (я, наприклад, додав кастомний лоадер), і навіть переналаштовувати його на льоту.

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/08/using-djangotemplates-independently.html).*
