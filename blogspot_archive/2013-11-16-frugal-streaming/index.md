---
title: "Frugal Streaming"
date: 2013-11-16T00:51:00.002+02:00
lastmod: 2013-11-19T08:46:12.016+02:00
original_url: "https://antigluk.blogspot.com/2013/11/frugal-streaming.html"
tags: ["algorithms", "english", "programming"]
draft: true
migrated_from: blogspot
---

Крутая [статья](http://blog.aggregateknowledge.com/2013/09/16/sketch-of-the-day-frugal-streaming/) с... не сразу очевидными алгоритмами. Оно и вправду работает!

\

Quote:\

> Imagine you have a stream of names (“matt”, “timon”, “matt”, “matt”, “rob”, “ben”, …) and you wanted to know if any name appeared in more than half the stream. Boyer and Moore proposed the following:

> count = 0\
> majority = ""\
> for val in stream:\
>     if count == 0:\
>         majority = val\
>         count = 1\
>     elif val == majority:\
>         count += 1\
>     else:\
>         count -= 1\
> print majority if count \> 0 else "no majority!"  

> If you’re anything like me you will go through a few phases: “That can’t work!”, “Wait, that works?!”, “Nah, this data will break that”, “Holy sh\*t that works!!”. If you think about it for a minute you realize that it HAS to work.

> 

<http://blog.aggregateknowledge.com/2013/09/16/sketch-of-the-day-frugal-streaming/>
