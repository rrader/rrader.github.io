---
title: "Docker Jenkins Slave Generator: динамічні збірки в контейнерах"
date: 2014-09-02T21:04:00+03:00
draft: false
tags: ["docker", "jenkins", "devops", "ci-cd", "open-source"]
---

Якщо потрібно збирати та тестувати проєкти під різними цільовими дистрибутивами (наприклад, хост із Jenkins працює на Arch Linux, а потрібно зібрати RPM-пакети під CentOS 5/6 або DEB під Debian 6), підіймати під кожну задачу окрему важку віртуальну машину — це неефективна витрата пам'яті та процесорного часу. У 2014 році, коли Docker тільки набирав обертів, чудовим рішенням став запуск білд-воркерів Jenkins у легких Docker-контейнерах.

![Генератор Dockerfile для Jenkins Slave](/images/docker-jenkins-slave-generator/image-01.png)

### Проєкт Docker Jenkins Slave

У репозиторії **[rrader/docker-jenkins-slave](https://github.com/rrader/docker-jenkins-slave)** реалізовано правила збірки та автоматичного підключення воркерів для:
- CentOS 5.4 (`docker-centos5`)
- CentOS 6.4 (`docker-centos6`)
- openSUSE 12.1 (`docker-suse12`)
- Debian 6 Squeeze (`docker-squeeze`)

![Логотипи дистрибутивів](/images/docker-jenkins-slave-generator/image-02.png)

#### Як це працювало:

1. На Jenkins-сервер встановлюється **Swarm Plugin** (дозволяє агентам автоматично реєструватися на мастері через API).
2. Клонуємо репозиторій та переходимо до потрібного оточення:
   ```bash
   git clone https://github.com/rrader/docker-jenkins-slave.git
   cd docker-jenkins-slave/centos6
   sudo bash build.sh
   ```
3. Після створення базового образу можна запускати скільки завгодно ізольованих воркерів:
   ```bash
   sudo bash add_slave.sh SlaveName
   ```
4. У конфігурації задачі в Jenkins вказується відповідна мітка (label), наприклад `docker-centos6`.

### Веб-генератор Dockerfile

Щоб не писати Dockerfile під кожного воркера вручну, я випустив першу версію веб-сервісу генерації маніфестів:
- **Вихідний код веб-сервісу:** [github.com/rrader/docker-jenkins-slave-service](https://github.com/rrader/docker-jenkins-slave-service)

Сервіс дозволяв у пару кліків сконфігурувати ім'я користувача, домашню директорію, паролі та згенерувати готовий до запуску Dockerfile із налаштованим Jenkins Swarm клієнтом.

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/09/docker-jenkins-slave-generator.html).*
