---
title: "Linked Lists in Linux Kernel"
date: 2013-11-15T01:37:00+02:00
draft: false
tags: ["c", "kernel", "linux", "low-level", "algorithms"]
---

The Linux kernel already implements generic linked list data structures, so when writing kernel modules or drivers there is no need to reinvent the wheel. However, the interface can be somewhat counterintuitive if you come from classical CS textbooks. All operations can be found in `include/linux/list.h`.

In typical algorithms coursework, a generic list node points to payload data (`node->data = payload`). The Linux kernel turns this upside down: the list node structure (`struct hlist_node` or `struct list_head`) is embedded directly **inside** your own data structure. Using the `container_of` macro (which computes memory offsets using `offsetof`), the kernel recovers the parent struct pointer without any separate dynamic memory allocations for wrapper nodes.

First, declare and initialize the list head (for hash lists, `hlist`):

```c
struct hlist_head inodes;
INIT_HLIST_HEAD(&inodes);
```

Next, define the struct that will be an element of this list:

```c
struct ffs_inode_info {
    struct inode vfs_inode;
    struct ffs_fd fd;
    struct hlist_node list_node;
    struct buffer_head *datablock;
};
```

To become part of the linked list, the struct must contain an embedded `struct hlist_node`. This can be confusing at first, as one typically expects list nodes to point to instances of their own type.

### Adding an element to the head

```c
struct ffs_inode_info *finode;
/* ... allocate and populate finode ... */

hlist_add_head(&finode->list_node, &inodes);
```

### Removing an element from the list

```c
hlist_del(&finode->list_node);
```

### Iterating through the list

To traverse all entries in the list, use the `hlist_for_each_entry` macro:

```c
struct hlist_head *head = &inodes;
struct ffs_inode_info *i;

hlist_for_each_entry(i, head, list_node) {
    /* work with 'i' */
}
```

This intrusive list design yields great cache locality and completely eliminates separate allocation overhead for list management.

---
*Migrated from legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2013/11/linked-lists-in-linux-kernel.html).*
