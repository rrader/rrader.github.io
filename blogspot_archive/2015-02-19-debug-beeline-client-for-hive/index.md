---
title: "Debug Beeline Client for Hive"
date: 2015-02-19T23:08:00.002+02:00
lastmod: 2015-03-13T14:11:09.275+02:00
original_url: "https://antigluk.blogspot.com/2015/02/debug-beeline-client-for-hive.html"
tags: ["beeline", "debug", "english", "hadoop", "hive", "hortonworks", "java", "remote debug"]
draft: true
migrated_from: blogspot
---

Just a note how to enable debug mode in beeline (or any other) Hive client.\
\
To enable remote debugging, we need to pass "-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005" arguments to JVM.\
\
Tricky part is to find the place where JVM is being executed. It's file \$HADOOP_HOME/hive-client/bin/ext/beeline.sh - in Hortonworks (HDP) installation it will be /usr/hdp/current/hive-client/bin/ext/beeline.sh\
\
On the line\
exec \$HADOOP jar \${beelineJarPath} \$CLASS \$HIVE_OPTS "\$@"\
\
but -Xdebug option should be placed to HADOOP_CLIENT_OPTS variable:\
\
export HADOOP_CLIENT_OPTS="\$HADOOP_CLIENT_OPTS -Dlog4j.configuration=beeline-log4j.properties -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"\
 \
\
-Xdebug - enables remote debugging\
-Xrunjdwp - sets configuration properties, where\
[server]{.underline} - start server or try to connect to debugger (usually server=y to do remote debug via Idea)\
[suspend]{.underline} - freeze start of program and wait until debugger connects to it\
[address]{.underline} -  port of server you will connect to\
\
Now if you just start \# beeline\
you'll see that debug server started on port 5005, and you can connect to it via Idea (or whatever).
