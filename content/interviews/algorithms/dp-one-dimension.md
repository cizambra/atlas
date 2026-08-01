---
type: pattern
title: DP in one dimension
sidebar_position: 20
group: Algorithms
summary: The state is a single index, and the answer at each position is built from a bounded lookback — which usually collapses to two variables.
defines: [one-dimensional DP, lookback, rolling variables]
razors: []
prereq: [dynamic-programming]
---

## The model

The simplest DP shape: `dp[i]` is the answer considering the first `i` elements, and it is
built from a few earlier entries.

What makes it one-dimensional is that the index alone determines the state — nothing else about
how you got there matters. And because the transition usually looks back a fixed distance, the
whole array is often unnecessary: two or three **rolling variables** hold everything the
recurrence needs.

## Recognise it

Reach for one-dimensional DP when:

- The input is a **sequence**, and each position offers a **decision** — take it or skip it,
  break here or continue.
- The answer at position `i` depends only on a **bounded lookback**: `i−1`, `i−2`, or a small
  window.
- The problem asks for a maximum, minimum, or count over the whole sequence.
- Greedy is tempting but you can construct a case where the locally best choice loses.

The tell that it is *not* one-dimensional: if you need to remember something besides the index
— remaining capacity, how many items you took, which of two states you are in — the state has
another dimension and belongs in [[knapsack DP]] or a 2D table.

## The template

```python
# The general shape
dp = [0] * (n + 1)
dp[0] = base
for i in range(1, n + 1):
    dp[i] = best_of(dp[i - 1], dp[i - 2], ...)     # the transition

# House Robber — take this one, or keep the best without it
def rob(nums):
    take, skip = 0, 0                # take = best ending here, skip = best without
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)

# Kadane's — maximum subarray sum, the most-asked 1D DP
def max_subarray(nums):
    best = current = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)    # start fresh, or extend
        best = max(best, current)
    return best
```

Kadane's is worth recognising as DP rather than as a trick. `current` is `dp[i]` — the best
subarray *ending at* `i` — and the transition is the one decision available: extend the
previous subarray, or start a new one here.

## Why it works

There are `n` states and each transition does `O(1)` work, so the whole thing is `O(n)` time
and `O(n)` space for the table.

The space collapses whenever the lookback is bounded. If `dp[i]` needs only `dp[i-1]` and
`dp[i-2]`, then keeping the full array is storing `n − 2` values nobody will read again. Two
variables suffice, giving `O(1)` space — and that reduction is the standard follow-up on every
problem in this family.

The subtlety that makes several of these problems hard is **what `dp[i]` means**. There are two
common conventions and mixing them is the usual bug:

- **"Best considering the first `i` elements"** — the answer is `dp[n]`.
- **"Best ending exactly at `i`"** — the answer is `max(dp)`, because the best subarray need
  not reach the end.

Kadane's uses the second, which is why it tracks a separate `best`. House Robber uses the
first. Deciding which you mean before writing the loop is what stops the off-by-one confusion
that otherwise costs ten minutes.

## Worked example

Maximum subarray sum of `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`.

Define `current` as the best subarray *ending at* this position. At each element there is
exactly one decision: extend what came before, or abandon it and start fresh here.

Start with `current = best = −2`.

At 1: extending gives `−2 + 1 = −1`, starting fresh gives 1. Fresh wins, so `current = 1`, and
`best` becomes 1.

At −3: extending gives `1 − 3 = −2`, fresh gives −3. Extending wins at −2, but `best` stays 1.

At 4: extending gives `−2 + 4 = 2`, fresh gives 4. Fresh wins, `current = 4`, and `best`
becomes 4.

At −1 then 2 then 1: `current` goes 3, then 5, then 6, and `best` follows to 6.

At −5: `current` drops to 1. At the final 4: extending gives 5, fresh gives 4, so `current` is
5 — which does not beat 6.

The answer is 6, from the subarray `[4, −1, 2, 1]`. One pass, `O(n)` time, `O(1)` space.

The decision rule is worth stating in words, because it is the whole algorithm: **abandon the
previous subarray exactly when it is dragging you down** — when `current + x < x`, which is
precisely when `current` is negative. Any prefix with a negative sum can only hurt whatever
follows it.

## Classic problems

- **Climbing Stairs** — the smallest one, and the clearest space collapse.
- **House Robber** / **House Robber II** — the take-or-skip pair, then the circular version
  where you run it twice and exclude one end each time.
- **Maximum Subarray** — Kadane's, and the one to know cold.
- **Best Time to Buy and Sell Stock** — track the minimum seen so far, which is 1D DP that
  does not look like a table.
- **Coin Change** — minimum coins for an amount, where the state is the amount rather than an
  index and the transition loops over coins.
- **Word Break** — `dp[i]` is "can the first `i` characters be segmented", and the transition
  tries every split point.
- **Decode Ways** — the Fibonacci shape with awkward rules about zeros, which is where the
  base cases earn their attention.
- **Jump Game II** — solvable as 1D DP and better as [[greedy algorithm|greedy]], which makes
  it a good problem for arguing about which applies.
