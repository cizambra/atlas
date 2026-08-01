---
type: pattern
title: Recursion and the call stack
sidebar_position: 10
group: Algorithms
summary: Solve a problem by solving a smaller version of it — and the call stack is the state you forgot you were paying for.
defines: [recursion, base case, call stack, stack frame, tail call]
razors: []
prereq: [complexity]
---

## The model

**Recursion** solves a problem by expressing it in terms of a smaller instance of itself, plus
a **base case** that needs no further reduction.

The part people under-think is the **call stack**. Every pending call holds a **stack frame** —
its arguments, its locals, and where to resume — so recursion has a space cost equal to its
depth. That cost is invisible in the code, which is why "what is the space complexity?" is the
follow-up that catches people out.

## Recognise it

Reach for recursion when:

- The structure is **self-similar** — trees, nested lists, directory hierarchies, expressions.
- The problem decomposes into the same problem on smaller input — sorting halves, searching
  subtrees.
- You are exploring choices and need to undo them, which is [[backtracking]].
- An iterative version would need you to hand-manage a stack, at which point the language's
  stack is simpler and clearer.

Two things to establish before writing a line, because getting them wrong is most recursion
bugs:

- **What is the base case?** The input so small the answer is immediate. Missing or wrong
  base cases are why recursion fails to terminate.
- **Does every call move toward it?** If a recursive call can be made on input no smaller than
  its caller's, the recursion is not guaranteed to end.

## The template

```python
def solve(problem):
    if is_base_case(problem):            # 1. when do we stop?
        return base_answer(problem)
    smaller = reduce(problem)            # 2. move TOWARD the base case
    return combine(solve(smaller))       # 3. build the answer from the smaller one

# Two shapes worth distinguishing

def sum_list(a, i=0):                    # linear: one call per level, depth O(n)
    if i == len(a):
        return 0
    return a[i] + sum_list(a, i + 1)

def count_paths(r, c):                   # branching: two calls, tree of size O(2^n)
    if r == 0 or c == 0:
        return 1
    return count_paths(r - 1, c) + count_paths(r, c - 1)
```

The distinction in that second block is the one that matters for cost. Linear recursion is a
loop wearing different clothes. Branching recursion builds a tree, and if the branches overlap
you are one cache away from [[dynamic programming]].

## Why it works

Each call is a frame on the stack: arguments, locals, and the return address. The frames unwind
in reverse order, which is what lets a call resume exactly where it left off — and it is why
postorder tree work is natural, since the parent's frame is still waiting when the children
return.

Time is the number of calls multiplied by the work per call. Linear recursion makes `n` calls,
giving `O(n)`. Branching recursion with two calls per level and depth `n` makes `O(2ⁿ)` calls,
which is the shape that needs memoising.

Space is `O(depth)`, and it is the part omitted in interviews. Recursing over a balanced tree
is `O(log n)`; recursing over a linked list or a skewed tree is `O(n)`. Python's default limit
is around 1,000 frames, so a recursive solution over a 10,000-element list crashes rather than
running slowly — a distinction worth raising unprompted.

**Tail calls** — where the recursive call is the last thing that happens — could reuse one
frame, and some languages do exactly that. Python and Java do not, so tail recursion has no
space advantage there, and converting to a loop is the real fix.

## Worked example

"Reverse a linked list" — the clearest case for holding the stack in your head.

The recursive insight is small: reverse everything after the head, then make the second node
point back at the head. For `1 → 2 → 3`:

Call `reverse(1)`. It cannot do anything until it knows the reversal of `2 → 3`, so it calls
`reverse(2)`, which calls `reverse(3)`.

`reverse(3)` hits the base case — a single node is already reversed — and returns 3 as the new
head. Three frames are on the stack at this moment, and that is the peak.

Now `reverse(2)` resumes. Its node 2 still points at 3, so `node.next.next = node` makes 3
point back at 2, and `node.next = None` breaks the old forward link. It returns the new head,
still 3.

Then `reverse(1)` resumes with the same two lines, making 2 point back at 1. The list is
`3 → 2 → 1` and the new head, 3, is returned all the way up.

Each node was visited once, so `O(n)` time. But space is `O(n)` too, because all `n` frames
were live at the deepest point — and that is the answer the iterative version improves.

The iterative version walks the list with three pointers and uses `O(1)` space. Being asked to
convert between them is common, and the general rule is that any recursion can become a loop
by managing the stack yourself — which is worth doing only when the depth is a real risk or
the space matters.

## Classic problems

- **Reverse Linked List** — the example, and the standard recursive-versus-iterative comparison.
- **Merge Two Sorted Lists** — recursion where the combine step is one comparison.
- **Maximum Depth of Binary Tree** — the smallest possible tree recursion.
- **Pow(x, n)** — halving rather than decrementing, which is `O(log n)` and the clearest proof
  that the reduction step decides the complexity.
- **Fibonacci** — the canonical overlapping-subproblem case, and the bridge to
  [[memoisation]].
- **Flood Fill** / **Word Search** — recursion over a grid, where the depth is the region size
  and stack overflow is a real risk on a large one.
- **Generate Parentheses** / **Subsets** — recursion that builds rather than computes, which
  is [[backtracking]].
- **Tower of Hanoi** — the problem where the recursion is obvious and the iterative version is
  genuinely hard, which is the case *for* recursion rather than against it.
