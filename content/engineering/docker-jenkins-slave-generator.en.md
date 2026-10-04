---
title: "Docker Jenkins Slave Generator"
date: 2014-09-02T21:04:00+03:00
draft: false
tags: ["continuous-integration", "devops", "docker", "jenkins", "virtualization"]
---

> **Docker & Jenkins Series:**
> 1. [Using Docker Containers as Jenkins Nodes](/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. **Docker Jenkins Slave Generator** (2014-09-02)
> 3. [Caching Maven Local Repository in Docker](/engineering/caching-maven-local-repository-in-docker/) (2015-03-13)
> 4. [New CentOS 7 Maven Slave in docker-jenkins-slave](/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

tl;dr: Service for generating Dockerfile for Jenkins slaves is up and running here: http://docker-jenkins-slave.herokuapp.com/ .

![Docker Jenkins Slave Generator](/images/docker-jenkins-slave-generator/image-01.png)

## Docker jenkins slave

*The beginning of story is here: [Using Docker Containers as Jenkins Nodes](/engineering/using-docker-containers-as-jenkins-nodes/).*

*Abstract: If you want to build your project on different environments (e.g. Jenkins installed on Arch Linux, and you want to build RPM on CentOS 6) with jenkins, but you don't want to use virtual machines, which is inefficient wasting of RAM and CPU, using Docker is good idea.*

In this repository: https://github.com/rrader/docker-jenkins-slave now present build rules for:

![Supported Distros](/images/docker-jenkins-slave-generator/image-02.png)

- CentOS 5
- CentOS 6
- Suse 12
- Debian 6

It is assumed that you have installed the Docker and Jenkins.

1) Install Swarm Plugin to your Jenkins (it allows slaves to be added to Jenkins automatically using API)

2) `$ git clone git@github.com:rrader/docker-jenkins-slave.git; cd docker-jenkins-slave`

3) Browse to the folder with the rules for the desired system:
   ```bash
   $ cd centos6
   ```

4) Build the image:
   ```bash
   $ sudo bash build.sh
   ```

Now you have the image, you can add as many nodes of this type as you need:
```bash
$ sudo bash add_slave.sh SlaveName
```

After that, assign label for your jenkins job `docker-<tagname>`, exact tagname for chosen slave OS you can see on wiki: https://github.com/rrader/docker-jenkins-slave/wiki/Tags

- centos6 : `centos6.4`
- centos5 : `centos5.4`
- suse12 : `suse12.1`
- squeeze : `debian6`

## Docker jenkins slave Generator

Initial version of jenkins slave generator was released, it's purpose is to generate Dockerfile exactly for your needs, with preinstalled needed packages and other stuff.

Right now only tiny amount of planned functionality implemented, you can customize username, home directory and root/user password.

App is deployed here:
http://docker-jenkins-slave.herokuapp.com/

Source code of web service is on github: https://github.com/rrader/docker-jenkins-slave-service

Any suggestions, pull requests are welcomed!

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/09/docker-jenkins-slave-generator.html).*
