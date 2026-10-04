---
title: "Using DjangoTemplates Independently"
date: 2015-08-17T16:22:00+03:00
draft: false
tags: ["django", "python", "templates", "programming"]
---

To use and configure DjangoTemplates externally of Django itself, independently of `settings.py` and all other stuff, instead of using `Template` object it's much better to instantiate your own `Engine` with settings (settings are similar to `settings.py`). Example below:

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

This way, you can configure your own engine in the place you need with settings you want (I put custom loader, for example) and even reconfigure it on the fly.

---
*This post was migrated from the old blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/08/using-djangotemplates-independently.html).*
