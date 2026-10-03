---
title: "Заметкопост: апгрейд до Apache 2.4 на Debian Wheezy"
date: 2015-01-11T04:38:00.001+02:00
lastmod: 2015-01-16T18:42:29.912+02:00
original_url: "https://antigluk.blogspot.com/2015/01/apache-debian-wheezy.html"
tags: ["apache", "debian", "devops", "httpd", "linux", "notes", "russian"]
draft: true
migrated_from: blogspot
---

На Debian Wheezy (stable) по дефолту идет Apache 2.2. В моем случае мне понадобился mod_auth_form, который присутствует в 2.4+ версиях.\
\
Эта версия есть в jessy (testing) репозитории, который, на самом деле, вполне стабильный.\
\
1) Добавляем testing репозиторий в sources.list\
\# echo "deb http://ftp.debian.org/debian testing main" \>\> /etc/apt/sources.list\
В моем случае, содержимое стало таким:\
\# cat /etc/apt/sources.list\
deb http://ftp.debian.org/debian wheezy main contrib non-free\
deb http://security.debian.org wheezy/updates main contrib non-free\
deb http://ftp.debian.org/debian testing main\
\
[]{#more}\
\
Далее, обновляем apache:\
2)\
\# apt-get update\
\# apt-get install --only-upgrade apache2\
\
3) Желательно убрать testing из /etc/apt/sources.list, чтоб не обновить ничего лишнего при апгрейде системы\
\
4) Перезапускаем, смотрим какие выдает ошибки (2.2 и 2.4 имеют отличия в названиях директив конфигурационных файлов)\
\# service apache2 restart\
\
Исправляем ошибки, и\
5) Finally, \# service apache2 restart\
\
Всё должно работать.\
\
P.S. Включение mod_auth_form:\
\# a2enmod session\
\# a2enmod session_cookie\
\# a2enmod auth_form\
\
Использование mod_auth_form: <http://melandri.net/2012/04/29/using-apache-mod-auth-form/>
