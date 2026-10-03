---
title: "Control Hyper-V with Python"
date: 2014-04-18T18:59:00.000+03:00
lastmod: 2014-04-18T18:59:28.410+03:00
original_url: "https://antigluk.blogspot.com/2014/04/control-hyper-v-with-python.html"
tags: ["devops", "english", "hyper-v", "python", "virtualization", "windows"]
draft: true
migrated_from: blogspot
---

Collection of links for writing Hyper-V script to control Hyper-V from Python\
\
To manage Hyper-V machines there's WMI API (in my case I'll use Python WMI. There's also PowerShell version too, obviously)\
\

- Python 2.7 x64 bit 
- [pywin32](http://sourceforge.net/projects/pywin32/files/pywin32/Build%20218/pywin32-218.win-amd64-py2.7.exe/download) - build 218 was latest on publication date
- WMI package - <https://pypi.python.org/pypi/WMI/>  

When Windows 8 came out two versions of API appeared: **root\\virtualization** and **root\\virtualization\\v2**\
\
I think code is the best documentation for API (at least when I wrote my scripts it was much more useful when I found code examples), so without any words, without tl;dr - read code of my scripts.\
\

### Hyper-V WMI Provider Version 1

Namespace: **root\\virtualization**\
My script:\
<https://github.com/rrader/hue-build/blob/master/sandbox/hyperv.py>\
\
MSDN Documentation: <http://msdn.microsoft.com/en-us/library/hh850319%28v=vs.85%29.aspx>\
\
Control Hyper-V VMs with Python - <http://stackoverflow.com/questions/12970303/control-hyper-v-vms-with-python>\
\
Most useful source is Nova (OpenStack) driver for Hyper-V\
<https://github.com/openstack/nova/tree/master/nova/virt/hyperv>\
(all files **without** *v2* suffix).\

### Hyper-V WMI Provider Version 2

Namespace: **root\\virtualization\\v2**\
My script:\
<https://github.com/rrader/hue-build/blob/master/sandbox/hypervv2.py>\
\
Also, most useful source is Nova (OpenStack) driver for Hyper-V\
<https://github.com/openstack/nova/tree/master/nova/virt/hyperv>\
(all files **with** *v2* suffix).\
\
Network operations:\
<https://github.com/petrutlucian94/nova_dev/blob/master/nova/virt/hyperv/networkutilsv2.py>\
\
Attaching a VHD To A VM Using The Hyper-V WMI V2 Namespace - <http://blogs.msdn.com/b/taylorb/archive/2013/08/12/attaching-a-vhd-to-a-vm-using-the-hyper-v-wmi-v2-namespace.aspx>
