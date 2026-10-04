---
title: "Кешування локального репозиторію Maven у Docker"
date: 2015-03-13T14:10:00+02:00
draft: false
tags: ["caching", "docker", "jenkins", "maven", "devops"]
---

> **Серія статей про Docker та Jenkins:**
> 1. [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/uk/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. **Кешування локального репозиторію Maven у Docker** (2015-03-13)
> 4. [Новий CentOS 7 Maven Slave у docker-jenkins-slave](/uk/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/uk/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

Я використовую Docker-інстанси як Jenkins-слейви і запускаю свої контейнери ось так:

```bash
# docker run -d --name="Chewbakka" antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"
```

(насправді я роблю це за допомогою [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave/))

Проте немає жодного сенсу тримати локальний репозиторій Maven у кожному контейнері окремо.

Це можна вирішити за допомогою [Docker Data Volumes](https://docs.docker.com/userguide/dockervolumes/). Ми можемо змонтувати директорію хоста в будь-яку директорію всередині контейнера, якщо вказати аргумент `-v`:

```bash
-v /tmp/docker-m2cache:/root/.m2:rw
```

Це змонтує директорію хоста `/tmp/docker-m2cache` у `/root/.m2` всередині контейнера.

Підсумкова команда буде такою:

```bash
# docker run -d --name="Chewbakka" -v /tmp/docker-m2cache:/root/.m2:rw antigluk/jenkins-slave-centos7-java -labels docker-centos7-java -name "Chewbakka"
```

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/caching-maven-local-repository-in-docker.html).*
