---
type: pattern
title: DP on grids
sidebar_position: 21
group: Algorithms
summary: Two indices name a cell, each cell is built from its neighbours above and left, and the whole table collapses to one row.
defines: [grid DP, path counting]
razors: []
prereq: [dynamic-programming]
---

## The model

When the state is a position in a grid, `dp[r][c]` holds the answer for reaching or covering
that cell, built from the cells you could have come from.

Movement restricted to right and down is what makes these easy — a cell depends only on the one
above and the one to its left, both already computed if you fill row by row. That dependency
pattern is also what lets the table collapse to a single row, which is the standard follow-up.

## Recognise it

Reach for grid DP when:

- The input is a **matrix** and you move through it with restricted directions, usually right
  and down.
- The question is **count the paths**, **minimum cost path**, or **maximum collected**.
- Each cell's answer depends on **adjacent cells you have already computed**.
- The problem involves two sequences compared position by position, which is the same table
  with strings on the axes — see [[subsequence DP]].

The tell against it: if movement is unrestricted — you can go in any of four directions, or
revisit cells — the dependency is circular and DP does not apply. That is a graph problem, so
[[breadth-first search|BFS]] or Dijkstra.

## The template

```python
# Path counting — how many ways from top-left to bottom-right
def unique_paths(m, n):
    dp = [1] * n                              # first row: one way to each cell
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]                # from above (dp[c]) + from left (dp[c-1])
    return dp[-1]

# Minimum path sum — same shape, min instead of sum
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = 0
    for r in range(m):
        dp[0] += grid[r][0]                   # first column has one way in
        for c in range(1, n):
            dp[c] = min(dp[c], dp[c - 1]) + grid[r][c]
    return dp[-1]
```

In the rolled version, `dp[c]` before the assignment still holds the value from the row above,
and `dp[c-1]` already holds this row's value to the left. Both operands are exactly what the
two-dimensional version would have read, which is why the collapse is safe.

## Why it works

There are `m × n` states and each transition does `O(1)` work, so the cost is `O(m × n)` time —
you touch every cell once. Space is `O(m × n)` for the full table.

The collapse to `O(n)` follows from the dependency pattern. A cell reads only the row above and
its own row to the left, so nothing from two rows back is ever needed. Keeping one row and
overwriting it in place preserves both operands, as long as you iterate left to right.

That left-to-right requirement is the same reasoning as the loop direction in
[[knapsack DP]] — when the operand you need is "the previous row's value at this column", you
must read it before overwriting; when it is "this row's value to the left", it must already be
updated. Getting both from one array is what the ordering buys.

The base cases are where grid DP actually goes wrong rather than in the transition. The first
row and first column have only one way in, so they cannot use the general formula, and
initialising them incorrectly produces answers that are plausible and wrong. Writing them out
explicitly before the loop is worth the two lines.

Obstacles change only the base cases and one guard: a blocked cell has zero paths, and every
cell after a blockage in the first row inherits that zero rather than the default 1.

## Worked example

Count paths from the top-left to the bottom-right of a 3×3 grid, moving only right or down.

The first row and first column are all 1 — there is exactly one way to reach any of them, by
going straight along the edge.

```
1  1  1
1  ?  ?
1  ?  ?
```

Cell `(1,1)` can be reached from above or from the left, each with one path, so it is
`1 + 1 = 2`.

Cell `(1,2)` comes from above — 1 path — and from the left, which is the 2 just computed.
That gives 3.

```
1  1  1
1  2  3
1  ?  ?
```

Cell `(2,1)` mirrors `(1,2)`: 1 from the left, 2 from above, so 3. Then `(2,2)` reads 3 from
above and 3 from the left, giving 6.

Six paths across a 3×3 grid, and the arithmetic is the whole algorithm — nine cells, one
addition each.

Now the rolled version. Start with the first row as `[1, 1, 1]`. Processing the second row,
`dp[1] += dp[0]` makes it 2, then `dp[2] += dp[1]` makes it 3, giving `[1, 2, 3]`. Processing
the third row the same way gives `[1, 3, 6]`, and the answer is the last entry.

One array of three numbers rather than a 3×3 table. On a 1,000 × 1,000 grid that is a thousand
integers instead of a million, which is the reason the follow-up is asked.

## Classic problems

- **Unique Paths** / **Unique Paths II** — the counting base case, then obstacles.
- **Minimum Path Sum** — the same table with `min` and a cost per cell.
- **Triangle** — a grid with ragged rows, best filled bottom-up so the base case is trivial.
- **Maximal Square** — `dp[r][c]` is the largest square whose *bottom-right corner* is here,
  built from three neighbours rather than two. The state definition is the whole problem.
- **Dungeon Game** — must be filled **backwards** from the destination, because the requirement
  at a cell depends on what comes after. The best problem for testing whether you understand
  dependency order rather than the template.
- **Cherry Pickup** — two traversals at once, which pushes the state to four dimensions and is
  the hardest common member.
- **Edit Distance** / **Longest Common Subsequence** — the same table with strings on the axes,
  covered in [[subsequence DP]].
