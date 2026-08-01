---
type: pattern
title: Backtracking
sidebar_position: 17
group: Algorithms
summary: Try a choice, recurse, undo it — the systematic way to enumerate everything, and pruning is what makes it finish.
defines: [backtracking, choose-explore-unchoose, pruning, decision tree, state space]
razors: []
prereq: [trees-and-traversals]
---

## The model

Make a choice, recurse to see where it leads, then undo it and try the next one. That
**choose-explore-unchoose** cycle is the whole pattern.

It is a depth-first walk of a **decision tree** whose nodes are partial solutions. Backtracking
is what you use when you must produce the actual solutions rather than count them or optimise
over them — and since the tree is exponential, **pruning** branches that cannot possibly work
is not an optimisation but the thing that makes it terminate in time.

## Recognise it

Reach for backtracking when:

- The problem says **"find all"**, **"generate every"**, or **"list the"** — permutations,
  subsets, combinations, valid arrangements.
- You need the solutions themselves, not a count and not the best one.
- The input bound is small: `n ≤ 20` or so, because the answer space is exponential and the
  bound is telling you that is acceptable.
- The problem is a puzzle with constraints — sudoku, N-queens, word search, crossword fill.
- You are building something incrementally and can detect an invalid partial state early.

The tell against it: if you only need a **count** or a **maximum**, that is
[[dynamic programming]], and enumerating everything to count it is exponentially wasteful.

## The template

```python
def backtrack(path, choices, results):
    if is_complete(path):
        results.append(list(path))       # COPY — path keeps mutating
        return
    for choice in choices:
        if not is_valid(path, choice):   # prune: skip whole subtrees
            continue
        path.append(choice)              # choose
        backtrack(path, next_choices(choices, choice), results)   # explore
        path.pop()                       # unchoose — restore for the sibling

# Subsets — the take/skip shape
def subsets(nums):
    out, path = [], []
    def go(i):
        if i == len(nums):
            out.append(list(path))
            return
        go(i + 1)                        # skip nums[i]
        path.append(nums[i])
        go(i + 1)                        # take nums[i]
        path.pop()
    go(0)
    return out
```

Two details cause most bugs. **Copy the path** when recording a solution — appending the live
list stores a reference that later mutations will corrupt. And **undo exactly what you did**,
so the sibling branch starts from the state it expects.

## Why it works

The recursion explores every node of the decision tree exactly once, and the tree's size is the
**state space**. Subsets give `O(2ⁿ)` because each element is in or out. Permutations give
`O(n!)` because each position chooses from what remains. Combinations of size `k` give
`O(C(n,k))`.

Multiply by the cost of copying a solution, usually `O(n)`, and that is your time. Space is
`O(depth)` for the call stack plus the path, which is `O(n)` — small, and worth stating,
because the output is what is large rather than the working memory.

Pruning is where the real difference lies. Checking validity *before* recursing eliminates an
entire subtree, so a check costing `O(1)` can remove `O(2^k)` work. N-queens has `8!` = 40,320
arrangements to consider naively; pruning on column and diagonal conflicts as you place each
queen cuts it to about 2,000 nodes visited.

That is why the validity check belongs at the top of the loop rather than at the leaf. Testing
a completed arrangement and rejecting it still pays for building all of it — the whole art of
backtracking is failing as early as possible.

## Worked example

Generate all subsets of `[1, 2, 3]`.

At each element there are two choices — skip it or take it — so the decision tree is a binary
tree of depth 3, with 8 leaves.

Start with an empty path at index 0. Skipping 1, then skipping 2, then skipping 3 reaches a
leaf and records `[]`.

Unwind one level. Now take 3 instead, which records `[3]`, then pop it.

Unwind again and take 2. From there, skipping 3 records `[2]` and taking 3 records `[2, 3]`.
Pop both, and the entire branch where 1 was skipped is finished.

Now the top-level choice flips: take 1. The same four combinations repeat beneath it, giving
`[1]`, `[1, 3]`, `[1, 2]`, and `[1, 2, 3]`.

Eight subsets from eight leaves, which is `2³`. Each `path.pop()` is what makes the next
branch start clean — without it, `[1, 2]` would leak into the branch that was supposed to
exclude 2, and the results silently accumulate garbage.

The generalisation is worth carrying. The shape of the tree comes from the choice available at
each step: two choices per element gives subsets, `n − i` choices per position gives
permutations, and a constraint that eliminates choices early is pruning. Every problem in the
family is those three knobs.

## Classic problems

- **Subsets** / **Subsets II** — the take-or-skip tree, then the duplicate-handling version
  where you sort first and skip repeats at the same level.
- **Permutations** / **Permutations II** — choosing from what remains, with the same
  duplicate wrinkle.
- **Combination Sum** — reusable choices, so the recursion passes `i` rather than `i + 1`.
- **Letter Combinations of a Phone Number** — the gentlest introduction to the shape.
- **Generate Parentheses** — pruning made obvious: never close more than you have opened, and
  the constraint eliminates most of the tree before it is built.
- **Word Search** — backtracking on a grid, marking cells visited and unmarking on the way
  out, which is the clearest demonstration of undoing state.
- **N-Queens** — the canonical pruning problem, and the one where the cost difference between
  checking early and checking at the leaf is enormous.
- **Palindrome Partitioning** — backtracking plus a palindrome check, and the natural place to
  be asked about memoising that check.
