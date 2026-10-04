---
title: "Using Docker Containers as Jenkins Nodes"
date: 2013-10-31T09:40:00+02:00
draft: false
tags: ["docker", "jenkins", "linux", "virtualization", "ci-cd", "devops"]
---

This post describes using Docker containers as isolated nodes for continuous integration, in this case Jenkins. For the impatient: [tl;dr repository on GitHub](https://github.com/rrader/docker-jenkins-slave).

To build our project into RPM and DEB packages we use Jenkins, deployed on a dedicated server.

![Distributions](/images/docker-jenkins-nodes/image-01.png)

Initially we built our software solely for CentOS 6. Later we added CentOS 5 support, and discovered that strict shared library dependencies prevented the same binaries from running across different CentOS major versions, requiring separate RPM builds. This was initially solved by spinning up a CentOS 5 VM in VirtualBox. Then support for SUSE was added, followed by Debian.

RAM is finite, and using heavyweight full virtual machines solely for build compilation and packaging is clear overhead. So we decided to migrate our build scripts to Docker.

Using Jenkins for CI, you can connect nodes with required OSs in several ways:
- Rent individual dedicated instances/servers.
- Use traditional hypervisor virtualization (KVM, VirtualBox, etc.).
- Containers (LXC, Docker, jails).

The advantages of containers over VMs are obvious here: memory is shared dynamically on demand, and running multiple containers simultaneously does not drag the host down. On top of that, Docker introduces critical benefits:
- Only the actual build script runs inside the container, whereas a VM runs all background system daemons and services, wasting host resources.
- Cheap and fast creation of isolated sandbox clones for each build.

## Docker as a Jenkins Node

For a Jenkins slave, we need:
1. Java runtime
2. Entrypoint — an SSH server
3. Build tools required by the project

The entrypoint is needed to keep the container process alive and retain filesystem state across the build session. Since Jenkins communicates with slaves over SSH anyway, the SSH daemon serves as our entrypoint.

Docker uses Dockerfiles to define build environments. In the repository **[rrader/docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave)**, build recipes are provided for:
- CentOS 5
- CentOS 6
- SUSE 12
- Debian 6

Pull requests with new OS recipes and script improvements are welcome!

## Build & Usage

Assuming you have Docker and Jenkins installed:

1) Install the [Swarm Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin) in Jenkins (enables slaves to join Jenkins automatically via API).

2) Clone the repo:
```bash
git clone https://github.com/rrader/docker-jenkins-slave.git
cd docker-jenkins-slave
```

3) Enter the target OS folder and build the image:
```bash
cd centos6
sudo bash build.sh
```

4) Once built, you can spawn as many nodes of this type as needed:
```bash
sudo bash add_slave.sh SlaveName
```

The node will appear in Jenkins immediately. To dispatch jobs to it, assign the matching label in job configuration (e.g. `docker-centos6.4`). The complete list of tags is documented in the [Repository Wiki](https://github.com/rrader/docker-jenkins-slave/wiki/Tags).

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2013/10/docker-jenkins.html).*
