---
title: "Enabling Neutron in Devstack"
date: 2014-01-04T12:41:00.001+02:00
lastmod: 2014-01-04T12:44:57.105+02:00
original_url: "https://antigluk.blogspot.com/2014/01/enabling-neutron-in-devstack.html"
tags: ["english", "neutron", "openstack", "openvswitch", "ubuntu"]
draft: true
migrated_from: blogspot
---

To enable Neutron on DevStack (on Ubuntu Precise)\

[![](images/image-01.png){border="0"}](images/image-01.png){imageanchor="1" style="clear: right; float: right; margin-bottom: 1em; margin-left: 1em;"}

\
1) Add to localrc this lines\
\# Enable neutron\
disable_service n-net\
enable_service q-svc\
enable_service q-agt\
enable_service q-dhcp\
enable_service q-l3\
enable_service q-meta\
enable_service q-lbaas\
enable_service neutron\
\
If you don't need LBaaS, remove "enable_service q-lbaas" line.\
\
2) Do this set of commands\
\
    \# https://www.mail-archive.com/openstack@lists.launchpad.net/msg21895.html\
    modprobe -r bridge \|\| true\
    apt-get -y install openvswitch-switch openvswitch-controller openvswitch-brcompat\
    echo "blacklist bridge" \> /etc/modprobe.d/bridge.conf\
    echo "BRCOMPAT=yes" \>\> /etc/default/openvswitch-switch\
\
    \# http://www.brucemartins.com/2013_10_01_archive.html\
    apt-get install -y openvswitch-datapath-source\
    module-assistant auto-install openvswitch-datapath --non-inter --quiet\
    modprobe -r bridge \|\| true\
    service openvswitch-switch restart\

\

3\) Spin up devstack as usual (sudo -u stack ./stack.sh)
