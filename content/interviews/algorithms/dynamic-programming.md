---
type: pattern
title: Dynamic programming — recognising it
sidebar_position: 19
group: Algorithms
summary: The pattern people fear, which is really just recursion plus a cache — and the whole difficulty is defining the state.
defines: [dynamic programming, overlapping subproblems, optimal substructure, memoisation, tabulation]
razors: []
prereq: [complexity]
---

## The model

**Dynamic programming** is recursion where the same subproblem comes up more than once, so you
solve it once and remember the answer.

That is the entire idea. The reputation comes from the fact that the hard part is not the
technique but the modelling: deciding **what the state is**. Once you can say "the answer for
state X is built from the answers for states Y and Z", the code is mechanical. Until you can
say that, no amount of cleverness helps.

## Recognise it

Reach for DP when both of these hold:

- **Overlapping subproblems** — a naive recursion would compute the same thing repeatedly.
  Draw two levels of the recursion tree; if you see a repeat, that is the signal.
- **Optimal substructure** — the best answer is built from best answers to smaller versions.

And the surface tells that usually accompany them:

- The problem asks for a **maximum, minimum, or count of ways**. Not "find one" — that is
  usually greedy or backtracking.
- You are making a **sequence of choices**, each affecting what remains.
- A brute force is exponential, and the input bound is far too large for it.
- The word "**subsequence**" appears — contiguous means [[sliding window]], non-contiguous
  usually means DP.

The tell against it: if a locally best choice is provably globally best, it is greedy and
much cheaper. If you must enumerate actual solutions rather
than count or optimise, it is backtracking.

## The template

Write the recursion first, then add a cache. Never start from the table.

```python
from functools import cache

# 1. Top-down: the recursion you would have written, plus memoisation
@cache
def best(i, remaining):
    if i == len(items):            # base case: no items left
        return 0
    skip = best(i + 1, remaining)
    take = 0
    if items[i].weight <= remaining:
        take = items[i].value + best(i + 1, remaining - items[i].weight)
    return max(skip, take)         # the transition

# 2. Bottom-up: the same recurrence, filled in dependency order
dp = [0] * (n + 1)
dp[0] = base_value
for i in range(1, n + 1):
    dp[i] = combine(dp[i - 1], dp[i - 2])    # same transition, iterative
```

The three questions to answer out loud, in order:

1. **What is the state?** The smallest set of variables that determines the answer from here.
2. **What is the transition?** How the answer for a state is built from smaller states.
3. **What are the base cases?** The states whose answers need no recursion.

Answer those and the code follows. Skip them and you will write a table you cannot justify.

## Why it works

Without memoisation, a recursion that branches twice per level and goes `n` deep does `2ⁿ`
work, because it recomputes identical subtrees. With a cache, each distinct state is computed
once and reused thereafter.

So the complexity has a formula worth carrying: **time is (number of states) × (work per
transition)**, and space is the number of states. One-dimensional state over `n` with `O(1)`
transitions is `O(n)`. Two-dimensional state with `O(1)` transitions is `O(n × m)`. Fibonacci
goes from `O(2ⁿ)` to `O(n)` purely by not recomputing.

**Memoisation** is top-down — write the natural recursion, add a cache, and only the states
you actually reach get computed. **Tabulation** is bottom-up — fill a table in dependency
order, avoiding recursion entirely and often allowing you to keep only the last row or two.

Prefer memoisation when solving. It follows directly from the recursion, so it is far harder
to get the order wrong, and unreachable states cost nothing. Convert to tabulation only when
recursion depth is a genuine problem or when you need the space optimisation — and that
conversion is mechanical once the recurrence is right.

## Worked example

"Climbing stairs": you can take 1 or 2 steps at a time, so how many distinct ways are there to
reach step `n`?

Start with the recursion, because it is obvious. To be on step `n`, your last move was from
`n − 1` or from `n − 2`. So the ways to reach `n` is the sum of the ways to reach each of
those.

That is the transition, and it took one sentence: `ways(n) = ways(n-1) + ways(n-2)`. The base
cases are `ways(0) = 1` — one way to stand still — and `ways(1) = 1`.

Written as bare recursion this is `O(2ⁿ)`. Computing `ways(5)` calls `ways(3)` twice, and each
of those recomputes its whole subtree. Sketching two levels shows the repeat immediately, which
is the overlapping-subproblems signal doing its job.

Add a cache and each of `ways(0)` through `ways(n)` is computed once. That is `n` states with
`O(1)` work each: `O(n)` time and `O(n)` space, from `O(2ⁿ)`, purely by not recomputing.

Then notice the state only ever looks back two steps, so the whole table is unnecessary — two
variables suffice, giving `O(1)` space. That last squeeze is the standard follow-up, and it is
available whenever the transition has a bounded lookback.

The reason to work this problem despite its triviality is that it is the full method in
miniature — state: which step you are on; transition: the sum of the two below; base cases:
the bottom two.

Every harder DP problem is those same three questions with a state that takes longer to find.
Candidates who fail DP interviews almost always fail at defining the state, not at writing
the loop.

## Classic problems

Ordered by how much they teach about finding the state:

- **Climbing Stairs** / **Fibonacci** — the method in miniature, and the space squeeze.
- **House Robber** — the state is "index, plus whether you took the previous one", which is
  the first problem where the state is not just the index.
- **Coin Change** — minimum coins for an amount; the state is the amount, and the transition
  loops over coins.
- **Longest Increasing Subsequence** — `O(n²)` DP, with an `O(n log n)` version using binary
  search that is worth knowing exists.
- **Word Break** — the state is a prefix length, and the transition asks whether any split
  point works.
- **Unique Paths** / **Minimum Path Sum** — the two-dimensional grid family.
- **Edit Distance** — two strings means two indices, and it is the canonical 2D state.
- **0/1 Knapsack** — the state is `(item index, remaining capacity)`, and it is the template
  for every "choose a subset under a budget" problem.
- **Longest Common Subsequence** — the other canonical 2D problem, and the one most often
  hiding inside a harder question.
