---
title: "Vagrant-machine with OpenLDAP"
date: 2013-05-26T18:41:00.000+03:00
lastmod: 2013-07-04T19:43:55.250+03:00
original_url: "https://antigluk.blogspot.com/2013/05/vagrant-machine-with-openldap.html"
tags: ["english", "ldap", "openldap", "vagrant"]
draft: true
migrated_from: blogspot
---

Hi everyone\
\
It could be useful to quickly deploy LDAP server to check configuration of client. For example, for django-auth-ldap.\
\
Below listed configuration with 3 ldif files for authentication: base.ldif, group.ldif, passwd.ldif\
\
\
\$ tree\
.\
├── Vagrantfile\
├── ldif\
│   ├── base.ldif\
│   ├── group.ldif\
│   └── passwd.ldif\
└── manifests\
    └── base.pp\

\
[]{#more}\

\
\

## Vagrant configuration

\
Here **Vagrantfile** for this:\
\
\# -\*- mode: ruby -\*-\
\# vi: set ft=ruby :\
\
Vagrant.configure("2") do \|config\|\
  config.vm.box = "centos"\
\
  config.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/centos-64-x64-vbox4210.box"\
\
  config.vm.network :private_network, ip: "192.168.56.10", adapter: 2\
\
  config.vm.provider :virtualbox do \|vb\|\
    vb.gui = true\
    vb.customize \["modifyvm", :id, "--memory", "256", "--name", "LDAP"\]\
    vb.customize \["modifyvm", :id, "--mouse", "usbtablet"\]\
    vb.customize \["modifyvm", :id, "--cpuexecutioncap", "50", "--cpus", "1"\]\
  end\
\
  config.vm.provision :puppet, :options =\> "--verbose --debug" do \|puppet\|\
    puppet.manifests_path = "manifests"\
    puppet.manifest_file  = "base.pp"\
  end\
\
end\

\

**base.pp**

\

define line(\$file, \$line, \$ensure = 'present') {

    case \$ensure {

        default : { err ( "unknown ensure value \${ensure}" ) }

        present: {

            exec { "/bin/echo '\${line}' \>\> '\${file}'":

                unless =\> "/bin/grep -qFx '\${line}' '\${file}'"

            }

        }

        absent: {

            exec { "/bin/grep -vFx '\${line}' '\${file}' \| /usr/bin/tee '\${file}' \> /dev/null 2\>&1":

              onlyif =\> "/bin/grep -qFx '\${line}' '\${file}'"

            }

\

            \# Use this resource instead if your platform's grep doesn't support -vFx;

            \# note that this command has been known to have problems with lines containing quotes.

            \# exec { "/usr/bin/perl -ni -e 'print unless /\^\\\\Q\${line}\\\\E\\\$/' '\${file}'":

            \#     onlyif =\> "/bin/grep -qFx '\${line}' '\${file}'"

            \# }

        }

    }

}

\

define replace(\$file, \$pattern, \$replacement) {

    exec { "/usr/bin/perl -pi -e 's/\$pattern/\$replacement/' '\$file'":

        onlyif =\> "/usr/bin/perl -ne 'BEGIN { \\\$ret = 1; } \\\$ret = 0 if

/\$pattern/ && ! /\$replacement/ ; END { exit \\\$ret; }' '\$file'",

    }

}

\

\

\

class ldap {

    package {\['openldap-servers', 'openldap-clients', 'openldap', 'migrationtools'\]:

        ensure =\> present,

    }

\

\

    line { rootpw:

        file =\> "/etc/openldap/slapd.d/cn=config/olcDatabase={0}config.ldif",

        line =\> "olcRootPW: 1111",

        require =\> Package\['openldap-servers'\],

        notify =\> Service\['slapd'\],

    }

\

    line { managerpw:

        file =\> "/etc/openldap/slapd.d/cn=config/olcDatabase={2}bdb.ldif",

        line =\> "olcRootPW: 2222",

        require =\> Package\['openldap-servers'\],

        notify =\> Service\['slapd'\],

    }

\

    replace { managersuffix:

        file =\> "/etc/openldap/slapd.d/cn=config/olcDatabase={2}bdb.ldif",

        pattern =\> "olcSuffix: .\*",

        replacement =\> "olcSuffix: dc=example,dc=com",

        require =\> Package\['openldap-servers'\],

        notify =\> Service\['slapd'\],

    }

\

    replace { managerdn:

        file =\> "/etc/openldap/slapd.d/cn=config/olcDatabase={2}bdb.ldif",

        pattern =\> "olcRootDN: .\*",

        replacement =\> "olcRootDN: cn=Manager,dc=example,dc=com",

        require =\> Package\['openldap-servers'\],

        notify =\> Service\['slapd'\],

    }

\

    service {'slapd':

        ensure =\> running,

        require =\> Package\['openldap-servers'\],

    }

\

    exec {'base':

        command =\> '/usr/bin/ldapadd -w 2222 -D "cn=Manager,dc=example,dc=com" -f /vagrant/ldif/base.ldif; true'

    }

\

    exec {'users':

        command =\> '/usr/bin/ldapadd -w 2222 -D "cn=Manager,dc=example,dc=com" -f /vagrant/ldif/passwd.ldif; true'

    }

\

    exec {'groups':

        command =\> '/usr/bin/ldapadd -w 2222 -D "cn=Manager,dc=example,dc=com" -f /vagrant/ldif/group.ldif; true'

    }

\

    service {'iptables':

        ensure =\> stopped,

    }

\

    file {'/etc/sysconfig/network-scripts/ifcfg-eth1':

        ensure =\> file,

        content =\> "DEVICE=eth1\\nBOOTPROTO=dhcp\\nMTU=1500\\nNM_CONTROLLED=yes\\nONBOOT=yes\\nTYPE=Ethernet\\n",

    }

}

\

include ldap

\

\

## **LDIF files**

\

**base.ldif**\
\
dn: dc=example,dc=com\
dc: example\
objectClass: top\
objectClass: domain\
\
dn: ou=People,dc=example,dc=com\
ou: People\
objectClass: top\
objectClass: organizationalUnit\
\
dn: ou=Group,dc=example,dc=com\
ou: Group\
objectClass: top\
objectClass: organizationalUnit\

\

group.ldif

\

dn: cn=users,ou=Group,dc=example,dc=com

objectClass: posixGroup

objectClass: top

cn: users

userPassword: 1111

gidNumber: 1000

memberUid: ldap

\

\

passwd.ldif

\
\
dn: uid=ldap,ou=People,dc=example,dc=com\
uid: ldap\
cn: ldap\
objectClass: account\
objectClass: posixAccount\
objectClass: top\
objectClass: shadowAccount\
userPassword: password\
uidNumber: 1000\
gidNumber: 1000\
homeDirectory: /home/ldap\

\
\
