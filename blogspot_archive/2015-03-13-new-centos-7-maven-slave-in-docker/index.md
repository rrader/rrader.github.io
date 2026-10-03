---
title: "New CentOS 7 Maven Slave in docker-jenkins-slave"
date: 2015-03-13T23:40:00.000+02:00
lastmod: 2015-03-13T23:42:34.718+02:00
original_url: "https://antigluk.blogspot.com/2015/03/new-centos-7-maven-slave-in-docker.html"
tags: ["containers", "docker", "docker jenkins slave", "english", "jenkins", "maven"]
draft: true
migrated_from: blogspot
---

Today I pushed new Jenkins' slave template into [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave) named "centos7-java".\
\
It's based (thank you, Captain Obvious) on CentOS 7 and it's purpose is to build Maven projects, so image has maven preinstalled.\
\
It's pretty usual. But the news here is that new image doesn't contain awful SSH daemon that breaks Docker's philosophy to run single process in container. Now ENTRYPOINT in container is just running [Swarm](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin) jar itself:\
\
ENTRYPOINT \["java", "-jar", "/root/swarm-client.jar", "-master", "http://172.17.42.1:8070", "-mode", "exclusive", "-executors", "1", "-fsroot", "/root"\]\
\
CMD \["-labels", "docker-centos7-java", "-name", "Chewbakka"\]\
\
*In order to start slave container previously steps were like this:*\
\
1) Start container\
2) Inspect it's IP\
3) Connect by SSH using special keys that should be already inside Docker image\
4) Run Swarm jar (by ssh)\
\
*Drawbacks of this approach:*\
1) You can't pass optional arguments to swarm (without editing start script)\
2) It violates [Docker's philosophy](http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/)\
3) Overcomplicated start script that has to know container's IP address\
\
*So, what's new really:*\
1) You can pass [Swarm arguments](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions) to "docker run" command itself\
2) Slave start script was reduced to [just one-liner script](https://github.com/rrader/docker-jenkins-slave/blob/master/centos7-java/add_slave.sh) without SSH/keys magic\
3) Start script contains [maven caching volume](http://antigluk.blogspot.com/2015/03/caching-maven-local-repository-in-docker.html) to share ".m2" local repositories between machines\
\

#### Links

Dockerfile and scripts: <https://github.com/rrader/docker-jenkins-slave/tree/master/centos7-java>\
Why you don't need to run SSHd in your Docker containers: <http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/>\
Swarm Available Options: <https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions>
