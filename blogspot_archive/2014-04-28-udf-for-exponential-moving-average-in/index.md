---
title: "UDF for Exponential moving average in Pig Latin"
date: 2014-04-28T17:58:00.002+03:00
lastmod: 2014-04-30T08:54:12.880+03:00
original_url: "https://antigluk.blogspot.com/2014/04/udf-for-exponential-moving-average-in.html"
tags: ["big data", "english", "hadoop", "pig", "programming", "statistics"]
draft: true
migrated_from: blogspot
---

\
Today I faced with the fact that there's no native way to calculate moving average in Pig.\

[![](images/image-01.gif){border="0"}](images/image-01.gif){imageanchor="1" style="clear: right; float: right; margin-bottom: 1em; margin-left: 1em;"}

\
For example:\
\
A = {(5, 1), (2, 2), (7, 3), (4, 4)}\
And we need to calculate [EMA](http://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average) of first field, with weight of second field. alpha=0.5.\
\
ema(A) = (5\*1 + 2\*0.5 + 7\*0.25 + 4\*0.125) / (1 + 0.5 + 0.25 + 0.125) = 4.4\
\
In Pig and Python UDF it will be like this:\
\
REGISTER 'python_udf.py' USING jython AS myfuncs;\
\
B = GROUP A ALL;\
C = FOREACH times {\
    GENERATE A as src,\
             myfuncs.EMA(A, 1, 3, 0.5) as ema;\
}\
\
DUMP C;\
\
UDF:\
\
\@outputSchema("value:double")\
def EMA(D, weight_field, wmax, alpha):\
    """\
    Calculates exponential moving average\
    note: weights are reversed!\
    """\
    weights = \[x for x in range(1, wmax+1)\]\
    weights_values = {}\
    wv = 1.0\
    for w in weights:\
        weights_values\[w\] = wv\
        wv \*= alpha\
    denom = sum(weights_values.values())\
    numer = 0.0\
    for weight in weights:\
        numer += sum(1 for x in D if x\[weight_field\] == weight)\*weights_values\[weight\]\
    return numer/denom\
\
Pretty straightforward, but it works. If you know more elegant way, please share it!\
\
