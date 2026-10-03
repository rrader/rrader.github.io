---
title: "Linked lists in Linux Kernel"
date: 2013-11-15T01:37:00.001+02:00
lastmod: 2013-11-15T01:52:18.651+02:00
original_url: "https://antigluk.blogspot.com/2013/11/linked-lists-in-linux-kernel.html"
tags: ["c", "kernel", "linux", "low level"]
draft: true
migrated_from: blogspot
---

В ядре linux уже реализованы связные списки, так что при написании модулей ядра не надо писать свои велосипеды. Но интерфейс работы с ними немного неочевиден и отличается от классических списков. См. все операции в /usr/src/linux-\*/include/linux/list.h\
\
Сначала необходимо объявить структуру на голову списка и проинициализировать:\
\
struct hlist_head inodes;\
INIT_HLIST_HEAD(&inodes);\
\
Далее необходимо объявить структуру, которая будет элементами этого списка.\
\
struct ffs_inode_info {\
    struct inode vfs_inode;\
    struct ffs_fd fd;\
    struct hlist_node list_node;\
    struct buffer_head \*datablock;\
};\
\
Чтобы структура могла стать частью связного списка, она должна содержать элемент struct hlist_node. Лично меня это немного сбило с толку поначалу, ведь обычно элементы связного списка хранят ссылки на элементы своего же типа.\
\
Для добавления элемента (finode) в голову списка (inodes):\
\
struct ffs_inode_info \*finode;\
...\
hlist_add_head(&finode-\>list_node, &inodes);\
\
Удалить элемент из списка:\
\
    hlist_del(&finode-\>list_node);\
\
Обойти все элементы списка (inodes) последовательно:\
\
    struct hlist_head \*head = &inodes;\
    struct ffs_inode_info \*i;\
\
    hlist_for_each_entry(i, head, list_node) {\
        // some work with 'i' element\
    }\

\
