---
type: pattern
title: Prefix sums
sidebar_position: 5
group: Algorithms
summary: Precompute running totals so any range sum becomes one subtraction — and combine with a hash map to count ranges in a single pass.
defines: [prefix sum, difference array]
razors: []
prereq: [hash-maps]
---

## The model

A **prefix sum** array holds the total of everything up to each position. Once you have it,
the sum of any range is one subtraction: `prefix[j] − prefix[i-1]`.

The whole pattern is precomputation: `O(n)` once at the start, then `O(1)` per query instead
of `O(n)`. It is the [[read-to-write ratio|read-heavy]] trade in miniature — spend work
once so the repeated operation is free.

## Recognise it

Reach for prefix sums when:

- You need **range sums** and there will be more than one query.
- The problem says "subarray" and something about a **sum**, **count**, or **average**.
- A brute force would recompute overlapping totals — the tell is a nested loop where the
  inner one accumulates.
- You need to count subarrays with a given property, which is where the hash-map
  composition applies.
- The operation is associative and invertible: sum, XOR, product without zeros. Not min or
  max — those need a different structure.

The tell against it: if the array changes between queries, a static prefix array is invalidated
by every write, and you want a Fenwick tree or segment tree instead.

## The template

```python
# Build: prefix[i] = sum of the first i elements. Note the leading 0.
prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)

# Any range sum, inclusive of i and j, in O(1)
def range_sum(i, j):
    return prefix[j + 1] - prefix[i]

# The high-value composition: count subarrays summing to k, in one pass
from collections import defaultdict
def count_subarrays(nums, k):
    counts = defaultdict(int)
    counts[0] = 1              # the empty prefix — the case people forget
    running, total = 0, 0
    for x in nums:
        running += x
        total += counts[running - k]   # how many earlier prefixes make a range of k
        counts[running] += 1
    return total
```

The leading `0` in the prefix array is what makes ranges starting at index 0 work without a
special case. The `counts[0] = 1` in the second function is the same idea, and omitting it is
the classic bug.

## Why it works

The sum of elements from `i` to `j` is everything up to `j` minus everything before `i`.
Because addition is invertible, that subtraction recovers the range exactly, and the whole
range collapses to two array reads.

Building costs `O(n)` time and `O(n)` space. Each query is then `O(1)`, so `q` queries cost
`O(n + q)` rather than `O(nq)`. With many queries this is the difference between quadratic and
linear.

The composition with a hash map is the part worth understanding rather than memorising. A
subarray sums to `k` exactly when `running − earlier = k`, which rearranges to
`earlier = running − k`. So at each position you are asking *"how many earlier prefixes had
the value `running − k`?"* — a lookup, not a scan.

That turns counting subarrays from `O(n²)` into `O(n)`, and it generalises. Replace addition
with XOR and the same structure counts subarrays with a target XOR, because XOR is also
invertible. Try it with `min` and it fails, because you cannot subtract a minimum back out.

## Worked example

Count subarrays summing to 3 in `[1, 2, 1, 2, 1]`.

Start with `counts = {0: 1}` and a running total of 0. That seeded entry represents the empty
prefix, and it is what allows a subarray starting at index 0 to be counted.

Read 1: running is 1, so look for `1 − 3 = −2`. Not present, so no subarray ends here. Record
`counts[1] = 1`.

Read 2: running is 3, so look for `0`. Present once — the seeded entry — meaning the range
from the very start sums to 3. Total is now 1, and record `counts[3] = 1`.

Read 1: running is 4, so look for `1`. Present once, at the prefix after the first element, so
the range `[2, 1]` sums to 3. Total is 2.

Read 2: running is 6, look for `3`. Present once, giving `[1, 2]`, so the total is 3.

Read the final 1: running is 7, look for `4`, present once, giving `[2, 1]`. Total is 4.

Four subarrays, found in one pass over five elements. The brute force would have examined all
fifteen subarrays and summed each, and the gap widens quadratically with input size.

Notice what the hash map is actually storing: not values, but *how many times each running
total has occurred*. A repeated running total means the elements between those two points sum
to zero, and counting occurrences is what makes overlapping answers come out right.

## Classic problems

- **Range Sum Query — Immutable** — the pattern in its plainest form.
- **Subarray Sum Equals K** — the hash-map composition above, and the one to know cold.
- **Contiguous Array** — longest subarray with equal 0s and 1s, solved by mapping 0 to −1 and
  looking for a running total you have seen before. The reframing is the trick.
- **Product of Array Except Self** — prefix and suffix products, with the follow-up that you
  must do it without division and in `O(1)` extra space.
- **Range Sum Query 2D** — the two-dimensional form, where a rectangle is four lookups with
  inclusion-exclusion.
- **Find Pivot Index** — a one-pass balance check that falls straight out of the running total.
- **Corporate Flight Bookings** — the **difference array**, which is the inverse move: record
  changes at the boundaries and take a prefix sum at the end to apply many range updates in
  `O(n)`.
