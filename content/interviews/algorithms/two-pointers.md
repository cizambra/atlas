---
type: pattern
title: Two pointers
sidebar_position: 2
group: Algorithms
summary: Two indices walking a sorted array, where each move eliminates a whole set of candidates and turns a quadratic scan into a single pass.
defines: [two pointers, opposite-direction pointers, same-direction pointers, monotonic movement]
razors: []
prereq: [complexity]
---

## The model

Keep two indices into a sequence and move them according to what you observe, rather than
trying every pair.

The pattern earns its complexity from **monotonic movement**: each pointer only ever moves in
one direction, so together they touch each element at most once. That is what turns an
`O(n²)` search over pairs into an `O(n)` pass — and it is only valid when moving a pointer
provably eliminates every candidate it skips.

## Recognise it

Reach for two pointers when:

- The array is **sorted**, or can be sorted cheaply, and you want a pair or triple.
- The problem asks for something about *two positions* — a pair summing to a target, the
  widest container, the closest pair.
- You are removing, partitioning or deduplicating **in place** with `O(1)` extra space.
- A brute-force answer is "check every pair", and the input bound rules out `O(n²)`.
- The problem involves a palindrome, or comparing a sequence against its reverse.

The tell against it: if the array is unsorted and sorting would destroy the answer — because
original indices matter — you probably want a hash map instead.

## The template

Two shapes, and picking the right one is most of the work.

```python
# Opposite direction — converging on a sorted array
def two_sum_sorted(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        total = a[lo] + a[hi]
        if total == target:
            return (lo, hi)
        if total < target:
            lo += 1          # need bigger — only the left can help
        else:
            hi -= 1          # need smaller — only the right can help
    return None

# Same direction — a slow pointer marks the boundary, a fast one scans
def remove_duplicates(a):
    slow = 0
    for fast in range(1, len(a)):
        if a[fast] != a[slow]:
            slow += 1
            a[slow] = a[fast]
    return slow + 1          # length of the deduplicated prefix
```

The opposite-direction form needs sorted input. The same-direction form does not, and it is
really a partition: everything before `slow` satisfies the property, everything after is
unexamined.

## Why it works

The correctness argument is an elimination argument, and it is the thing to be able to say
out loud.

In the converging form, suppose `a[lo] + a[hi] < target`. Since the array is sorted, `a[hi]`
is the largest value available to pair with `a[lo]` — so **no** partner for `a[lo]` can reach
the target, and `lo` can advance without skipping a solution. The mirror argument holds when
the sum is too large.

Each step therefore discards an entire row or column of the pair space rather than one pair.
That is why the pass is `O(n)` time and `O(1)` space, against `O(n²)` for checking pairs
directly.

The precondition is exactly where this breaks. If the array is not sorted, `a[hi]` is not the
largest available partner, the elimination argument fails, and the algorithm silently returns
wrong answers rather than failing loudly. If sorting is needed first, the total becomes
`O(n log n)` — dominated by the sort, which is still a large improvement and worth stating
rather than hiding.

## Worked example

Find two numbers summing to 12 in `[2, 4, 6, 8, 11, 15]`.

Start with `lo` at 2 and `hi` at 15. The sum is 17, which is too large. Since the array is
sorted, 2 is the smallest partner available for 15, so nothing can pair with 15 to reach 12 —
15 is eliminated entirely, and `hi` moves left.

Now 2 and 11 give 13, still too large. By the same argument 11 is eliminated, and `hi` moves
again.

Next 2 and 8 give 10, which is too small. This time the reasoning flips: 8 is the largest
remaining partner for 2, so no pair involving 2 can reach 12. Now `lo` moves right, and 2 is
gone.

Then 4 and 8 give 12. Found, after four comparisons rather than the fifteen a full pair scan
would need.

The count is the small win; the argument is the real one. Each move eliminated a whole value
from every remaining pair, not one pair. That is why five more elements would add five steps
rather than twenty-five comparisons, and it is the sentence an interviewer is waiting for.

Note what breaks it. On `[11, 4, 2, 15, 8, 6]` the first comparison is 11 + 6 = 17, and moving
`hi` left discards 6 — which is part of the answer. The algorithm returns nothing and reports
no error, which is the failure mode worth respecting: the precondition is silent when
violated.

## Classic problems

- **Two Sum II (sorted input)** — the template, unmodified.
- **Container With Most Water** — converging pointers where you move the *shorter* wall,
  because moving the taller one can never improve the area.
- **3Sum** — sort, fix one element, then run two pointers on the remainder. The step up from
  `O(n³)` to `O(n²)`, and the classic follow-up.
- **Valid Palindrome** — converging from both ends, skipping non-alphanumerics.
- **Remove Duplicates from Sorted Array** — the same-direction form, in place.
- **Sort Colours (Dutch national flag)** — three pointers partitioning into three regions in
  one pass, and the natural place to be asked "can you do it without counting first?"
- **Trapping Rain Water** — converging pointers carrying running maxima, and the hardest
  common member of the family.
