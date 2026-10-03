---
title: "Using DjangoTemplates independently"
date: 2015-08-17T16:22:00.000+03:00
lastmod: 2015-08-17T16:22:17.862+03:00
original_url: "https://antigluk.blogspot.com/2015/08/using-djangotemplates-independently.html"
tags: ["django", "djangotemplates", "programming", "python", "templates"]
draft: true
migrated_from: blogspot
---

To use and configure DjangoTemplate externally of Django itselt, independently of settings.py and all other stuff, instead of using Template object it's much better to instantiate own Engine with settings (settings are similar to settings.py). Example below:\

This way, you can configure your own engine in the place you need with settings you want (I put custom loader, for example) and even reconfigure it on the fly.
