---
type: razor
title: Sacrificial architecture
sidebar_position: 15
family: Design and architecture
defines: [sacrificial architecture]
sources:
  - "Martin Fowler, 'SacrificialArchitecture' (2014)"
  - "Randy Shoup, eBay and Google architecture evolution talks (2013–)"
---

## Statement

Build knowing you will throw it away — designing for a lifespan you will not reach costs more than
the rewrite.

## In plain terms

**Sacrificial architecture** is code written deliberately for a limited life. Not badly — well
enough for its actual span — and without the generality, abstraction and scaling machinery that a
ten-year system would need. The idea is that the replacement is the plan rather than the failure.

## Decides

How much to invest in a design when the requirements will be different in two years.

## Why it holds

The cost of building for longevity is paid immediately and the benefit is conditional. Generality,
extension points and scaling infrastructure all cost time now, and they only pay out if the system
survives long enough and the predictions were right — and predictions about requirements two years
out are usually wrong.

The information argument matters more. You will know far more about the problem after two years of
running something than you can know now, and a replacement built with that knowledge is better than
anything the original design could have anticipated.

Fowler's point about the reaction to a rewrite is the useful one. Throwing away a system is
routinely treated as an admission of failure, which produces the opposite behaviour: teams
over-engineer to avoid it, and end up maintaining an over-general system that fits nothing well.

Shoup's account of eBay's evolution is the empirical version — several complete platform
replacements, each appropriate to its era's scale, and none of them a failure of the previous
design.

The practical corollary is that the seams matter more than the internals. A sacrificial component
with clean boundaries is cheap to replace; one entangled with everything else is not, whatever its
internal quality.

## Example

A startup needs a billing system. The team knows the pricing model will change substantially as the
product finds its market.

The durable version builds for the eventual state: a rules engine for arbitrary pricing, a
plugin architecture for payment providers, an event-sourced ledger. Four months, and it can express
pricing models the company will never have.

The sacrificial version hard-codes the two plans that exist, integrates one payment provider
directly, and writes to an ordinary table. Three weeks.

Eighteen months later the pricing model has changed four times, none of which the rules engine
predicted correctly — it expressed the wrong axis of variation, so each change fought it. The
sacrificial version was edited four times, cheaply, because a hard-coded thing is easy to change
when you know what to change it to.

At month eighteen both need replacing, and the sacrificial one is easier to replace: it is smaller,
it has no dependents relying on its generality, and the four pricing changes taught the team what
the real requirements are.

## Limits

It is not a licence for low quality. Sacrificial means limited scope and limited generality, not
untested, undocumented or unclear — the code still has to be maintained for its whole life, and
that life is usually longer than intended.

The lifespan estimate is also frequently wrong in the dangerous direction. Systems built for two
years routinely run for ten, and "we will replace it" is one of the least reliable predictions in
software.

And the replacement has to actually be funded. A sacrificial architecture with no plan or budget for
the sacrifice is simply technical debt with a nicer name, and the organisation will discover that
around year four.

## Source

Fowler wrote up the pattern in 2014, with examples including eBay's successive rewrites and
Google's replacement of early systems, arguing that the willingness to discard is a marker of
successful scaling rather than of poor initial design.

Shoup's talks on eBay and Google supply the case histories, and his framing is worth carrying: each
architecture was correct for its scale, and the failure would have been trying to build the fifth
generation on day one.
