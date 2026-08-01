---
type: pattern
title: DP on subsequences
sidebar_position: 23
group: Algorithms
summary: Two strings on two axes, where each cell asks "do these characters match" — and the one-dimensional cousin that runs in n log n.
defines: [subsequence DP, longest common subsequence, edit distance, longest increasing subsequence, patience sorting]
razors: []
prereq: [dp-grids]
---

## The model

When a problem compares two sequences, the state is a position in each: `dp[i][j]` is the
answer for the first `i` characters of one and the first `j` of the other.

Every transition asks one question — **do these two characters match?** If they do, the answer
extends the diagonal neighbour. If not, it takes the best of skipping one character or the
other. That single fork covers most of this family, which is why the problems look
interchangeable once you see it.

## Recognise it

Reach for subsequence DP when:

- Two **strings or sequences** are compared, and the answer is a length, a count, or a
  distance.
- The word **subsequence** appears — non-contiguous, so [[sliding window]] does not apply.
- The problem involves **transforming** one string into another with insert, delete or replace.
- You are asked for the longest, shortest, or number of ways to match two things.

The single-sequence case is different and worth separating:

- **Longest increasing subsequence** has one string, and the state is "the LIS ending at `i`",
  which is `O(n²)` naively and `O(n log n)` with the patience trick below.

The tell against it: if the problem says **substring** or **subarray**, the elements must be
contiguous and you probably want a window or [[prefix sum|prefix sums]] instead.

## The template

```python
# Longest common subsequence — the base pattern
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1          # match: extend the diagonal
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])   # skip one or the other
    return dp[m][n]

# Edit distance — same table, three operations instead of two
def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i          # delete everything
    for j in range(n + 1): dp[0][j] = j          # insert everything
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]      # free — no operation needed
            else:
                dp[i][j] = 1 + min(dp[i-1][j-1],  # replace
                                   dp[i-1][j],    # delete
                                   dp[i][j-1])    # insert
    return dp[m][n]

# LIS in O(n log n) — patience sorting
from bisect import bisect_left
def lis(nums):
    tails = []                       # tails[k] = smallest tail of an LIS of length k+1
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)          # extends the longest run
        else:
            tails[i] = x             # a smaller tail for that length
    return len(tails)
```

The `i - 1` indexing against `dp[i][j]` is the standard off-by-one trap: row `i` corresponds to
character `i - 1`, because row 0 means "the empty prefix".

## Why it works

The table is `m × n` with `O(1)` per cell, so `O(m × n)` time and space. Both strings at length
1,000 gives a million cells, which is fine; both at 100,000 does not fit, and that bound is how
you know DP is intended.

Space rolls down to `O(min(m, n))` because each cell reads only the previous row and the
current row to the left — the same collapse as [[grid DP]]. The catch is that rolling loses the
ability to reconstruct the actual subsequence, since backtracking needs the whole table. If the
problem wants the string rather than its length, keep it.

The match-or-skip fork is worth stating as a claim rather than a rule. If the last characters
match, no optimal solution is worse for including that pair, so extending the diagonal is safe.
If they do not match, at least one of the two characters is unused, and trying both is what
guarantees you find the better one.

**Patience sorting** for LIS is the genuinely different one. `tails[k]` holds the smallest
possible tail among all increasing subsequences of length `k + 1`, and it is necessarily
sorted — so each element binary-searches its position, giving `O(n log n)`. The array is *not*
the subsequence itself, only its length, and saying that unprompted is a good signal.

## Worked example

Edit distance between `horse` and `ros`.

Base cases first: turning `horse` into an empty string costs 5 deletions, and building `ros`
from nothing costs 3 insertions. Those fill the first column and row.

Now the first real cell — `h` against `r`. They differ, so the cost is 1 plus the best of
replace, delete or insert. All three neighbours are 1 or 0, and the minimum path gives 1.

Working along the first row: `ho` against `r` costs 2, `hor` against `r` costs 2, since the `r`
now matches and the diagonal is free.

That free diagonal is the mechanism worth watching. When `r` in `horse` meets `r` in `ros`, the
cell inherits its diagonal neighbour unchanged — a match costs nothing, so the whole benefit of
alignment shows up as cells that do not increment.

Continuing to the bottom-right gives 3, and the operations are recoverable by walking back:
replace `h` with `r`, replace `o`... in fact the standard answer is replace `h`→`r`, remove
`r`, remove `e`. Three operations.

Fifteen cells for a 5×3 comparison, each one addition or a three-way minimum. The naive
alternative — trying every alignment of the two strings — is exponential, and the table
collapses it because most alignments share prefixes.

## Classic problems

- **Longest Common Subsequence** — the base pattern, and the one every other problem here
  reduces to.
- **Edit Distance** — the example, and the canonical 2D DP interview question.
- **Longest Palindromic Subsequence** — LCS of the string against its own reverse, which is a
  reduction worth knowing because it looks like a new problem.
- **Distinct Subsequences** — counting rather than maximising, so the transition adds instead
  of taking a max.
- **Interleaving String** — three strings, but the state is still two indices since the third
  position is implied.
- **Longest Increasing Subsequence** — the `O(n²)` DP and the `O(n log n)` patience version,
  and being asked to improve from one to the other is common.
- **Russian Doll Envelopes** — sort by one dimension, then LIS on the other. The reduction is
  the difficulty.
- **Regular Expression Matching** / **Wildcard Matching** — the same table with pattern rules,
  and the hardest members of the family.
