---
title: "Neat way to get descriptor object"
date: 2014-02-10T23:22:00.002+02:00
lastmod: 2014-02-10T23:40:56.185+02:00
original_url: "https://antigluk.blogspot.com/2014/02/neat-way-to-get-descriptor-object.html"
tags: ["english", "python"]
draft: true
migrated_from: blogspot
---

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   [![](images/image-01.jpg){border="0" height="180" width="200"}](images/image-01.jpg){imageanchor="1" style="clear: right; margin-bottom: 1em; margin-left: auto; margin-right: auto;"}
                                                          \(c\) [zaper3095](http://zaper3095.deviantart.com/art/Python-182991031)
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

\
Interesting question appeared today on my job:\
Quoting from StackOverflow\
\

> In Python 3\
>
> ``` {.lang-py .prettyprint .prettyprinted}
> class A(object):
>     attr = SomeDescriptor()
>     ...
>     def somewhere(self):
>         # need to check is type of self.attr is SomeDescriptor()
>         desc = self.__class__.__dict__[attr_name]
>         return isinstance(desc, SomeDescriptor)
> ```
>
> Is there better way to do it? I don't like this `self.__class__.__dict__` stuff

\
Shortly, the answer is **NO**. No other way to get descriptor object (preventing \_\_get\_\_ being invoked) than getting it from \_\_dict\_\_.\
\
**However**, there are several workarounds ;)\
\
1) Return self in \_\_get\_\_ method if instance is None (it will happen if call getattr on class object like type(self))\
Like this:\
\

> ``` {.lang-py .prettyprint .prettyprinted}
> class SomeDescriptor():
>     def __get__(self, inst, instcls):
>         if inst is None:
>             # instance attribute accessed on class, return self
>             return self
>         return 4
>
> class A():
>     attr = SomeDescriptor()
>     def somewhere(self):
>         attr_name = 'attr'
>         desc  = getattr(type(self), attr_name)
>         # desc = self.__class__.__dict__[attr_name]  # b.somewhere() would raise KeyError
>         return isinstance(desc, SomeDescriptor)
> ```

2\) Second solution came from my colleague Maksym Panibratenko\
Since our descriptor is callable, and \_\_get\_\_ returns function, we can assign attribute on this function, and check in runtime is function has this attribute with hasattr()\
\

``` {.lang-py .prettyprint .prettyprinted}
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

\
<http://stackoverflow.com/questions/21629397/neat-way-to-get-descriptor-object>\
Follow link to see full discussion
