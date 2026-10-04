---
title: "Docker-Jenkins-Slave 2.0 (DJS2): Повна ізоляція CI через LXC та Docker"
date: 2015-03-22T15:56:00+02:00
draft: false
tags: ["docker", "jenkins", "devops", "vagrant", "lxc", "containers", "open-source"]
---

Мені часто доводилося збирати RPM-пакети та тестувати код під різні дистрибутиви Linux із різними версіями системних бібліотек. На робочому комп'ютері в мене стояв Arch Linux, а робочі задачі вимагали складання під RHEL/CentOS.

Запуск Jenkins безпосередньо на робочій машині зі спавном Docker-воркерів працював, проте з часом засмічував хостову систему залишковими файлами та шарами образів, які складно вичищати.

![DJS2 Архітектура](/images/docker-jenkins-slave-20-djs2/image-01.png)

У версії **[DJS2 (Docker-Jenkins-Slave 2.0)](https://github.com/rrader/docker-jenkins-slave)** я пішов далі: ізолював весь стек (сам Jenkins-майстер і всі Docker-контейнери воркерів) усередині окремого легкого LXC-контейнера через Vagrant (`vagrant-lxc`). На хостовій машині зберігалася лише папка з робочими завданнями (jobs) Jenkins.

![Швидкий старт DJS2](/images/docker-jenkins-slave-20-djs2/image-02.jpg)

### Як це працювало

Усе, що потрібно на хості — це Linux із підтримкою LXC та встановлений Vagrant:

```bash
vagrant plugin install vagrant-lxc
```

#### Запуск оточення:

```bash
git clone https://github.com/rrader/docker-jenkins-slave.git djs
cd djs
./djs.sh up
```

Скрипт розгортав ізольований інстанс Jenkins (доступний за адресою на зразок `http://10.0.3.74:8080`).

#### Додавання білд-воркерів:

```bash
./djs.sh add centos7-java Luke
```

Команда автоматично завантажувала готовий образ воркера з Docker Hub (`antigluk/jenkins-slave-centos7-java`) і запускала його. Воркер «Luke» миттєво з'являвся в блоці *Build Executor Status* у панелі Jenkins.

- **Репозиторій проєкту:** [github.com/rrader/docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave)

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2015/03/docker-jenkins-slave-20-djs2.html).*
