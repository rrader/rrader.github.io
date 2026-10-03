---
title: "C-style loops in Bash"
date: 2013-07-04T19:31:00.000+03:00
lastmod: 2013-11-16T11:52:21.141+02:00
original_url: "https://antigluk.blogspot.com/2013/07/c-style-loops-in-bash.html"
tags: ["bash", "english", "linux"]
draft: true
migrated_from: blogspot
---

Just found out it's possible to use C-style loops in bash, for example:\
\
    for ((i=0; i\<10; i++)); do\
      echo \$i;\
    done\
\
General form:\
\
    for (( expr1 ; expr2 ; expr3 )) ; do list ; done\
\
It's extremely useful, and this feature works on bash\>=2.04, so it has to work on most environments.\
\
more info: <http://www.softpanorama.org/Scripting/Shellorama/Control_structures/loops.shtml#C_style_for_loop>\
\
This message on my coderwall:\
<https://coderwall.com/p/fomutw>
