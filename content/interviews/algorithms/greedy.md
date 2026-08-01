---
type: pattern
title: Greedy
sidebar_position: 18
group: Algorithms
summary: Take the locally best option and never reconsider — which is either the whole solution or completely wrong, with nothing in between.
defines: [greedy algorithm, exchange argument, greedy choice property, locally optimal]
razors: [type-1-type-2-decisions]
prereq: [complexity]
---

## The model

A **greedy algorithm** takes whatever looks best right now and commits. No backtracking, no
considering alternatives, no table of subproblems.

The catch is that this is either exactly right or badly wrong, and the two look identical
until you check. What separates them is the **greedy choice property**: the **locally optimal**
choice must never rule out the globally best answer. When that holds, greedy is the
simplest and fastest solution available. When it does not, greedy produces a confident wrong
answer, which is worse than a slow correct one.

## Recognise it

Consider greedy when:

- The problem asks for a **maximum or minimum**, and each choice is independent of the ones
  before it.
- Sorting by some key makes the right choice obvious — this is the strongest signal.
- The problem involves **scheduling**, **intervals**, or **making change** with well-behaved
  denominations.
- A DP solution exists but the state feels unnecessary, because past choices do not constrain
  future ones.

The tell against it — and the more important list:

- A locally best choice can **block** a better global outcome. Coin change with denominations
  `[1, 3, 4]` and a target of 6: greedy takes 4, then needs two 1s for three coins, when two 3s
  would have done it in two.
- You need to **count** solutions rather than find one. Greedy finds one path, not all of them.
- Future choices depend on the full history of past ones. That is [[dynamic programming]].

## The template

There is no code skeleton, because greedy is a *decision* rather than a structure. What there
is instead is a procedure for deciding whether to use it.

```python
# 1. Name the greedy choice explicitly, in one sentence.
#    "Always take the interval that ends earliest."

# 2. Try to break it. Spend real effort on a counterexample.
#    Small inputs, ties, extremes, empty, one element.

# 3. If you cannot break it, sketch the exchange argument (below).

# 4. Only then write it — and it is usually four lines.

def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])        # earliest END, not start
    count, last_end = 0, float('-inf')
    for start, end in intervals:
        if start >= last_end:                 # take it, never reconsider
            count, last_end = count + 1, end
    return count
```

Step 2 is the one people skip, and skipping it is how greedy answers go wrong in interviews.
Two minutes spent hunting a counterexample is cheaper than twenty minutes defending an
algorithm that does not work.

## Why it works

When it works, greedy is `O(n log n)` for the sort plus `O(n)` for one pass — so the sort
dominates, and it beats the `O(n²)` or `O(n × target)` a DP solution would cost. That gap is
the entire reason to care.

The justification is the **exchange argument**, and being able to sketch it is what turns a
guess into an answer. It runs like this:

1. Assume an optimal solution that differs from the greedy one.
2. Find the first place they differ.
3. Swap the optimal solution's choice for the greedy one, without making it worse.
4. Repeat — the optimal solution becomes the greedy one, so greedy was optimal too.

Make it concrete with interval scheduling. Greedy takes the interval ending earliest, so
suppose some optimal solution instead takes one ending later.

Swapping it for the earliest-ending one leaves at least as much room for everything after, so
the count cannot drop. Every difference exchanges away, and greedy matches the optimum.

That argument is also a test. If you try to construct the exchange and find a swap that makes
things worse, you have found your counterexample and greedy is wrong — which is exactly what
you wanted to learn before writing code.

## Worked example

"Jump Game": each element says the maximum jump length from that position. Can you reach the
end?

The DP answer is to compute reachability for every index from every earlier index, which is
`O(n²)`. It works and it is more machinery than the problem needs.

The greedy observation: track the **furthest index reachable so far**. Walk left to right, and
at each position, if it is beyond the furthest reach, you are stuck. Otherwise extend the reach
with `i + nums[i]`.

Trace `[2, 3, 1, 1, 4]`. At index 0, reach becomes 2. At index 1, which is within reach, the
reach extends to `1 + 3 = 4`. That already covers the last index, so the answer is true.

Trace `[3, 2, 1, 0, 4]`. Index 0 gives reach 3, and index 1 gives `1 + 2 = 3` — no
improvement. Index 2 gives 3, and index 3 gives `3 + 0 = 3`.

Now index 4 is beyond the reach of 3, so it is unreachable and the answer is false. One pass,
`O(n)` time, `O(1)` space.

The exchange argument for why this is safe: if any position within the reachable prefix can
extend the reach further, taking the maximum reach at every step never loses an option — a
position reachable by some path is reachable by the furthest-reach path too. Nothing is
foreclosed by being greedy here, which is precisely the property that fails in coin change.

## Classic problems

- **Jump Game** / **Jump Game II** — the example, then the minimum-jumps version where the
  greedy choice is a level boundary.
- **Non-overlapping Intervals** / **Meeting Rooms** — the earliest-end rule, and the cleanest
  exchange argument in the set.
- **Best Time to Buy and Sell Stock II** — take every upward move; the proof is that any
  profitable multi-day hold decomposes into consecutive daily gains.
- **Gas Station** — one pass with a running tank, plus the observation that if the total is
  non-negative a solution must exist.
- **Task Scheduler** — schedule the most frequent task first, which is greedy plus a heap.
- **Partition Labels** — extend the current partition to the last occurrence of everything in
  it, which is greedy and the [[interval]] sweep at once.
- **Coin Change** — the counterexample. Greedy works for real currencies and fails for
  `[1, 3, 4]`, which is why the general problem is DP. Knowing *why* this one resists greedy
  is worth more than any of the successes above.
