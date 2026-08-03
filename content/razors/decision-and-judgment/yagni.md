---
type: razor
title: YAGNI
sidebar_position: 16
family: Decision and judgment
defines: [YAGNI]
sources:
  - "Ron Jeffries and Kent Beck, Extreme Programming (late 1990s)"
  - "Martin Fowler, 'Yagni' (2015)"
---

## Statement

Build it when you need it, not when you foresee needing it — foresight is usually wrong and always
expensive.

## In plain terms

**YAGNI** — you aren't gonna need it — says that building for an anticipated requirement is a bet,
and the odds are bad. Most anticipated requirements never arrive, arrive in a different shape, or
arrive after the code has been changed for other reasons. Meanwhile the speculative generality is
paid for every day by everyone reading it.

## Decides

Whether to build the general version now or the specific version now.

## Why it holds

Fowler's decomposition of the cost is the clearest argument. Building speculatively costs the
build, and it also costs carry — every day the extra abstraction exists, someone reads past it,
maintains it, and works around it — and it costs repair if the anticipated need arrives in a
different shape than expected.

Against those three certain costs sits an uncertain benefit. The feature might be needed, in
roughly the imagined form, before the code changes for unrelated reasons — and each of those
conditions is less than certain, so their product is small.

The information argument is stronger still. When the requirement actually arrives you know its
real shape, and the version you build then is better than the one you would have guessed, usually
by a lot.

And the cost of waiting is smaller than it feels. Adding the capability later, in a codebase you
have kept simple, is normally cheaper than adapting a speculative abstraction that guessed wrong —
which is the case people systematically misjudge.

## Example

A team building a payment integration knows the company will eventually support more providers.
So the first integration is built behind a provider abstraction: an interface, a factory, a
configuration layer, and a set of adapter types.

Eighteen months later the second provider arrives. Almost none of the abstraction fits: the new
provider is asynchronous where the first was synchronous, has a completely different refund model,
and requires a webhook flow the interface has no concept of.

The abstraction is rewritten, and the eighteen months of carry — every engineer reading through
two layers of indirection to find one implementation, every change made in three files instead of
one — bought nothing.

The YAGNI version writes the first integration directly, discovers the real variation when the
second arrives, and extracts the abstraction from two working examples. That abstraction fits,
because it was derived rather than predicted.

## Limits

It applies to speculative *features*, not to ordinary good design. Fowler is explicit about this:
YAGNI is not an argument against clean code, tests, or interfaces that serve a present need.

Some things are genuinely much cheaper to build early. Anything that changes a persisted data
shape, a public API, or a security boundary is expensive to retrofit — and for those the
[[Type 1 decision|one-way door]] reasoning outranks YAGNI.

The distinction that resolves most cases is between building the thing and keeping the seam. You
can decline to build multi-provider support and still avoid hard-coding the provider name in forty
places, and that is not a YAGNI violation — it is what makes the later change cheap.

## Source

YAGNI comes out of Extreme Programming in the late 1990s, usually credited to Ron Jeffries, as one
of the practices that made XP's incremental design work: without it, "we will refactor later"
becomes a licence to build everything now.

Fowler's 2015 essay is the most careful treatment, and it is where the cost decomposition —
build, carry, repair — comes from, along with the important clarification that YAGNI is about
presumptive features rather than about design quality.
