---
title: "Керування Hyper-V за допомогою Python"
date: 2014-04-18T18:59:00+03:00
draft: false
tags: ["devops", "hyper-v", "python", "virtualization", "windows"]
---

Колекція посилань для написання скриптів керування Hyper-V із Python.

Для керування машинами Hyper-V існує WMI API (у моєму випадку я використовую Python WMI; очевидно, є також версія для PowerShell):

- Python 2.7 x64 bit
- [pywin32](http://sourceforge.net/projects/pywin32/files/pywin32/Build%20218/pywin32-218.win-amd64-py2.7.exe/download) — збірка 218 була найновішою на дату публікації
- Пакет WMI — https://pypi.python.org/pypi/WMI/

З виходом Windows 8 з'явилися дві версії API: `root\virtualization` та `root\virtualization\v2`.

Я вважаю, що код — найкраща документація для API (принаймні, коли я писав свої скрипти, приклади коду виявилися значно кориснішими), тому без зайвих слів і tl;dr — дивіться код моїх скриптів.

### Hyper-V WMI Provider Version 1

Namespace: `root\virtualization`

Мій скрипт:
https://github.com/rrader/hue-build/blob/master/sandbox/hyperv.py

- Документація MSDN: http://msdn.microsoft.com/en-us/library/hh850319%28v=vs.85%29.aspx
- Control Hyper-V VMs with Python: http://stackoverflow.com/questions/12970303/control-hyper-v-vms-with-python
- Найкорисніше джерело — драйвер Nova (OpenStack) для Hyper-V:
  https://github.com/openstack/nova/tree/master/nova/virt/hyperv
  (усі файли **без** суфікса `v2`).

### Hyper-V WMI Provider Version 2

Namespace: `root\virtualization\v2`

Мій скрипт:
https://github.com/rrader/hue-build/blob/master/sandbox/hypervv2.py

- Найкорисніше джерело — знову драйвер Nova (OpenStack) для Hyper-V:
  https://github.com/openstack/nova/tree/master/nova/virt/hyperv
  (усі файли **із** суфіксом `v2`).
- Мережеві операції:
  https://github.com/petrutlucian94/nova_dev/blob/master/nova/virt/hyperv/networkutilsv2.py
- Attaching a VHD To A VM Using The Hyper-V WMI V2 Namespace:
  http://blogs.msdn.com/b/taylorb/archive/2013/08/12/attaching-a-vhd-to-a-vm-using-the-hyper-v-wmi-v2-namespace.aspx

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/04/control-hyper-v-with-python.html).*
