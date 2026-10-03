---
title: "Enabling Neutron in Devstack 2.0"
date: 2014-01-06T22:52:00.001+02:00
lastmod: 2014-01-06T22:52:39.371+02:00
original_url: "https://antigluk.blogspot.com/2014/01/enabling-neutron-in-devstack-20.html"
tags: ["docker", "english", "linuxbridge", "openstack", "vagrant"]
draft: true
migrated_from: blogspot
---

*Setting up devstack on vagrant machine with Docker hypervisor and Neutron enabled. In this article Neutron will be configured with Linux Bridge plugin.*\

[![](images/image-01.png){border="0"}](images/image-01.png){imageanchor="1" style="clear: right; float: right; margin-bottom: 1em; margin-left: 1em;"}

\
My [previous article](http://antigluk.blogspot.com/2014/01/enabling-neutron-in-devstack.html){target="_blank"} about enabling neutron in devstack didn't take in account that I need to set up virtualbox machine and hypervisor will be Docker. Nova's Docker plugin doesn't work with openvswitch, so I had to turn back to linux bridge.\
\
So, let's configure our machine:\

### Vagrantfile

Vagrantfile should have these lines:\
 config.vm.network :private_network, ip:"172.16.0.201", :netmask =\> "255.255.0.0"\
 config.vm.network :private_network, ip:"10.10.0.201", :netmask =\> "255.255.0.0"\
\
This will configure two host-only interfaces, one for internal network (provider network), second for external (floating IPs).\
\

### localrc

should containe these lines:\
\
\# Use Docker hypervisor for Nova\
VIRT_DRIVER=docker\
\
\# IP of vagrant box (and Horizon)\
HOST_IP=172.16.0.201\
\
\# Networks\
VLAN_INTERFACE=eth1\
FLAT_INTERFACE=eth1\
GUEST_INTERFACE=eth1\
PUBLIC_INTERFACE=eth2\
FIXED_RANGE=172.16.1.0/24\
NETWORK_GATEWAY=172.16.1.1\
FIXED_NETWORK_SIZE=256\
FLOATING_RANGE=10.10.1.0/24\
\
\# Enable Neutron\
enable_service q-svc q-agt q-dhcp q-l3 q-meta q-lbaas neutron\
\
\# Disable Cinder service\
disable_service c-api c-sch c-vol\
\
\# Disable security groups\
Q_USE_SECGROUP=False\
LIBVIRT_FIREWALL_DRIVER=nova.virt.firewall.NoopFirewallDriver\
\
\# neutron linuxbridge\
Q_PLUGIN=linuxbridge\
Q_AGENT=linuxbridge\

\

### Bridge driver

Surely we don't need to replace bridge with brcompat in our case (we don't need OVS at all), so skip this step and leave as is (make sure in localrc you have Q_PLUGIN=linuxbridge)

\

### VirtualBox configuration

Possibly you will need to configure VirtualBox host-only interfaces before spinning up vagrant,  (you can skip this step - interfaces will be created automatically), you can use [this script](https://github.com/futuregrid/vagrant/blob/master/grizzly-devstack/vbox-create-networks.sh){target="_blank"}

\

#!/bin/bash

\

\# Private Network  vboxnet0 (172.16.0.0/16)

VBoxManage hostonlyif create

VBoxManage hostonlyif ipconfig vboxnet0 --ip 172.16.0.254 --netmask 255.255.0.0

\

\# Public Network vboxnet1 (10.10.0.0/16)

VBoxManage hostonlyif create

VBoxManage hostonlyif ipconfig vboxnet1 --ip 10.10.0.1 --netmask 255.255.0.0

\

### Final steps

Build devstack as usual (stack\$ ./stack.sh)

To check all set up ok, go to Horizon interface ([http://172.16.0.201](http://172.16.0.201/){target="_blank"} if you followed this manual) and check if your router (under demo tenant) has two interfaces, private network and gateway.

\

Finally, push some images to registry and spin up instances.

\

Note, that you will no have ability to ping/get to instances from your global namespace, use 

\# ip netns

command to list all namespaces, and use

\# ip netns exec \<namespace id\> \<command\>

Usually, all instances can be accessed from router namespace (qrouter-xxxxx namespace). For example, I have up instance with web server on 8000 port, on 10.10.1.2 .

To access it I can do:

\# ip netns

qlbaas-1cd37d1d-a5c8-4dcc-8c78-4edb550e5159

...

7a078076c5c7dde649f53291ae7d7a9e698a262fe3225153c737b33725af40a1

...

qrouter-0588fbc8-da2e-46b0-a093-0258a702a168

\

\# ip netns exec qrouter-0588fbc8-da2e-46b0-a093-0258a702a168 wget 10.10.1.2

\

Now all seems works, I still have no access to instances from external network though.\
\
\

- To understand how namespaces works, I recommend this article - very well explained: Introducing Linux Network Namespaces: [http://blog.scottlowe.org/2013/09/04/introducing-linux-network-namespaces/](http://blog.scottlowe.org/2013/09/04/introducing-linux-network-namespaces/){target="_blank"}
- Also good examples here [https://code.google.com/p/coreemu/wiki/Namespaces](https://code.google.com/p/coreemu/wiki/Namespaces){target="_blank"}
- Vagrant+Devstack network configuration example: [https://github.com/futuregrid/vagrant](https://github.com/futuregrid/vagrant){target="_blank"}

\
\
