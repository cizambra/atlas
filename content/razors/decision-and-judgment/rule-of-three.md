---
type: razor
title: The rule of three
sidebar_position: 17
family: Decision and judgment
defines: [rule of three]
sources:
  - "Martin Fowler, Refactoring (1999), crediting Don Roberts"
  - "Sandi Metz, 'The Wrong Abstraction' (2016)"
---

## Statement

Duplicate twice; abstract on the third occurrence, when you can finally see the shape.

## In plain terms

The **rule of three** says two examples are not enough to see what varies. With two, any number of
abstractions fit, and you will pick one that matches the accident rather than the pattern. The
third occurrence is what reveals which parts genuinely differ — and duplication is cheap while you
wait.

## Decides

When to extract an abstraction from repeated code.

## Why it holds

An abstraction is a claim about what varies and what does not. Two instances underdetermine that
claim: any difference between them could be the axis of variation, and you have no way to tell
which.

The third instance is the first constraint that can eliminate wrong candidates. What all three
share is much more likely to be essential, and what differs across all three is much more likely
to be the real parameter.

The asymmetry in cost is what makes waiting correct. Duplication is visible, annoying, and cheap
to remove; [[the wrong abstraction]] is invisible, comfortable, and expensive — because every
subsequent caller adds a parameter or a conditional to make it fit, and eventually nobody can
remove it.

There is also a filtering effect. A large fraction of two-instance duplication never reaches
three, because one of the two changes for its own reasons or is deleted — and abstracting at two
would have coupled things that turned out to be unrelated.

## Example

Two report generators share about forty lines of formatting. The duplication is obvious in review
and the natural response is to extract a shared formatter.

Extracted at two, the abstraction takes a config object with the four fields the two reports
differ on. It looks clean.

The third report arrives and needs a fifth field, plus a conditional for a header the others do
not have. The fourth needs a different date format and a flag to skip the totals row. By the sixth
the shared formatter takes eleven parameters, three of them booleans, and every change to it
requires checking six call sites.

Waiting would have produced a different result. Three concrete implementations make it obvious
that the genuinely shared part is the twelve lines of column alignment, and the thirty lines of
report-specific assembly were never the same thing — the abstraction that emerges is smaller,
correct, and does not grow parameters.

## Limits

Three is a heuristic, not a threshold. Some patterns are obvious at two — an established idiom, a
well-understood domain concept — and waiting is pedantry. Others are unclear at five.

It also does not apply to duplication that is dangerous rather than merely repetitive. Two copies
of a security check, a tax calculation, or anything where divergence is a correctness bug should
be unified immediately, because the failure mode is not maintenance cost.

And it is not a licence to leave duplication indefinitely. The rule says abstract at three, which
requires someone to notice the third — a codebase applying only the first half of the rule
accumulates copies nobody consolidates.

## Source

Fowler states it in *Refactoring* and attributes it to Don Roberts: the first time you do
something, just do it; the second time, wince at the duplication and do it anyway; the third time,
refactor.

Metz's 2016 essay is the complementary argument and explains why the rule is worth the wait —
duplication is far cheaper than the wrong abstraction, and the wrong abstraction is what premature
extraction reliably produces.
