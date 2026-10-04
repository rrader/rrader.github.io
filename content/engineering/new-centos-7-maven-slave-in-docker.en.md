---
title: "New CentOS 7 Maven Slave in docker-jenkins-slave"
date: 2015-03-13T23:40:00+02:00
draft: false
tags: ["containers", "docker", "jenkins", "maven", "devops"]
---

> **Docker & Jenkins Series:**
> 1. [Using Docker Containers as Jenkins Nodes](/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. [Caching Maven Local Repository in Docker](/engineering/caching-maven-local-repository-in-docker/) (2015-03-13)
> 4. **New CentOS 7 Maven Slave in docker-jenkins-slave** (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

Today I pushed a new Jenkins slave template into [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave) named "centos7-java".

It's based (thank you, Captain Obvious) on CentOS 7 and its purpose is to build Maven projects, so the image has Maven preinstalled.

It's pretty usual. But the news here is that the new image doesn't contain the awful SSH daemon that breaks Docker's philosophy to run a single process in a container. Now `ENTRYPOINT` in the container is just running the [Swarm](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin) jar itself:

```dockerfile
ENTRYPOINT ["java", "-jar", "/root/swarm-client.jar", "-master", "http://172.17.42.1:8070", "-mode", "exclusive", "-executors", "1", "-fsroot", "/root"]

CMD ["-labels", "docker-centos7-java", "-name", "Chewbakka"]
```

*In order to start the slave container, previously the steps were like this:*

1. Start container
2. Inspect its IP
3. Connect by SSH using special keys that should already be inside the Docker image
4. Run Swarm jar (via SSH)

*Drawbacks of this approach:*
1. You can't pass optional arguments to Swarm (without editing the start script)
2. It violates [Docker's philosophy](http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/)
3. Overcomplicated start script that has to know the container's IP address

*So, what's new really:*
1. You can pass [Swarm arguments](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions) directly to the `docker run` command itself
2. The slave start script was reduced to [just a one-liner script](https://github.com/rrader/docker-jenkins-slave/blob/master/centos7-java/add_slave.sh) without SSH/keys magic
3. The start script attaches a [maven caching volume](/engineering/caching-maven-local-repository-in-docker/) to share `.m2` local repositories between machines

### Links

- Dockerfile and scripts: https://github.com/rrader/docker-jenkins-slave/tree/master/centos7-java
- Why you don't need to run SSHd in your Docker containers: http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/
- Swarm Available Options: https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions

---
*This post was migrated from the old blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/new-centos-7-maven-slave-in-docker.html).*
