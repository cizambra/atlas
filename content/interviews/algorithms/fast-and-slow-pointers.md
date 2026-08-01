---
type: pattern
title: Fast and slow pointers
sidebar_position: 7
group: Algorithms
summary: Two pointers moving at different speeds, which detects cycles and finds midpoints in one pass with no extra memory.
defines: [fast and slow pointers, Floyd's cycle detection, cycle entry, tortoise and hare]
razors: []
prereq: [two-pointers]
---

## The model

Move one pointer one step at a time and another two steps at a time.
The **tortoise and hare**. Two things fall out of that alone.

If there is a cycle, the fast pointer eventually laps the slow one and they meet — because the
gap between them closes by exactly one each step. And when the fast pointer reaches the end,
the slow one is at the midpoint. Both in one pass, both in `O(1)` space, which is what
distinguishes this from the obvious hash-set answer.

## Recognise it

Reach for fast and slow pointers when:

- The problem asks whether a **linked list has a cycle**, or where the cycle begins.
- You need the **middle** of a list you cannot index into.
- You need the **kth from the end** in one pass — the same idea with a fixed gap rather than
  a speed difference.
- The constraint says **`O(1)` space**, and your first instinct was a hash set.
- The problem involves repeatedly applying a function and asking whether it terminates —
  "happy numbers", sequences that eventually repeat.

The tell is that constraint. Cycle detection with a visited set is easy and `O(n)` space;
this pattern exists specifically to remove that cost.

## The template

```python
# Cycle detection — do they ever meet?
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# Where does the cycle start? (Floyd's, phase two)
def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:                    # meeting point
            slow = head                     # reset ONE pointer to the head
            while slow is not fast:         # now both move one step
                slow, fast = slow.next, fast.next
            return slow                     # they meet at the entry
    return None

# Midpoint — slow lands in the middle when fast runs out
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow

# Kth from the end — a fixed gap, not a speed difference
def kth_from_end(head, k):
    lead = head
    for _ in range(k):
        lead = lead.next
    trail = head
    while lead:
        lead, trail = lead.next, trail.next
    return trail
```

The `while fast and fast.next` guard is what makes it safe on even and odd lengths alike.
Checking only `fast` crashes on `fast.next.next` at the end of an even-length list.

## Why it works

**Floyd's cycle detection** is the name for the two phases below, and the first is a gap
argument. Once both pointers are inside the cycle, each step moves
the fast one two and the slow one one, so the distance between them changes by exactly one
per step. A gap that decreases by one every step must eventually reach zero, so they meet —
and since the gap can never jump over zero, there is no way to miss.

That gives `O(n)` time and `O(1)` space, against `O(n)` space for the visited-set version.

The second phase is the part worth being able to derive rather than recite. Let `a` be the
distance from the head to the cycle entry, and let the meeting happen `b` steps into the
cycle. The slow pointer has travelled `a + b`; the fast has travelled twice that. The
difference between them is a whole number of laps, which means `a + b` is a multiple of the
cycle length.

So walking `a` more steps from the meeting point lands exactly on the entry — and `a` is also
the distance from the head to the entry. Reset one pointer to the head, advance both by one,
and they meet at the entry. That is why the second loop looks like magic and is not.

The midpoint result is simpler: the fast pointer covers twice the ground, so when it reaches
the end the slow one has covered half.

## Worked example

"Find where a cycle begins" in a list `1 → 2 → 3 → 4 → 5`, where 5 points back to 3.

The cycle entry is node 3, and it is 2 steps from the head. The cycle itself has length 3.

Phase one. Both start at 1, and after one step slow is at 2 with fast at 3.

After two steps slow is at 3 and fast at 5. After three steps both are at 4 — they meet.

Notice the meeting point is *not* the entry, which is the thing that surprises people. It is 1
step into the cycle, and where it lands depends on the list's shape.

Phase two. Reset slow to the head, node 1, and leave fast at node 4, then move both one step
at a time.

Slow goes to 2 while fast goes to 5. Slow goes to 3 while fast wraps to 3. They meet at node
3 — the entry.

Two steps in phase two, which is exactly `a`, the distance from head to entry. That is the
arithmetic from the previous section made concrete, and being able to walk it is much better
than remembering that you reset a pointer.

The total cost is one pass to meet and a partial pass to find the entry, so `O(n)` time and
two variables of space. The hash-set version needs a set holding up to `n` nodes, which is
the difference the problem is usually testing for.

## Classic problems

- **Linked List Cycle** — phase one only.
- **Linked List Cycle II** — both phases, and the one worth being able to derive.
- **Middle of the Linked List** — the midpoint form, with the ambiguity about which middle to
  return on even lengths worth clarifying aloud.
- **Remove Nth Node From End of List** — the fixed-gap variant, plus a dummy head node to
  handle removing the first element cleanly.
- **Palindrome Linked List** — find the middle, reverse the second half, compare. The `O(1)`
  space follow-up to the obvious array approach.
- **Happy Number** — cycle detection on a sequence of numbers rather than nodes, which is the
  clearest proof that this is about *any* repeated function application.
- **Find the Duplicate Number** — an array read as a linked list, where `nums[i]` is the next
  index. The hardest of the family, and it is Floyd's applied to a graph nobody drew for you.
