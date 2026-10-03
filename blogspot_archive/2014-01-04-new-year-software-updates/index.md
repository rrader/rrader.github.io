---
title: "Новогодние обновления"
date: 2014-01-04T01:30:00.003+02:00
lastmod: 2014-01-05T13:34:23.677+02:00
original_url: "https://antigluk.blogspot.com/2014/01/new-year-software-updates.html"
tags: ["cliff", "linux", "python", "russian", "virtualenv"]
draft: true
migrated_from: blogspot
---

Всех с новым годом.\
\
С праздником к нам весело прилетели обновления разных программ и пакетов, которые ломают скрипты. С чем столкнулся я:\

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   [![](images/image-01.jpg){border="0" height="320" width="233"}](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieVQS75bPXxsQUbtM3qC0rYlhaQodMiOijJOsB3vn-3gfMlHA-9u2K33PImZMk_lVTYBvJ0mTdQK2C-QnQS8tfhzqHm2Ub8TzgQEsmbrNybcckc7qZmI_jRbJdZjbXVm060-a4YwHydbg/s1600/scary_video_games_by_vashperado-d5hsuay.jpg){imageanchor="1" style="clear: right; margin-bottom: 1em; margin-left: auto; margin-right: auto;"}
                                                                                                                                                                [vashperado (c)](http://vashperado.deviantart.com/art/scary-video-games-332229994){target="_blank"}
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

\
\

### [virtualenv 1.11](https://pypi.python.org/pypi/virtualenv)

Прилетел с поддержкой пакетов типа wheel ([pep-0427](http://www.python.org/dev/peps/pep-0427/)), pip требует для этого типа пакетов setuptools \>=0.8 . Системы с старыми версиями setuptools как CentOS 6 (там 0.6) пролетают.\
\
[Решение:]{.underline}\
Передавать параметр pip install --no-use-wheel virtualenv\
\
\

### [cliff 1.5.2](https://pypi.python.org/pypi/cliff)

Пока что не понял что именно сломали (исправили), но python-neutronclient (клиент Neutron для OpenStack) падает с ошибкой 'ExtensionManager' object does not support item assignment

\
p.s. neutronclient уже исправили

\

### Docker 0.7.3

2014-01-04

Недостаточно обновить пакет, если используете локальный реестр.\
Надо еще перекачать образ docker-registry [http://get.docker.io/images/openstack/docker-registry.tar.gz](http://get.docker.io/images/openstack/docker-registry.tar.gz){target="_blank"}\
И еще там сломан push в реестр - на *некоторые* слои выдает "archive/tar: invalid tar header" - [https://github.com/dotcloud/docker/issues/3434](https://github.com/dotcloud/docker/issues/3434){target="_blank"}\
\

Возможно список будет пополняться
