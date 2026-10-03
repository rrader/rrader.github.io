---
title: "sshvbox - interactive SSH access to running VirtualBox machines"
date: 2013-07-05T18:26:00.001+03:00
lastmod: 2014-01-28T14:16:53.835+02:00
original_url: "https://antigluk.blogspot.com/2013/07/sshvbox-interactive-ssh-access-to.html"
tags: ["bash", "english", "virtualization"]
draft: true
migrated_from: blogspot
---

I used to use a lot of running virtual machines simultaneously in VirtualBox.\
Some of them are used for jenkins, others for testing some functionality. Anyway, I always have at least 2, and usually more, machines in running state.\
\
To ease SSH access to them, I configured NAT port forwarding so I need to remember port number.\
\
But keeping in mind all ports is not useful - it would be much more convenient to just choose machine and run inside.\
\
So, using VBoxManage utility I wrote script which works exactly as explained:\
\
    \$ sshvbox\
     1) "CentOS 5" {5f877c2e-14a8-4aee-a467-8d9c369b2aec} \<52222\>\
     2) "SLES11" {c99f57bf-3a70-4c75-afbb-36f60b493865} \<2200\>\
     3) "Hortonworks Sandbox 1.3" {6d0fda26-d42c-4ab2-9838-a02a8ed081c9} \<2222\>\
    select\> 1     \
    root@localhost's password:\
    Last login: Fri Jul  5 13:20:28 2013 from 10.0.2.2\
    \[root@vagrant-centos-5 \~\]#\
\
\
on github: <https://github.com/rrader/sshvbox>
