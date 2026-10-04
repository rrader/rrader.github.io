---
title: "Новий CentOS 7 Maven Slave у docker-jenkins-slave"
date: 2015-03-13T23:40:00+02:00
draft: false
tags: ["containers", "docker", "jenkins", "maven", "devops"]
---

> **Серія статей про Docker та Jenkins:**
> 1. [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/uk/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. [Кешування локального репозиторію Maven у Docker](/uk/engineering/caching-maven-local-repository-in-docker/) (2015-03-13)
> 4. **Новий CentOS 7 Maven Slave у docker-jenkins-slave** (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/uk/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

Сьогодні я додав новий шаблон Jenkins-слейва в [docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave) під назвою «centos7-java».

Він базується (дякую, Капітане Очевидність) на CentOS 7 і його мета — збирати Maven-проєкти, тож образ має встановлений Maven.

Це доволі звично. Але головна новина в тому, що новий образ більше не містить жахливого SSH-демона, який порушує філософію Docker щодо запуску одного процесу в контейнері. Тепер `ENTRYPOINT` у контейнері просто запускає сам jar-файл [Swarm](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin):

```dockerfile
ENTRYPOINT ["java", "-jar", "/root/swarm-client.jar", "-master", "http://172.17.42.1:8070", "-mode", "exclusive", "-executors", "1", "-fsroot", "/root"]

CMD ["-labels", "docker-centos7-java", "-name", "Chewbakka"]
```

*Раніше для запуску контейнера-слейва кроки виглядали так:*

1. Запустити контейнер
2. Дізнатися його IP-адресу (`docker inspect`)
3. Підключитися через SSH за допомогою спеціальних ключів, які вже мали бути всередині Docker-образу
4. Запустити Swarm jar (через SSH)

*Недоліки цього підходу:*
1. Неможливо передати опціональні аргументи для Swarm (без редагування скрипту запуску)
2. Це порушує [філософію Docker](http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/)
3. Переускладнений скрипт запуску, який повинен знати IP-адресу контейнера

*Отже, що насправді змінилося:*
1. Можна передавати [аргументи Swarm](https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions) безпосередньо в команду `docker run`
2. Скрипт запуску слейва скоротився до [одного рядка](https://github.com/rrader/docker-jenkins-slave/blob/master/centos7-java/add_slave.sh) без жодної магії з SSH та ключами
3. Скрипт запуску підключає [том для кешування Maven](/uk/engineering/caching-maven-local-repository-in-docker/), щоб ділити спільний локальний репозиторій `.m2` між машинами

### Посилання

- Dockerfile та скрипти: https://github.com/rrader/docker-jenkins-slave/tree/master/centos7-java
- Why you don't need to run SSHd in your Docker containers: http://blog.docker.com/2014/06/why-you-dont-need-to-run-sshd-in-docker/
- Swarm Available Options: https://wiki.jenkins-ci.org/display/JENKINS/Swarm+Plugin#SwarmPlugin-AvailableOptions

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/new-centos-7-maven-slave-in-docker.html).*
