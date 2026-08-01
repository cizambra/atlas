---
type: pattern
title: Bit manipulation
sidebar_position: 25
group: Algorithms
summary: Treat a number as a row of switches — which gives you a set in one integer, and XOR's self-cancelling property for free.
defines: [bitmask, XOR, lowest set bit, bitmask DP, Brian Kernighan's algorithm]
razors: []
prereq: [complexity]
---

## The model

An integer is 32 or 64 switches. Bit operations manipulate them all at once, in one CPU
instruction.

Two things come out of that. A **bitmask** stores a set of up to 64 elements in a single
integer, with union, intersection and membership as single operations — which is what makes
subset enumeration tractable. And **XOR** has an algebraic property nothing else does: `x ^ x
= 0` and `x ^ 0 = x`, so pairs cancel and whatever appears an odd number of times survives.

## Recognise it

Reach for bit manipulation when:

- Elements appear **in pairs** and you want the unpaired one — that is XOR, and it costs
  `O(1)` space where a hash map costs `O(n)`.
- You need to **enumerate subsets**, and `n ≤ 20` or so. Each integer from `0` to `2ⁿ − 1` is a
  subset.
- The state of a DP is "which of these `n` things have I used", with `n` small — **bitmask DP**.
- The problem mentions **binary representation**, counting set bits, or powers of two.
- The constraint says `O(1)` space and your instinct was a set.

The tell against it: readable code matters more than cleverness in most interviews. Reach for
bits when they give an actual complexity or space improvement, not to compress two lines into
one.

## The template

```python
# The operations worth having memorised
x & 1                 # is the last bit set? (odd/even)
x >> 1                # divide by 2
x << 1                # multiply by 2
x & (1 << i)          # is bit i set?
x | (1 << i)          # set bit i
x & ~(1 << i)         # clear bit i
x ^ (1 << i)          # flip bit i

x & (x - 1)           # clear the LOWEST set bit      ← the useful one
x & -x                # isolate the lowest set bit
x & (x - 1) == 0      # is x a power of two?

# Count set bits — Brian Kernighan: loops once per SET bit, not per bit
def count_bits(x):
    count = 0
    while x:
        x &= x - 1
        count += 1
    return count

# Enumerate every subset of n elements
for mask in range(1 << n):
    subset = [items[i] for i in range(n) if mask & (1 << i)]

# XOR: find the element appearing once when all others appear twice
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result
```

`x & (x - 1)` is the identity worth understanding rather than memorising. Subtracting 1 flips
the lowest set bit to 0 and turns every bit below it into 1; the AND then keeps only the bits
above, clearing exactly that one.

## Why it works

Every operation here is one CPU instruction, so it is `O(1)` regardless of the value.

Counting bits naively is `O(32)`. **Brian Kernighan's algorithm** clears the **lowest set
bit** each round with `x & (x - 1)`, so it loops once per set bit rather than once per bit —
`O(set bits)`, and the answer to "can you do better".

The XOR argument is the one to be able to state. XOR is commutative and associative, so order
does not matter, and `x ^ x = 0` means every pair annihilates regardless of where the elements
sit. Fold the whole array and only the unpaired value remains — `O(n)` time, `O(1)` space,
where the hash-map solution needs `O(n)` memory.

Subset enumeration works because an `n`-bit integer *is* a subset indicator: bit `i` set means
element `i` is in. Counting from `0` to `2ⁿ − 1` therefore visits every subset exactly once,
which is why bitmasks and exponential problems go together.

That also bounds where this applies. Sixty-four bits is a hard ceiling, and `2ⁿ` becomes
unusable long before that — `n = 20` is a million subsets and fine, `n = 30` is a billion and
usually not. **Bitmask DP** lives in that window: states like "which cities have I visited" for
the travelling salesman, where the state space is `2ⁿ × n`.

One caution worth raising unprompted. In languages with fixed-width integers, `1 << 31`
overflows a signed 32-bit int, and right-shifting a negative number is arithmetic rather than
logical. Python has arbitrary-precision integers and sidesteps both, which is worth saying if
you are writing Python and the interviewer is thinking in Java.

## Worked example

"Every number appears twice except one — find it." Take `[4, 1, 2, 1, 2]`.

The obvious answers both cost memory. A hash map counting occurrences is `O(n)` space; sorting
and scanning for the odd one out is `O(n log n)` time.

XOR does it in one pass with a single variable. Fold left to right, starting at 0.

`0 ^ 4` is 4. Then `4 ^ 1` is 5. Then `5 ^ 2` is 7.

Now the second 1 arrives: `7 ^ 1` is 6. And the second 2: `6 ^ 2` is 4.

The answer is 4. But the running values — 4, 5, 7, 6 — are not meaningful on their own, which
is what makes this feel like a trick rather than an argument.

The argument is that order does not matter. Because XOR is commutative and associative, the
same fold can be rearranged as `(1 ^ 1) ^ (2 ^ 2) ^ 4`, which is `0 ^ 0 ^ 4`, which is 4. The
pairs cancel wherever they happen to sit, and the intermediate values are simply the fold
caught mid-cancellation.

That reordering is the explanation to give out loud. It shows the result does not depend on the
input being arranged conveniently — which is exactly the doubt an interviewer has when someone
produces a bit trick.

`O(n)` time and `O(1)` space, against `O(n)` space for the map. The follow-up — "what if every
number appears three times except one?" — breaks XOR, because triples do not cancel, and needs
counting bits at each position modulo 3.

## Classic problems

- **Single Number** — the example, and the cleanest use of XOR.
- **Single Number II / III** — three-times and two-singles variants, which are where the
  technique stops being obvious.
- **Number of 1 Bits** / **Counting Bits** — Kernighan's loop, then the DP relation
  `bits[i] = bits[i >> 1] + (i & 1)`.
- **Power of Two** — `x > 0 and x & (x - 1) == 0`, and being able to explain why.
- **Missing Number** — XOR the indices against the values, so everything cancels but the gap.
- **Subsets** — the bitmask enumeration, and a good comparison against the
  [[backtracking]] version.
- **Reverse Bits** / **Sum of Two Integers** — arithmetic without arithmetic operators, which
  is mostly about carry propagation.
- **Travelling salesman / Partition to K Equal Sum Subsets** — bitmask DP, where the state is
  which elements are used and `n` is small by construction.
