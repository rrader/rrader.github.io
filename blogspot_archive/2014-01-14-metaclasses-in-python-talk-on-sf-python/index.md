---
title: "Metaclasses in Python (talk on SF Python)"
date: 2014-01-14T22:16:00.000+02:00
lastmod: 2014-01-14T22:20:58.546+02:00
original_url: "https://antigluk.blogspot.com/2014/01/metaclasses-in-python-talk-on-sf-python.html"
tags: ["english", "python", "talk", "video"]
draft: true
migrated_from: blogspot
---

Interesting talk by [Jess Hamrick](http://www.jesshamrick.com/) that helps to put in order knowledge about metaclasses\
\
\

\
\
In questions there was one interesting note about how methods in Python are stored.\
So, after instantiating class, every function becomes a method.\
Method of class *is object (everything is object in Python :) )* that is callable and has special useful attributes (not all listed here):\

- im_func is the function object - it's actually original function
- im_self is the class instance object
- im_class is the class of im_self

Obviously, more details can be found in docs [http://docs.python.org/2/reference/datamodel.html](http://docs.python.org/2/reference/datamodel.html){target="_blank"}.
