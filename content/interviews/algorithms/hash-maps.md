---
type: pattern
title: Hash maps
sidebar_position: 4
group: Algorithms
summary: Trading space for time by making lookup constant — the single most common move for turning a quadratic solution linear.
defines: [hash map, hash set, collision, load factor, frequency map, complement lookup, seen set]
razors: []
prereq: [complexity]
---

## The model

A **hash map** stores key-value pairs and finds a key in constant time on average, by
computing a number from the key and jumping straight to that slot. A **hash set** is the same
structure with the values left off, answering only membership.

Almost every "make this faster" moment in an interview is the same move: you were scanning to
answer *"have I seen this?"*, and a hash map answers it in one step instead. You pay `O(n)`
memory for it, and saying that trade out loud is what separates using the tool from
understanding it.

## Recognise it

Reach for a hash map when:

- You catch yourself writing a nested loop where the inner one is **searching**.
- The question involves "have I seen", "how many times", "does this exist", "is there a
  duplicate".
- You need to group things by a computed key — anagrams by sorted letters, points by slope.
- Two passes would work: one to build knowledge, one to use it.
- You need the **complement**: given `x`, is `target - x` present?

The tell against it: if you need order, ranges, or the *k*th smallest, a hash map gives you
none of those — you want a sorted structure or a heap.

## The template

Three shapes cover most problems.

```python
# 1. Seen set — dedupe, cycle detection, "does this exist"
seen = set()
for x in items:
    if x in seen:
        return True
    seen.add(x)

# 2. Frequency map — counting, anagrams, "most common"
from collections import Counter, defaultdict
freq = Counter(items)                   # {item: count}

# 3. Complement / index map — the two-pass idea done in one pass
seen = {}                               # value → index
for i, x in enumerate(nums):
    if target - x in seen:              # ask before you insert
        return [seen[target - x], i]
    seen[x] = i

# Grouping by a computed key
groups = defaultdict(list)
for word in words:
    groups[tuple(sorted(word))].append(word)
```

The ordering in shape 3 matters: check for the complement *before* inserting the current
element, or a value equal to half the target matches itself.

## Why it works

A hash function turns a key into an index, so the lookup is an array access rather than a
search. That is `O(1)` on average for insert, delete and lookup, and `O(n)` space for `n`
entries.

The quadratic-to-linear collapse follows directly. A nested loop asking "is there another
element such that…" does `n` scans of `n` elements: `O(n²)`. Recording what you have seen as
you go turns each inner scan into one lookup, giving `n` iterations of `O(1)` work: `O(n)`.

Two caveats worth knowing, because interviewers probe them.

**`O(1)` is average, not worst case.** A **collision** is two keys landing in the same slot,
resolved by chaining or probing. With adversarial keys every insert can collide, degrading to
`O(n)` per operation. Real hash maps keep the **load factor** below a threshold and resize,
which is what keeps collisions rare — and resizing is `O(n)` but amortised to `O(1)`.

**Keys must be hashable and stable.** Mutating an object after using it as a key makes it
unfindable, because the hash changed. This is why Python requires tuples rather than lists.

## Worked example

Take "does this array contain a duplicate within `k` positions of each other?"

The brute force compares every pair within distance `k`: for each of `n` elements, scan back
up to `k`. That is `O(nk)` — fine for small `k`, and quadratic when `k` approaches `n`.

The hash-map version keeps a map from value to its most recent index. At each element, look
the value up; if it is present and the index difference is at most `k`, you have found the
answer.

Walk `[1, 2, 3, 1]` with `k = 3`. Reading 1 the map is empty, so store `1 → 0`, and 2 and 3
store likewise.

Reading the final 1, the map already holds `1 → 0`, and `3 − 0 = 3` is within `k`. Answer:
true.

One pass, one lookup per element: `O(n)` time and `O(n)` space, with no dependence on `k` at
all. That last part is the interesting bit — the hash map removed a parameter from the
complexity, not just a factor.

The variant worth anticipating is the follow-up: "now do it in `O(k)` space." The answer is a
sliding window of size `k` held in a set, evicting the element that falls out of range — which
is this pattern composed with [[sliding window]], and recognising that composition is the
actual skill being tested.

## Classic problems

- **Two Sum** — the complement lookup, and the canonical demonstration of the trade.
- **Contains Duplicate** / **Contains Duplicate II** — the seen set, then the bounded window
  above.
- **Group Anagrams** — grouping by a computed key, where choosing the key *is* the problem.
- **Valid Anagram** — frequency map comparison, and the `O(n)` alternative to sorting both.
- **Top K Frequent Elements** — frequency map, then a heap or bucket sort. Composition again.
- **Longest Consecutive Sequence** — a set plus the trick of only starting a count at a
  number whose predecessor is absent, which is what makes it `O(n)` rather than `O(n log n)`.
- **Subarray Sum Equals K** — a frequency map of running sums, which is this pattern composed
  with [[prefix sum|prefix sums]] and one of the highest-value combinations to know.
