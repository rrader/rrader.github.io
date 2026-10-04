---
title: "Docker Jenkins Slave Generator: Dynamic Multi-OS Builds in Containers"
date: 2014-09-02T21:04:00+03:00
draft: false
tags: ["docker", "jenkins", "devops", "ci-cd", "open-source"]
---

When building and testing software across multiple target operating systems (e.g., your Jenkins master runs on Arch Linux, but you need to compile RPMs on CentOS 5/6 or DEBs on Debian 6), running dedicated full virtual machines for each task is an inefficient waste of RAM and CPU. Back in 2014, when Docker was still in its early days, running disposable build slaves inside lightweight containers was a game changer.

![Jenkins Slave Dockerfile Generator](/images/docker-jenkins-slave-generator/image-01.png)

### Docker Jenkins Slave Project

The **[rrader/docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave)** repository contains build recipes and automated swarm discovery for:
- CentOS 5.4 (`docker-centos5`)
- CentOS 6.4 (`docker-centos6`)
- openSUSE 12.1 (`docker-suse12`)
- Debian 6 Squeeze (`docker-squeeze`)

![Distro logos](/images/docker-jenkins-slave-generator/image-02.png)

#### How it worked:

1. Install the **Swarm Plugin** on the Jenkins master (enabling dynamic slave discovery via API).
2. Clone the repository and navigate to the target OS directory:
   ```bash
   git clone https://github.com/rrader/docker-jenkins-slave.git
   cd docker-jenkins-slave/centos6
   sudo bash build.sh
   ```
3. Once the base image is built, spawn any number of worker nodes:
   ```bash
   sudo bash add_slave.sh SlaveName
   ```
4. Assign the appropriate job label in Jenkins, such as `docker-centos6`.

### Dockerfile Web Generator

To avoid writing Dockerfiles manually for every worker configuration, I built an online generator service:
- **Service repository:** [github.com/rrader/docker-jenkins-slave-service](https://github.com/rrader/docker-jenkins-slave-service)

The web app allowed customizing usernames, home paths, credentials, and generated a ready-to-run Dockerfile bundled with the Jenkins Swarm client.

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/09/docker-jenkins-slave-generator.html).*
