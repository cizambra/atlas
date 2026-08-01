---
type: pattern
title: DP — the knapsack family
sidebar_position: 22
group: Algorithms
summary: Choose a subset under a budget, where the state is your position plus what remains — the shape inside most "can we make exactly" problems.
defines: [knapsack DP, 0/1 knapsack, unbounded knapsack, subset sum, capacity dimension]
razors: []
prereq: [dynamic-programming]
---

## The model

**Knapsack DP** is the shape behind every "choose a subset under a budget" problem: items
have a cost and a value, and you maximise value without exceeding the budget.

The state is two things: **which item you are considering** and **how much budget remains**.
That second dimension is what distinguishes this family from [[one-dimensional DP]] — the
answer from position `i` depends on choices you already made, summarised as remaining capacity.
Recognising that a problem needs a **capacity dimension** is most of the work.

## Recognise it

Reach for knapsack when:

- You are **choosing a subset** of items, and there is a **budget**, capacity, or target sum.
- The question is "can we make exactly `T`", "what is the maximum under `T`", or "how many
  ways to reach `T`".
- Each item has a cost, and taking it consumes some of a shared resource.
- A [[greedy algorithm|greedy]] by value-per-cost gives an answer you can construct a
  counterexample to.

Then decide which variant, because the code differs by one loop direction:

- **0/1 knapsack** — each item may be used **once**. Subsets, partitions, "pick some of these".
- **Unbounded knapsack** — each item may be used **any number of times**. Coin change, cutting
  a rod, "unlimited supply".

The disguises worth recognising: "can this array be split into two equal halves" is subset sum
for `total/2`. "Fewest coins for an amount" is unbounded knapsack. "How many ways to reach a
target" is the same table counting rather than maximising.

## The template

```python
# 0/1 knapsack — each item once. Iterate capacity BACKWARDS.
def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)              # dp[c] = best value with capacity c
    for w, v in zip(weights, values):
        for c in range(capacity, w - 1, -1):        # BACKWARD
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[capacity]

# Unbounded — each item any number of times. Iterate capacity FORWARDS.
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for c in range(coin, amount + 1):           # FORWARD
            dp[c] = min(dp[c], dp[c - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# Subset sum — the same table answering a yes/no question
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target, dp = total // 2, [False] * (total // 2 + 1)
    dp[0] = True
    for x in nums:
        for c in range(target, x - 1, -1):
            dp[c] = dp[c] or dp[c - x]
    return dp[target]
```

The loop direction **is** the variant, and it is the single most important line here. Backwards
means `dp[c - w]` still refers to the state *before* this item was considered, so the item is
used at most once. Forwards means it may already include this item, which is exactly what
allows reuse.

## Why it works

The full state is `(item index, remaining capacity)`, so there are `n × C` states with `O(1)`
work each: `O(n × C)` time. That is **pseudo-polynomial** — linear in the numeric value of the
capacity rather than in its input size — which is why knapsack is tractable for a capacity of
1,000 and not for one of 10⁹.

Space is `O(n × C)` for the full table, and the one-dimensional rolling version above brings it
to `O(C)` by overwriting a single row. That optimisation is where the loop direction comes
from, and it is worth deriving once rather than memorising.

In the two-dimensional form, `dp[i][c]` reads `dp[i-1][c]` and `dp[i-1][c-w]` — both from the
previous row. Collapsing to one row means those reads must still see pre-update values. Going
backwards, `c - w` is smaller than `c` and has not been touched yet this round, so it still
holds the previous row's value: each item is used once.

Going forwards, `c - w` **has** already been updated this round, so it may already include the
current item — and reading it lets the item be taken again. What looks like a bug is precisely
the unbounded semantics.

That is the derivation to be able to give. Candidates who memorise "backwards for 0/1" cannot
recover it when the problem is phrased differently; candidates who can explain the row collapse
get every variant right.

## Worked example

"Can `[1, 5, 11, 5]` be partitioned into two subsets with equal sums?"

The total is 22, so each half must be 11 — and the question becomes subset sum: can some subset
reach exactly 11? That reframing is the whole insight, and everything after it is mechanical.

Start with `dp = [True, False, …]` over capacities 0 to 11. Only 0 is reachable, using nothing.

Process 1, iterating capacity downwards. Capacity 1 reads `dp[0]`, which is true, so `dp[1]`
becomes true. Reachable sums: `{0, 1}`.

Process 5. Capacity 6 reads `dp[1]` — true — so `dp[6]` becomes true. Capacity 5 reads `dp[0]`,
so `dp[5]` becomes true. Reachable: `{0, 1, 5, 6}`.

Process 11. Capacity 11 reads `dp[0]`, so `dp[11]` becomes true — the answer is already yes,
via the single element 11.

Process the second 5 for completeness. Capacity 11 reads `dp[6]`, also true, confirming the
other partition `{1, 5, 5}`.

Both halves exist: `{11}` and `{1, 5, 5}`, each summing to 11.

Now see what the backwards iteration protected. Processing the first 5 forwards would set
`dp[5]` true, then capacity 10 would read `dp[5]` — already updated this round — and conclude
that 10 is reachable using **two** copies of a 5 that appears once. Backwards makes that
impossible, which is the entire difference between the two variants.

## Classic problems

- **Partition Equal Subset Sum** — subset sum for `total/2`, the example above.
- **Coin Change** — unbounded, minimising count.
- **Coin Change II** — the same items, counting combinations instead, where the loop order
  decides whether you count combinations or permutations.
- **Target Sum** — assign + or − to each number; reframes to subset sum after a little algebra,
  and the reframing is the difficulty.
- **Last Stone Weight II** — disguised as a simulation, actually "split into two subsets with
  the smallest difference".
- **Ones and Zeroes** — knapsack with **two** capacity dimensions, which is the natural step up.
- **Combination Sum IV** — counts permutations rather than combinations, so the loops swap
  order. Worth comparing against Coin Change II side by side.
- **Rod cutting** — the textbook unbounded case, and the clearest statement of the family.
