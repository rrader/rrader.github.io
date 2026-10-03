---
title: "Caching Maven Local Repository in Docker"
date: 2015-03-13T14:10:00.001+02:00
lastmod: 2015-03-13T23:40:57.920+02:00
original_url: "https://antigluk.blogspot.com/2015/03/caching-maven-local-repository-in-docker.html"
tags: ["caching", "docker", "docker jenkins slave", "english", "java", "jenkins", "maven"]
draft: true
migrated_from: blogspot
---

I'm using Docker instances as Jenkins slaves and run my containers like\
\
\# docker run -d --name="Chewbakka" antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"\
\
(actually, I do it using [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave/) )\
\
However, it doesn't make sense to keep maven local repository in every container.\
\
It can be done using [Docker Data Volumes](https://docs.docker.com/userguide/dockervolumes/)\
We can mount host's directory into any directory inside container if we specify **-v** argument like this:\
\
-v /tmp/docker-m2cache:/root/.m2:rw\
\
This will mount host's directory */tmp/docker-m2cache* into container's */root/.m2*\
\
Resulting command will be\
\
\# docker run -d --name="Chewbakka" -v /tmp/docker-m2cache:/root/.m2:rw antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"
