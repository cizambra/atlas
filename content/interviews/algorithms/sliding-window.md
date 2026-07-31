---
type: pattern
title: Sliding window
sidebar_position: 3
group: Algorithms
summary: A contiguous range that grows on the right and shrinks on the left, so every subarray question becomes one pass instead of n².
defines: [sliding window, fixed window, variable window, window invariant, expand-contract]
razors: []
prereq: [two-pointers]
---

## The model

Maintain a contiguous range — the window — with two boundaries. The right edge advances to
include new elements; the left edge advances to restore a condition you have broken.

The whole pattern rests on a **window invariant**: a property that must hold for the range,
which you repair by shrinking rather than by starting over. Because each boundary only moves
forward, every element enters and leaves at most once, so the pass is `O(n)` even though the
loop looks nested.

## Recognise it

Reach for a sliding window when:

- The problem says **contiguous** — subarray, substring, consecutive.
- You want the longest, shortest, or a count of ranges satisfying some condition.
- A fixed size `k` is given: "maximum sum of any k consecutive elements".
- The brute force is "check every subarray", which is `O(n²)` or worse.
- The condition is **monotone** — adding an element can only push you further from
  satisfying it, and removing one can only help.

The tell against it: if the elements need not be contiguous, this is not a window — you want
sorting, a hash map, or dynamic programming.

## The template

```python
# Variable window — the general form
def longest_ok(s):
    left = 0
    best = 0
    state = {}                       # whatever the invariant needs
    for right, ch in enumerate(s):
        add(state, ch)               # expand
        while violates(state):       # contract until valid again
            remove(state, s[left])
            left += 1
        best = max(best, right - left + 1)
    return best

# Fixed window of size k — no inner loop needed
def max_sum_k(a, k):
    total = sum(a[:k])
    best = total
    for i in range(k, len(a)):
        total += a[i] - a[i - k]     # add one, drop one
        best = max(best, total)
    return best
```

The variable form is the one to internalise. The inner `while` is not a nested loop in the
complexity sense — `left` advances at most `n` times across the entire run.

## Why it works

The cost argument is the part people state wrongly, so it is worth being precise.

The outer loop moves `right` from 0 to n. The inner loop moves `left`, and `left` never
decreases and never exceeds `right`. So across the whole execution, the inner loop body runs
at most `n` times in total — not `n` times per outer iteration.

Total work is therefore `O(n)` time, against `O(n²)` for enumerating subarrays. Space is
`O(k)` for whatever the invariant tracks, where `k` is the alphabet or distinct-element count
rather than the input length.

The correctness argument is the monotonicity. When the window becomes invalid at `right`, no
larger window ending at `right` can be valid either — so shrinking from the left is safe, and
you never need to reconsider a range you have passed. If that property does not hold, the
pattern silently gives wrong answers, which is the same failure shape as unsorted input to
[[two pointers]].

## Worked example

Find the longest substring with no repeated characters in `abcabcbb`.

The window starts empty. Reading `a`, `b`, `c` expands it to `abc`, length 3, with no
repeats — the best so far.

The next character is `a`, which is already inside. The invariant is broken, so the left edge
advances, dropping the original `a`. The window is now `bca`, still length 3, and valid again.

Reading `b` breaks it again. Drop `b` from the left; the window becomes `cab`. Then `c`
arrives, so drop `c`, giving `abc` once more. Still 3.

Then `b` arrives with `b` already present, and the shrink leaves `cb`. The final `b` shrinks
it to just `b`, length 1.

The answer is 3, found in one pass over eight characters. The brute force would have examined
all 36 substrings and checked each for duplicates.

The count of operations is the thing to notice. `right` moved 8 times and `left` moved 6
times — 14 steps in total, not 8 × 6. That is the whole complexity argument, and stating it
in exactly those terms is what separates a candidate who has memorised "sliding window is
O(n)" from one who can defend it.

## Classic problems

- **Longest Substring Without Repeating Characters** — the canonical variable window, and the
  one above.
- **Maximum Sum Subarray of Size K** — the fixed form, where the inner loop disappears.
- **Minimum Size Subarray Sum** — shortest rather than longest, so the update moves inside
  the `while` rather than after it. A small change that catches people.
- **Longest Repeating Character Replacement** — the invariant becomes "window length minus
  most frequent count ≤ k", which is the step up in difficulty.
- **Permutation in String** / **Find All Anagrams** — fixed window plus a frequency map
  compared against a target.
- **Minimum Window Substring** — the hardest common one: variable window, a frequency map,
  and a counter of how many requirements are currently satisfied.
- **Fruit Into Baskets** — "at most two distinct" phrased as a story, and worth recognising
  as the same problem as longest-substring-with-k-distinct.
