---
type: pattern
title: Complexity, and how to argue it
sidebar_position: 1
group: Algorithms
summary: Big-O describes how cost grows with input size, and the interview tests whether you can derive it out loud rather than recall it.
defines: [big-O, amortised analysis, time complexity, space complexity]
razors: []
prereq: []
---

## The model

**Big-O** describes how an algorithm's cost grows as the input grows. It deliberately
discards constants and lower-order terms, because those are dwarfed by the growth rate once
the input is large.

That discarding is the point rather than a simplification. `3n + 50` and `n` behave the same
way at scale, while `n` and `n²` do not — and no amount of constant-factor cleverness closes
that gap. The number you are being asked for is which growth class you are in, and the
argument for it matters more than the answer.

## Recognise it

You are being asked to state or defend a complexity when:

- The interviewer says "and what's the runtime of that?" — the expected answer is a
  derivation, not a letter.
- Two approaches both work and you must justify choosing one.
- The input size is given in the problem: `n ≤ 10⁵` is a hint about which class fits.
- Someone claims an optimisation, and the question is whether it changes the class or the
  constant.
- A nested loop appears, and whether it is `O(n²)` depends on what the inner loop ranges over.

## The template

Derive it by counting, not by pattern-matching on shape:

```python
# 1. What is n? Name it. "n = number of elements", "n = nodes, m = edges".
# 2. Count operations per level of the structure.
# 3. Multiply nested, add sequential.
# 4. Drop constants and lower-order terms.
# 5. State time complexity AND space complexity, separately.

def two_sum(nums, target):
    seen = {}                      # O(n) space — say this out loud
    for i, x in enumerate(nums):   # n iterations
        if target - x in seen:     # O(1) average — hash lookup
            return [seen[target - x], i]
        seen[x] = i                # O(1) amortised
    return []
# n iterations × O(1) work = O(n) time, O(n) space
```

The sentence to produce: *"n iterations, constant work inside, so O(n) time — and O(n) space
because the map can hold every element."*

## Why it works

Growth rates separate so violently that constants stop mattering. At `n = 1,000,000`, an
`O(n)` algorithm does a million operations and an `O(n²)` one does a trillion — a difference
of six orders of magnitude that no constant factor recovers.

The classes worth knowing cold, in order:

| Class | At n = 1,000,000 | Typical source |
|---|---|---|
| `O(1)` | 1 | hash lookup, array index |
| `O(log n)` | 20 | binary search, balanced tree |
| `O(n)` | 10⁶ | single scan |
| `O(n log n)` | 2 × 10⁷ | sorting, heap of n items |
| `O(n²)` | 10¹² | nested loop over the same input |
| `O(2ⁿ)` | unusable past n ≈ 30 | subsets, naive recursion |

**Amortised analysis** is the one people get wrong. A dynamic array's append is `O(n)` when
it resizes and `O(1)` otherwise, but resizes double the capacity, so `n` appends cost `O(n)`
in total — `O(1)` amortised. The distinction matters when a single slow operation is
unacceptable, and not otherwise.

The input bound is a hint about the intended class. `n ≤ 20` invites exponential; `n ≤ 2,000`
permits `O(n²)`; `n ≤ 10⁵` wants `O(n log n)`; `n ≤ 10⁸` demands `O(n)` or better. Reading
that off the problem statement is free information.

## Worked example

Take "find the two numbers in an array that sum to a target."

The brute-force version checks every pair with two nested loops. The outer runs `n` times and
the inner runs `n − i` times, so the total is `n(n−1)/2` comparisons.

Dropping the constant and the lower-order term gives `O(n²)`. At `n = 10⁵` that is five
billion comparisons — too slow, and the input bound told you so before you wrote it.

The hash-map version scans once. At each element it asks whether the complement has been seen
already, which is a hash lookup costing `O(1)` on average.

So the work is `n` iterations times constant work: `O(n)` time. The space is `O(n)`, because
in the worst case every element lands in the map before a pair is found.

That trade is the actual answer, and it is worth saying in those words: *"I'm spending O(n)
space to remove a factor of n from the time."* The interviewer is listening for whether you
know that you paid for it.

One caveat worth volunteering. The hash lookup is `O(1)` **on average**, not in the worst
case — adversarial keys can collide and degrade it to `O(n)` per lookup. It almost never
matters, and saying it shows you know the guarantee you are relying on.

## Classic problems

Every problem has a complexity question attached, so the practice is to state it unprompted
on each one. The ones that specifically test the reasoning:

- **Two Sum** — the `O(n²)` to `O(n)` trade above, and the space you spend to get it.
- **Merge Intervals** — the sort dominates, so it is `O(n log n)` however clever the merge is.
- **Kth Largest Element** — heap gives `O(n log k)`, sorting gives `O(n log n)`, quickselect
  gives `O(n)` average. Three different arguments for one problem.
- **Climbing Stairs** — naive recursion is `O(2ⁿ)`, memoised is `O(n)`. The clearest
  demonstration that the algorithm and the implementation are different things.
- **Search in Rotated Sorted Array** — `O(log n)` is the whole requirement, and it is stated
  in the problem rather than discovered.
