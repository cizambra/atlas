---
type: pattern
title: Monotonic stack
sidebar_position: 9
group: Algorithms
summary: A stack kept sorted, which answers "next greater element" for every position in one pass instead of n².
defines: [monotonic stack, next greater element, previous smaller element, amortised push-pop]
razors: []
prereq: [complexity]
---

## The model

A **monotonic stack** is a stack you keep in sorted order by popping anything that would break
the order before pushing.

Those pops are the answer. When element `x` pops element `y`, you have just discovered that
`x` is the next greater element after `y` — the thing a nested loop would have searched for.
So one pass produces the answer for every position, because each element learns its answer at
the moment it is popped rather than by being scanned for.

## Recognise it

Reach for a monotonic stack when:

- The problem asks for the **next greater**, **next smaller**, **previous greater** or
  **previous smaller** element, for every position.
- You need the span or distance until some condition becomes true — "days until a warmer
  temperature".
- The problem involves **rectangles under a histogram**, trapped water, or any "how far can
  this extend" question.
- A brute force is "for each element, scan forward until…", which is `O(n²)`.
- The answer for an element becomes knowable only when a later element arrives.

That last cue is the general one. If elements are waiting for something and a new arrival can
resolve several of them at once, this is the structure.

## The template

```python
# Next greater element to the right, for every index
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []                              # holds INDICES, decreasing values
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            result[stack.pop()] = x         # x is the answer for that index
        stack.append(i)
    return result                           # anything left has no greater element
```

Four decisions define every variant, and naming them stops the improvising:

- **Store indices, not values.** You almost always need the distance, not just the value.
- **`<` or `>` in the while?** Pop smaller ones for *next greater*; pop larger for *next
  smaller*.
- **Strict or non-strict?** `<` versus `<=` decides how equal values are handled, which
  matters for duplicates.
- **Left to right or right to left?** Iterating backwards turns "next" into "previous".

## Why it works

Each index is pushed exactly once and popped at most once, so the total number of stack
operations is at most `2n` however the values are arranged. That is **amortised push-pop**
reasoning, and it makes the whole thing `O(n)` time and `O(n)` space.

The inner `while` is what makes people call this `O(n²)`, and stating why it is not is the
complexity answer being looked for. A single element can pop many others, but every pop
removes an index permanently — so across the whole run the loop body executes at most `n`
times in total, not `n` times per iteration.

The invariant is what makes it correct. The stack holds indices whose answers are still
unknown, in decreasing order of value. An element still on the stack has seen nothing greater
than itself yet; the moment something greater arrives, it is popped and answered. Anything
left at the end genuinely has no next greater element.

That decreasing order is not decoration. It guarantees that when `x` arrives, everything it
can answer sits contiguously on top of the stack — so you can pop until the order is restored
and stop, rather than searching the stack.

## Worked example

"Daily temperatures": for each day, how many days until a warmer one? Take
`[73, 74, 75, 71, 69, 72, 76]`.

Day 0 at 73 goes on the stack; nothing is waiting yet.

Day 1 at 74 is warmer than 73, so index 0 pops and its answer is `1 − 0 = 1`. Push day 1.

Day 2 at 75 pops day 1, answering `1`. Push day 2.

Days 3 and 4, at 71 and 69, are colder than 75, so nothing pops. The stack now holds days 2,
3, 4 with values 75, 71, 69 — decreasing, as the invariant requires.

Day 5 at 72 is warmer than 69 and 71, so it pops both. Day 4 gets `5 − 4 = 1` and day 3 gets
`5 − 3 = 2`. It is not warmer than 75, so day 2 stays. Push day 5.

Day 6 at 76 pops everything remaining: day 5 gets 1, day 2 gets 4. The stack empties.

The result is `[1, 1, 4, 2, 1, 1, 0]`. Note what day 5 did — one arrival resolved two waiting
days at once, which is the behaviour a nested loop cannot exploit and the reason this is
linear.

Seven pushes and six pops, thirteen operations for seven elements. The brute force would have
scanned forward from every day, and the gap grows quadratically.

## Classic problems

- **Next Greater Element I / II** — the template, then the circular version where you iterate
  twice and take indices modulo `n`.
- **Daily Temperatures** — the example above, and the cleanest introduction.
- **Largest Rectangle in Histogram** — the hard one, and the reason to learn this pattern.
  Each bar's rectangle extends until a shorter bar on each side, so it needs the
  **previous smaller element** and the next smaller one together.
- **Maximal Rectangle** — the histogram problem applied to each row of a binary matrix.
- **Trapping Rain Water** — solvable with a monotonic stack or with [[two pointers]]; being
  able to give both, and say which you prefer and why, is a strong answer.
- **Remove K Digits** / **Remove Duplicate Letters** — building the smallest result by popping
  larger digits while budget remains. The same structure used to *construct* rather than to
  query.
- **Sum of Subarray Minimums** — count how many subarrays each element is the minimum of,
  which needs previous-smaller and next-smaller boundaries for every position.
