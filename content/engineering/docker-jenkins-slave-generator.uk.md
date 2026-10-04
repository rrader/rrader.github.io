---
title: "Docker Jenkins Slave Generator"
date: 2014-09-02T21:04:00+03:00
draft: false
tags: ["continuous-integration", "devops", "docker", "jenkins", "virtualization"]
---

> **Серія статей про Docker та Jenkins:**
> 1. [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. **Docker Jenkins Slave Generator** (2014-09-02)
> 3. [Кешування локального репозиторію Maven у Docker](/uk/engineering/caching-maven-local-repository-in-docker/) (2015-03-13)
> 4. [Новий CentOS 7 Maven Slave у docker-jenkins-slave](/uk/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/uk/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)

tl;dr: Сервіс для генерації Dockerfile для Jenkins-слейвів доступний і працює тут: http://docker-jenkins-slave.herokuapp.com/ .

![Docker Jenkins Slave Generator](/images/docker-jenkins-slave-generator/image-01.png)

## Docker jenkins slave

*Початок історії тут: [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/).*

*Abstract: Якщо ви хочете збирати свій проєкт під різні оточення (наприклад, Jenkins встановлено на Arch Linux, а ви хочете зібрати RPM під CentOS 6) через Jenkins, але не бажаєте використовувати віртуальні машини, що призводить до неефективного витрачання RAM і CPU, використання Docker — чудова ідея.*

У цьому репозиторії: https://github.com/rrader/docker-jenkins-slave зараз доступні правила збірки для:

![Підтримувані дистрибутиви](/images/docker-jenkins-slave-generator/image-02.png)

- CentOS 5
- CentOS 6
- Suse 12
- Debian 6

Передбачається, що у вас уже встановлені Docker та Jenkins.

1) Встановіть Swarm Plugin у ваш Jenkins (він дозволяє слейвам додаватися до Jenkins автоматично через API)

2) `$ git clone git@github.com:rrader/docker-jenkins-slave.git; cd docker-jenkins-slave`

3) Перейдіть у папку з правилами для потрібної системи:
   ```bash
   $ cd centos6
   ```

4) Зберіть образ:
   ```bash
   $ sudo bash build.sh
   ```

Тепер, коли є зібраний образ, ви можете додати скільки завгодно нод цього типу:
```bash
$ sudo bash add_slave.sh SlaveName
```

Після цього призначте мітку (label) для вашої задачі в Jenkins: `docker-<tagname>`. Точні назви тегів для вибраної OS слейва можна подивитися на вікі: https://github.com/rrader/docker-jenkins-slave/wiki/Tags

- centos6 : `centos6.4`
- centos5 : `centos5.4`
- suse12 : `suse12.1`
- squeeze : `debian6`

## Docker jenkins slave Generator

Вийшла початкова версія генератора jenkins slave, його мета — генерувати Dockerfile саме під ваші потреби, із встановленими потрібними пакетами та іншим добром.

Зараз реалізовано лише невелику частину запланованого функціоналу: можна налаштувати username, home directory та паролі для root/user.

Сервіс розгорнуто тут:
http://docker-jenkins-slave.herokuapp.com/

Вихідний код веб-сервісу на GitHub: https://github.com/rrader/docker-jenkins-slave-service

Будь-які пропозиції та пулл-реквести вітаються!

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/09/docker-jenkins-slave-generator.html).*
