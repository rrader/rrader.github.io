---
title: "Caching Maven Local Repository in Docker"
date: 2015-03-13T14:10:00+02:00
draft: false
tags: ["caching", "docker", "jenkins", "maven", "devops"]
---

> **Docker & Jenkins Series:**
> 1. [Using Docker Containers as Jenkins Nodes](/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. **Caching Maven Local Repository in Docker** (2015-03-13)
> 4. [New CentOS 7 Maven Slave in docker-jenkins-slave](/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

I'm using Docker instances as Jenkins slaves and run my containers like:

```bash
# docker run -d --name="Chewbakka" antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"
```

(actually, I do it using [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave/))

However, it doesn't make sense to keep maven local repository in every container.

It can be done using [Docker Data Volumes](https://docs.docker.com/userguide/dockervolumes/). We can mount a host directory into any directory inside the container by specifying the `-v` argument like this:

```bash
-v /tmp/docker-m2cache:/root/.m2:rw
```

This will mount host's directory `/tmp/docker-m2cache` into container's `/root/.m2`.

Resulting command will be:

```bash
# docker run -d --name="Chewbakka" -v /tmp/docker-m2cache:/root/.m2:rw antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"
```

---
*This post was migrated from the old blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/caching-maven-local-repository-in-docker.html).*
