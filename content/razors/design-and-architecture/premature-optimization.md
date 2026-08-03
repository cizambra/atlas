---
type: razor
title: Premature optimisation
sidebar_position: 7
family: Design and architecture
defines: [premature optimisation, the critical 3%]
sources:
  - "Donald Knuth, 'Structured Programming with go to Statements' (1974)"
  - "Michael Jackson, Principles of Program Design (1975) — the 'don't do it yet' rules"
---

## Statement

Knuth said forget small efficiencies about 97% of the time — and immediately added that we must not
pass up the critical 3%.

## In plain terms

**Premature optimisation** is the most-quoted and most-truncated line in software. The full
sentence has two halves: ignore small efficiencies most of the time, *and* do not pass up the
critical 3%. The quote is usually deployed to end a performance conversation, which is the opposite
of what the paper argues.

## Decides

Whether to optimise now, and how to know which code is in the 3%.

## Why it holds

The distribution is extremely skewed. Most code contributes almost nothing to runtime — it executes
once, or rarely, or is dwarfed by something else — so effort spent on it is bounded above by a
number close to zero, which is [[Amdahl's Law]] applied to a codebase.

Optimisation also costs readability, and readability is what most of the lifetime cost of code is
made of. Paying that everywhere to gain nothing almost everywhere is a bad trade repeated many
times.

The second half is the part that matters and is routinely dropped. **The critical 3%** genuinely
decides system behaviour, and the paper's argument is that this code deserves careful attention —
Knuth's own examples are hand-optimised inner loops.

What makes the whole thing work is the word Knuth put next to it: measurement. His conclusion is
that a good programmer will look carefully at the critical code, *after that code has been
identified*, and that intuition about which code is critical is unreliable.

The version of this razor that is actually useful is therefore not "do not optimise". It is "do not
optimise before measuring", which permits far more optimisation than the truncated quote does.

## Example

A review flags a nested loop as inefficient. The author replies "premature optimisation is the root
of all evil" and the comment is dropped.

The loop is O(n²) over a collection that reaches about 50,000 in production and runs on every
request. It is 60% of the endpoint's runtime, and it is precisely the 3%.

The same quote is used two weeks later to defend an unrelated change: a hand-rolled string builder
in a configuration parser that runs once at startup, saving 4 milliseconds and costing thirty lines
of unreadable code. That one *is* premature, and the quote was not invoked against it.

The distinction between the two cases is not available from the quote. It is available from a
profiler, in about ten minutes, and the profiler would have flagged the first and ignored the
second.

Knuth's actual instruction covers both correctly: measure, then optimise what the measurement
identifies, and leave the rest alone.

## Limits

Some optimisation genuinely cannot wait. Algorithmic choice and data-structure choice are
architectural — swapping a list for a hash map after a system is built can be a rewrite, and
"measure first" does not apply to a decision that forecloses the measurement.

Design for a known scale is also not premature. If you know the collection will hold a million
items, choosing an appropriate structure on day one is engineering rather than speculation.

And the quote is used to defend genuinely careless code. There is a difference between not
micro-optimising and not thinking about complexity at all, and the razor covers the first.

## Source

The line comes from Knuth's 1974 paper on structured programming, and the surrounding sentences are
the ones worth having: programmers waste enormous amounts of time thinking about the speed of
noncritical parts, and these attempts at efficiency have a strong negative impact when debugging and
maintenance are considered. "We should forget about small efficiencies, say about 97% of the time:
premature optimization is the root of all evil. Yet we should not pass up our opportunities in that
critical 3%."

Knuth has attributed the sentiment to Hoare, and Hoare to Knuth; the written source is Knuth's
paper. Michael Jackson's contemporaneous rules — "Don't do it" and, for experts, "Don't do it yet" —
make the same point more bluntly.
