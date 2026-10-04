---
title: "Linked lists in Linux Kernel"
date: 2013-11-15T01:37:00+02:00
draft: false
tags: ["c", "kernel", "linux", "low-level"]
---

The Linux kernel already implements linked lists, so when writing kernel modules there is no need to reinvent the wheel. But the interface is somewhat non-obvious and differs from classical lists. See all operations in `/usr/src/linux-*/include/linux/list.h`.

First, declare a structure for the list head and initialize it:

```c
struct hlist_head inodes;
INIT_HLIST_HEAD(&inodes);
```

Next, declare the structure that will be the elements of this list:

```c
struct ffs_inode_info {
    struct inode vfs_inode;
    struct ffs_fd fd;
    struct hlist_node list_node;
    struct buffer_head *datablock;
};
```

To become part of a linked list, the structure must contain a `struct hlist_node` element. Personally, this confused me a bit at first, because usually linked list elements hold references to elements of their own type.

To add an element (`finode`) to the head of the list (`inodes`):

```c
struct ffs_inode_info *finode;
...
hlist_add_head(&finode->list_node, &inodes);
```

Delete an element from the list:

```c
hlist_del(&finode->list_node);
```

Iterate through all elements of the list (`inodes`) sequentially:

```c
struct hlist_head *head = &inodes;
struct ffs_inode_info *i;

hlist_for_each_entry(i, head, list_node) {
    // some work with 'i' element
}
```

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2013/11/linked-lists-in-linux-kernel.html).*
