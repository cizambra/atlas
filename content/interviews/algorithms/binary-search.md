---
type: pattern
title: Binary search
sidebar_position: 6
group: Algorithms
summary: Halve the search space each step — and the harder version searches the answer space rather than an array.
defines: [binary search, search space, monotone predicate, binary search on the answer]
razors: []
prereq: [complexity]
---

## The model

Repeatedly halve a range until one candidate remains. Twenty steps for a million elements,
thirty for a billion.

The array version is the one everyone knows. The version that actually distinguishes
candidates is **binary search on the answer**: when the answer is a number in a range and you
can *check* a candidate more easily than you can *compute* the answer, binary search the
candidates. That reframing turns a large class of "minimise the maximum" problems into a
`log` factor over a linear check.

## Recognise it

Reach for binary search when:

- The input is **sorted**, and you want a position, a boundary, or a value.
- The problem asks for the **first** or **last** thing satisfying a condition.
- The required complexity is `O(log n)`, which is usually stated outright.
- The answer is a **number in a known range**, and checking a candidate is easy while
  computing the answer directly is not. Phrases like *"minimise the maximum"*, *"the smallest
  capacity such that…"*, *"in at most `k` days"*.
- Something is sorted *conceptually* even though the array is not — a rotated array, a
  mountain array, a matrix with sorted rows.

The precondition in every case is a **monotone predicate**: once the condition flips from
false to true along the range, it never flips back.

## The template

Use one form and stop improvising boundaries. This one finds the first index where the
predicate holds.

```python
def first_true(lo, hi, predicate):
    """Smallest x in [lo, hi] with predicate(x) true.
       Requires: predicate is false, false, ..., false, true, ..., true."""
    while lo < hi:
        mid = lo + (hi - lo) // 2      # avoids overflow in languages that can
        if predicate(mid):
            hi = mid                   # mid might be the answer — keep it
        else:
            lo = mid + 1               # mid is definitely not — discard it
    return lo

# Array search becomes a predicate
i = first_true(0, len(a) - 1, lambda i: a[i] >= target)

# Answer search: smallest capacity that ships everything in <= days
def can_ship(cap):
    used, need = 0, 1
    for w in weights:
        if used + w > cap:
            need, used = need + 1, 0
        used += w
    return need <= days

answer = first_true(max(weights), sum(weights), can_ship)
```

The invariant to hold in your head: **the answer is always inside `[lo, hi]`**. `hi = mid`
keeps a possible answer; `lo = mid + 1` discards one that cannot be. Getting that pair
consistent is what eliminates off-by-one errors.

## Why it works

Each step discards half the remaining candidates, so the range shrinks from `n` to 1 in
`log₂ n` steps — 20 for a million, 30 for a billion. Time is `O(log n)` multiplied by the cost
of the predicate, and space is `O(1)`.

For answer-space search the range is the span of possible answers rather than the array, so
the cost is `O(log(range) × predicate)`. Shipping packages over a range of a million with an
`O(n)` check is about twenty passes over the array — trivially fast, and it replaces a search
over configurations that has no direct formula.

The correctness requirement is monotonicity, and it is worth stating precisely because it is
what makes the halving valid. If `predicate(mid)` is true, every candidate above `mid` is also
true, so the entire upper half is either redundant or wrong — discarding it loses nothing. If
that property fails, binary search returns an arbitrary element with complete confidence.

Two mechanical details prevent the usual bugs. Compute the midpoint as `lo + (hi - lo) // 2`
rather than `(lo + hi) // 2`, which overflows in fixed-width integer languages. And use
`while lo < hi` with the assignments above, which terminates because the range strictly
shrinks every iteration.

## Worked example

"Given package weights and `d` days, find the smallest ship capacity that delivers everything
in order within `d` days."

There is no formula for the answer, but checking a capacity is easy: walk the weights,
starting a new day whenever the next package would overflow, and count the days used.

The answer must be at least the heaviest single package, since that package has to fit. And it
need never exceed the total weight, which ships everything in one day. So the search space is
`[max(weights), sum(weights)]`.

Take weights `[1,2,3,4,5,6,7,8,9,10]` with `d = 5`. The range is `[10, 55]`, so start at
mid = 32. Checking 32 uses 2 days, which is within 5, so 32 works — but something smaller
might too, and `hi` becomes 32.

Now the range is `[10, 32]`, mid = 21. That uses 3 days, still within budget, so `hi` becomes
21. Range `[10, 21]`, mid = 15: that needs 5 days, exactly the limit, so it works and `hi`
becomes 15.

Range `[10, 15]`, mid = 12: it needs 6 days, over budget, so 12 fails and `lo` becomes 13.
Range `[13, 15]`, mid = 14 needs 5 days and works, so `hi` becomes 14. Finally `[13, 14]`,
mid = 13 needs 6 days and fails, so `lo` becomes 14 and the loop ends.

The answer is 14, found in six checks over a range of 46 candidates. Monotonicity is what
licensed every halving: if a ship of capacity 21 can do it in 5 days, so can any larger ship —
so once 21 works, nothing above 21 needs testing.

## Classic problems

- **Binary Search** / **Search Insert Position** — the plain form, and the lower-bound variant.
- **First Bad Version** — the predicate framing, made explicit by the problem itself.
- **Find First and Last Position** — two searches, one for each boundary, which is the clearest
  demonstration of why you want a `first_true` primitive.
- **Search in Rotated Sorted Array** — the array is not sorted but one half always is, and
  deciding which half is the whole problem.
- **Find Minimum in Rotated Sorted Array** — the same structure, looking for the pivot.
- **Koko Eating Bananas** / **Capacity to Ship Packages** / **Split Array Largest Sum** — the
  answer-space family, all the same shape as the example above.
- **Median of Two Sorted Arrays** — binary search on the partition point rather than the
  value, and the hardest common member of the family.
- **Find Peak Element** — binary search without a sorted array at all, which is the clearest
  proof that monotonicity rather than sortedness is the real precondition.
