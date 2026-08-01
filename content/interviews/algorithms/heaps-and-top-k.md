---
type: pattern
title: Heaps and top-k
sidebar_position: 16
group: Algorithms
summary: A heap keeps the extreme element reachable in constant time, which turns "the k best" from a sort into a single pass.
defines: [heap, priority queue, min-heap, max-heap, heapify, top-k, k-way merge, running median]
razors: []
prereq: [complexity]
---

## The model

A **heap** keeps the smallest — or largest — element at the top, always. Push and pop cost
`O(log n)`; looking at the top costs `O(1)`.

It does *not* keep everything sorted, and that is the point. Maintaining full order is
expensive; maintaining only "the extreme is on top" is cheap, and it is all most problems
need. A **priority queue** is the same structure named for what it is used for.

## Recognise it

Reach for a heap when:

- You need the **k largest or smallest** of something, and `k` is much smaller than `n`.
- You need repeated access to the **current minimum or maximum** while items keep arriving.
- You are **merging sorted sequences** and always want the smallest unconsumed element.
- The problem is a **stream** — data arrives over time and you cannot sort what you have not
  seen.
- You are running a scheduler, a simulation, or anything that processes "the next earliest"
  repeatedly.

The counterintuitive rule for top-k, worth memorising because it is asked directly: **for the
k largest, use a min-heap of size k.** The top of that heap is the smallest of your current
best k, which is exactly the element to evict when something better arrives.

## The template

```python
import heapq                                # Python's heapq is a MIN-heap

# k largest — a MIN-heap of size k
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)             # evict the smallest of the best k
    return heap                             # heap[0] is the kth largest

# Max-heap in a min-heap language: negate
max_heap = []
heapq.heappush(max_heap, -value)
largest = -heapq.heappop(max_heap)

# k-way merge of sorted lists
def merge_k(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)                     # O(n), cheaper than n pushes
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out

# Running median — two heaps facing each other
low, high = [], []      # low is a max-heap (negated), high is a min-heap
```

Tuples break ties in insertion order, which is why the merge stores `(value, list_index,
position)` rather than just the value — comparing raw objects that are not orderable is a
common crash.

## Why it works

A heap is a complete binary tree stored in an array, where every parent is smaller than its
children. Push and pop restore that property by walking one path up or down, which is the tree
height: `O(log n)`. Reading the top is `O(1)` because it is index 0.

**Heapify** builds a heap from an existing array in `O(n)` rather than `O(n log n)` — the
counting argument is that most nodes are near the leaves and sift down only a short distance.
Use it whenever you have all the data up front.

The top-k complexity is the result worth being able to derive. Sorting everything and taking
`k` costs `O(n log n)`. A size-`k` heap costs `O(n log k)`, because each of `n` elements does
at most one push and one pop against a heap of size `k`.

When `k` is 10 and `n` is a million, `log k` is about 3 and `log n` is about 20 — so the heap
is roughly seven times cheaper, and it uses `O(k)` space rather than `O(n)`. That space
property is the stronger one: a heap of size `k` works on a stream you cannot hold in memory,
where sorting is not available at all.

Quickselect gives `O(n)` average for top-k and is worth naming as the alternative. It needs
the whole array in memory and has an `O(n²)` worst case, so the heap is the safer answer
unless the interviewer pushes for linear.

## Worked example

"Find the 3 largest numbers in a stream" — the values `[5, 1, 9, 3, 7, 2, 8]` arriving one at
a time, with no ability to store them all.

Use a min-heap capped at 3. Push 5, then 1, then 9. The heap now holds all three, with 1 on
top as the smallest.

Next is 3. Push it and the heap has four elements, so pop the top — 1, the smallest — leaving
`{3, 5, 9}`. The evicted element was the weakest of the four, which is exactly right.

Next is 7. Push and pop the top, which is 3. The heap holds `{5, 7, 9}`.

Next is 2. Push it and it lands at the top as the smallest, so the immediate pop removes it
again. Nothing changes, and that is the common case on a long stream.

Next is 8. Push, then pop 5. The heap holds `{7, 8, 9}` — the three largest.

The top of the heap is 7, which is the third largest. That is why a min-heap answers a
question about the *largest*: its top is the boundary of your current best set, and comparing
against it is how you decide whether an arrival belongs.

Cost is seven pushes and four pops against a heap of size 3, so `O(n log k)` time and `O(k)`
space. Sorting would have needed all seven values in memory — which the problem said you do
not have.

## Classic problems

- **Kth Largest Element in an Array** — the size-k min-heap, with quickselect as the follow-up.
- **Top K Frequent Elements** — a frequency map, then a heap over the counts. The composition
  with [[hash map|hash maps]] is the point.
- **Kth Largest Element in a Stream** — the same heap, kept alive across calls, and the
  clearest demonstration of why streaming rules out sorting.
- **Merge k Sorted Lists** — the k-way merge above, `O(n log k)` rather than `O(nk)`.
- **Find Median from Data Stream** — two heaps facing each other, rebalanced so their sizes
  differ by at most one. The hardest common one, and the pattern worth practising.
- **Task Scheduler** — a max-heap of remaining counts, which is greedy plus a heap.
- **Meeting Rooms II** — a min-heap of end times, which is the same answer as the
  [[sweep line]] and worth being able to give both ways.
- **K Closest Points to Origin** — top-k with a computed key rather than the value itself.
