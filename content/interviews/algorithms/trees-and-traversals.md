---
type: pattern
title: Trees and traversals
sidebar_position: 11
group: Algorithms
summary: Almost every tree problem is one of four traversals, and choosing the right one is usually the entire solution.
defines: [preorder, inorder, postorder, level-order, binary search tree, tree height, balanced tree]
razors: []
prereq: [complexity]
---

## The model

A tree is a structure where each node has children and no cycles. Almost every question about
one reduces to visiting every node in a particular order.

There are four orders worth knowing, and the choice is not stylistic. **Preorder** processes a
node before its children so it builds top-down, while **postorder** processes children first
and computes bottom-up.

**Inorder** on a **binary search tree** yields sorted values, and **level-order** visits by
depth. Picking the wrong one turns an easy problem into an awkward one.

## Recognise it

The traversal follows from what the problem needs:

- **Postorder** when a node's answer depends on its children — height, diameter, "is this
  balanced", subtree sums, pruning. If you find yourself needing a value *from below*, this
  is it.
- **Preorder** when information flows down — passing a path, a running sum, or a valid range
  into the children. Serialisation and "path from root" problems.
- **Inorder** whenever a BST is involved and you want sorted order — validation, the *k*th
  smallest, converting to a list.
- **Level-order** when the answer involves depth or rows — level averages, right-side view,
  minimum depth, zigzag.

The tell for BST specifically: the problem mentions sorted, or *k*th smallest, or a search
that should be `O(log n)` rather than `O(n)`.

## The template

```python
# Postorder — the workhorse. Return what the parent needs.
def height(node):
    if not node:
        return 0
    return 1 + max(height(node.left), height(node.right))

# Preorder — pass context down
def paths(node, trail, out):
    if not node:
        return
    trail.append(node.val)
    if not node.left and not node.right:
        out.append(list(trail))          # copy — trail is mutated
    paths(node.left, trail, out)
    paths(node.right, trail, out)
    trail.pop()                          # undo before returning

# Inorder on a BST yields sorted values
def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)

# Level-order — a queue, and take the level in one batch
from collections import deque
def levels(root):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):          # snapshot the size FIRST
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out
```

The `for _ in range(len(q))` is the detail that makes level-order work. Taking the length
before the loop is what separates one level from the next; without it the levels blur together.

## Why it works

Every traversal visits each node once and does constant work there, so all four are `O(n)`
time. Space differs, and that difference is what interviewers probe.

Recursive traversals use the call stack, so space is `O(h)` where `h` is the **tree height**.
For a **balanced tree** that is `O(log n)`; for a degenerate tree — a linked list in disguise —
it is `O(n)`, and deep enough recursion will overflow the stack. Level-order uses a queue
holding at most one level, which is `O(n)` in the worst case, at the widest row.

The BST property is what makes inorder yield sorted output, and it is worth stating precisely
because the naive version of it is wrong. A BST requires every value in the left subtree to be
less than the node — not merely the left *child*. Validation therefore has to carry a range
down from the root, which is a preorder job, and checking only parent against child is the
classic wrong answer.

Search in a BST is `O(h)`, which is `O(log n)` when balanced and `O(n)` when not. That gap is
the entire reason self-balancing trees exist, and it is why "what if the tree is skewed" is a
standard follow-up.

## Worked example

"Find the diameter of a binary tree" — the longest path between any two nodes, which need not
pass through the root.

The instinct is to compute, for every node, the longest path through it, then take the maximum.
That means computing heights repeatedly, which is `O(n²)` on a skewed tree.

The observation that fixes it: the longest path through a given node is the height of its left
subtree plus the height of its right subtree. And you are already computing those heights on
the way back up.

So this is postorder. Each call returns its height to the parent, and *on the way*, updates a
running best with `left + right`. One traversal, two things happening — the return value goes
up, the side effect accumulates.

Trace a root with a left child that has one child of its own, and a bare right child. The
deepest call returns 1. Its parent computes left height 1, right height 0, so a path of 1
through it, and returns 2 to the root.

At the root, left height is 2 and right height is 1, giving a path of 3 — the answer. Each
node was visited once: `O(n)` time and `O(h)` space for the stack.

The generalisable idea is worth more than the problem. When a node's answer needs values from
below, return the value the parent needs and accumulate the answer as a side effect. That
shape solves diameter, balanced-check, maximum path sum, and most subtree questions.

## Classic problems

- **Maximum Depth** / **Balanced Binary Tree** — postorder, returning height.
- **Diameter of Binary Tree** — the example above, and the template for the family.
- **Binary Tree Maximum Path Sum** — the same shape, with the twist that a negative subtree
  contributes zero rather than its value.
- **Validate BST** — preorder carrying a valid range down, and the problem where checking only
  parent-against-child is the trap.
- **Kth Smallest in a BST** — inorder with an early exit.
- **Lowest Common Ancestor** — different on a BST, where the values tell you which way to go,
  than on a general tree, where you need postorder.
- **Level Order** / **Right Side View** / **Zigzag** — the queue form, with the level snapshot.
- **Serialize and Deserialize Binary Tree** — preorder with explicit null markers, and the
  clearest test of whether you understand why traversal order matters.
