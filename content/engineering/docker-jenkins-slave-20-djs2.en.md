---
title: "Docker-Jenkins-Slave 2.0 (DJS2): Fully Isolated Multi-OS CI with LXC and Docker"
date: 2015-03-22T15:56:00+02:00
draft: false
tags: ["docker", "jenkins", "devops", "vagrant", "lxc", "containers", "open-source"]
---

I frequently needed to compile RPMs and test code across multiple Linux distributions with varying library versions. My primary host was Arch Linux, but work tasks required building software targeted at RHEL/CentOS.

Running Jenkins directly on the development host while spawning Docker containers worked, but it quickly cluttered the workstation with intermediate build files, dangling layers, and state that was hard to clean up.

![DJS2 Architecture](/images/docker-jenkins-slave-20-djs2/image-01.png)

In **[DJS2 (Docker-Jenkins-Slave 2.0)](https://github.com/rrader/docker-jenkins-slave)**, I decoupled the entire CI system into an isolated nested LXC container managed by Vagrant (`vagrant-lxc`). Both the Jenkins master and its ephemeral Docker slaves ran inside this sandbox, while only the Jenkins jobs data directory remained mounted on the workstation host.

![DJS2 Quickstart](/images/docker-jenkins-slave-20-djs2/image-02.jpg)

### How It Worked

All that was needed on the host was an LXC-capable Linux kernel and Vagrant:

```bash
vagrant plugin install vagrant-lxc
```

#### Launching the environment:

```bash
git clone https://github.com/rrader/docker-jenkins-slave.git djs
cd djs
./djs.sh up
```

This booted the isolated Jenkins master instance (typically available on an internal IP like `http://10.0.3.74:8080`).

#### Spawning build workers:

```bash
./djs.sh add centos7-java Luke
```

This automatically pulled the prebuilt slave image from Docker Hub (`antigluk/jenkins-slave-centos7-java`) and spun it up. The "Luke" worker immediately registered in the *Build Executor Status* dashboard on Jenkins.

- **Project Repository:** [github.com/rrader/docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave)

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/docker-jenkins-slave-20-djs2.html).*
