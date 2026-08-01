---
type: pattern
title: Sorting
sidebar_position: 26
group: Algorithms
summary: You will almost never implement one, and you will constantly decide whether to call one — which is the actual skill.
defines: [merge sort, quicksort, quickselect, stable sort, comparison sort, counting sort, custom comparator]
razors: []
prereq: [complexity]
---

## The model

Sorting is `O(n log n)`, and every language ships a good implementation. The interview question
is almost never "write quicksort" — it is whether you recognise that sorting makes a problem
easy, and whether you know what the `O(n log n)` buys and costs.

Two properties decide most real choices. **Stability** — whether equal elements keep their
original order — matters whenever you sort by one key after another. And the `n log n` bound
applies to **comparison sorts** only; when keys are small integers you can do better.

## Recognise it

Sorting is the answer when:

- The problem becomes obvious once things are in order — [[interval|intervals]],
  [[two pointers]], deduplication, finding pairs.
- You need the **kth** something, though a [[heap]] or quickselect may beat a full sort.
- You are grouping equal things together, and a [[hash map]] is unavailable or awkward.
- The problem involves a **custom order** — by a computed key, by several keys, by a rule the
  problem states.

And you should notice when it is *too expensive*:

- If an `O(n)` solution exists — a [[hash map]], a counting pass, [[one-dimensional DP|a linear scan]]
  — sorting throws away a factor of `log n` for convenience.
- If the data arrives as a **stream**, you cannot sort what you have not seen, and a heap is
  the answer instead.

## The template

```python
# What you will actually write
items.sort(key=lambda x: x[1])              # by one field
items.sort(key=lambda x: (x[1], -x[0]))     # by field 1 asc, then field 0 desc
items.sort(key=len, reverse=True)

# Custom comparator when a key function cannot express the rule
from functools import cmp_to_key
def compare(a, b):
    return -1 if a + b > b + a else 1       # "largest number" ordering
nums.sort(key=cmp_to_key(compare))

# Quickselect — kth smallest in O(n) average, without a full sort
def quickselect(a, k):
    pivot = a[len(a) // 2]
    lo  = [x for x in a if x < pivot]
    eq  = [x for x in a if x == pivot]
    hi  = [x for x in a if x > pivot]
    if k < len(lo):            return quickselect(lo, k)
    if k < len(lo) + len(eq):  return pivot
    return quickselect(hi, k - len(lo) - len(eq))
```

The tuple key is the workhorse: sorting by several criteria is one expression, and negating a
numeric field reverses just that one. Reaching for `cmp_to_key` is rare and is the signal that
the ordering is not expressible as a key — as in "arrange numbers to form the largest possible
concatenation", where the rule compares pairs.

## Why it works

Any **comparison sort** needs `Ω(n log n)` comparisons in the worst case, because there are
`n!` possible orderings and each comparison distinguishes at most half the remaining
possibilities. `log₂(n!)` is about `n log n`, which is a lower bound rather than an
implementation detail.

The three worth knowing by name:

| | Time | Space | Stable |
|---|---|---|---|
| **Merge sort** | `O(n log n)` always | `O(n)` | yes |
| **Quicksort** | `O(n log n)` average, `O(n²)` worst | `O(log n)` | no |
| **Heap sort** | `O(n log n)` always | `O(1)` | no |

Quicksort is usually fastest in practice despite the worse bound, because its constant factors
and cache behaviour are excellent. Its `O(n²)` case comes from bad pivots, which randomisation
makes vanishingly unlikely. Python's `sorted` is Timsort — merge sort adapted to exploit runs
that are already ordered — and it is stable, which is why sorting by two keys in two passes
works there.

**Stability** is the property people forget to ask about. Sorting employees by name, then by
department, gives departments each internally sorted by name only if the second sort is stable.
With an unstable sort you must use a tuple key instead, and knowing which situation you are in
prevents a bug that looks like data corruption.

The `n log n` bound applies to comparisons, and **counting sort** escapes it by not comparing:
with keys in a small known range, count occurrences and read them back in order, giving
`O(n + k)`. That is how you sort a million values in the range 0–100 in linear time, and
naming it is the right answer when an interviewer says "can you do better than `n log n`".

**Quickselect** is the other escape. It partitions like quicksort but recurses into only one
side, giving `O(n)` average for the kth element — better than sorting, worse than a heap for
streams, and the expected follow-up on any top-k question.

## Worked example

"Sort colours": an array of 0s, 1s and 2s, in place, in one pass.

Calling `sort()` is `O(n log n)` and correct. The problem is asking for better, and the input
description is the clue — three distinct values in a known range.

Counting sort does it in two passes: count how many of each, then overwrite the array. `O(n)`
time, `O(1)` space since there are only three counters. That is a legitimate answer and it
touches the array twice.

The one-pass version is the Dutch national flag partition, which is [[two pointers]] with
three: `low`, `mid`, and `high`. Everything before `low` is 0, everything after `high` is 2,
and `mid` scans the unknown middle.

Trace `[2, 0, 1]`. `mid` sees 2, so swap it with `high` and shrink `high` — the array becomes
`[1, 0, 2]` and `mid` does **not** advance, because the swapped-in value is unexamined.

Now `mid` sees 1, which belongs in the middle, so just advance `mid`. Then `mid` sees 0, so
swap with `low` and advance both. The array is `[0, 1, 2]`.

One pass, `O(n)` time, `O(1)` space. The detail that catches people is not advancing `mid`
after a swap with `high` — the value that arrived came from unexplored territory, while a swap
with `low` brings a value already known to be 1.

The general lesson is worth more than the problem: `O(n log n)` is a lower bound for
*comparison* sorts, and a problem stating a small fixed range is telling you it does not intend
for you to compare.

## Classic problems

- **Sort Colours** — the example, and the clearest "beat `n log n`" case.
- **Merge Intervals** / **Meeting Rooms** — sorting is the entire algorithm, and the sort
  dominates the complexity.
- **Largest Number** — the custom comparator case, where the rule is pairwise and cannot be a
  key.
- **Kth Largest Element** — sort for `O(n log n)`, heap for `O(n log k)`, quickselect for `O(n)`
  average. Being able to give all three and pick one is the answer.
- **Top K Frequent Elements** — a frequency map plus a partial sort, or bucket sort for `O(n)`.
- **Merge Sorted Array** / **Merge k Sorted Lists** — merging rather than sorting, which is the
  half of merge sort you actually write.
- **H-Index** — sorting makes it trivial, and counting sort makes it linear.
- **Sort an Array** — the one problem that genuinely asks you to implement one, usually merge
  sort because its bound is unconditional.
