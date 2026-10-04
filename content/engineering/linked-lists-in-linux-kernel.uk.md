---
title: "Linked lists in Linux Kernel"
date: 2013-11-15T01:37:00+02:00
draft: false
tags: ["c", "kernel", "linux", "low-level"]
---

У ядрі Linux уже реалізовані зв'язні списки, тож під час написання модулів ядра не треба писати свої велосипеди. Але інтерфейс роботи з ними дещо неочевидний і відрізняється від класичних списків. Див. усі операції в `/usr/src/linux-*/include/linux/list.h`.

Спочатку необхідно оголосити структуру на голову списку та проініціалізувати:

```c
struct hlist_head inodes;
INIT_HLIST_HEAD(&inodes);
```

Далі необхідно оголосити структуру, яка буде елементами цього списку:

```c
struct ffs_inode_info {
    struct inode vfs_inode;
    struct ffs_fd fd;
    struct hlist_node list_node;
    struct buffer_head *datablock;
};
```

Щоб структура могла стати частиною зв'язного списку, вона повинна містити елемент `struct hlist_node`. Особисто мене це дещо збило з пантелику спочатку, адже зазвичай елементи зв'язного списку зберігають посилання на елементи свого ж типу.

Для додавання елемента (`finode`) у голову списку (`inodes`):

```c
struct ffs_inode_info *finode;
...
hlist_add_head(&finode->list_node, &inodes);
```

Видалити елемент зі списку:

```c
hlist_del(&finode->list_node);
```

Обійти всі елементи списку (`inodes`) послідовно:

```c
struct hlist_head *head = &inodes;
struct ffs_inode_info *i;

hlist_for_each_entry(i, head, list_node) {
    // some work with 'i' element
}
```

---
*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](https://antigluk.blogspot.com/2013/11/linked-lists-in-linux-kernel.html).*
