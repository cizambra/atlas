---
type: razor
title: Essential vs accidental complexity
sidebar_position: 8
family: Laws of systems
defines: [essential complexity, accidental complexity, no silver bullet]
sources:
  - "Fred Brooks, 'No Silver Bullet — Essence and Accident in Software Engineering' (1986)"
---

## Statement

Tools only ever remove accidental complexity; the essential difficulty of the problem is untouched,
so no single change gives an order of magnitude.

## In plain terms

**Essential complexity** is the difficulty inherent in the problem — the rules of the domain, the
states that genuinely exist, the things that genuinely interact. **Accidental complexity** is
everything the implementation adds: build tooling, boilerplate, deployment, the framework's
opinions. Tools attack the second, and Brooks's point is that the first is what dominates.

## Decides

How much improvement to expect from a new language, framework or tool, and where the remaining
difficulty actually lives.

## Why it holds

The arithmetic is the argument. If accidental complexity is half the total effort, then removing
*all* of it doubles productivity — and no tool removes all of it. Once the accidental portion has
been substantially reduced, further tooling has a shrinking base to work on.

Brooks's claim in 1986 was that the industry had already harvested most of the large accidental
gains — high-level languages, time-sharing, unified environments — and that the remaining
difficulty was essential: specifying, designing and testing the conceptual construct itself.

Essential complexity is also irreducible by construction. A billing system that must handle
proration, tax jurisdictions, refunds and currency conversion is complex because billing is
complex, and no language makes those interactions go away.

The prediction has held. Forty years of languages, frameworks and platforms have produced real
gains and nothing resembling an order of magnitude, which is the specific claim the paper made.

## Example

A team is three months into a rewrite. The old system is a tangle and the new stack is modern:
better language, better framework, better deployment tooling.

The accidental complexity genuinely falls. Deployment goes from a checklist to a command, the build
is four minutes instead of twenty, and the boilerplate per endpoint drops from eighty lines to
twelve.

What does not change is the domain. The subscription rules still have proration, plan changes
mid-cycle, three tax regimes, refunds against modified plans, and grandfathered pricing — and every
one of those interacts with the others.

Six months in, the new system is roughly as hard to change as the old one in the areas that matter,
because the difficulty was never in the boilerplate. The gains are real and are not the ten-times
improvement the rewrite was justified with.

The corollary is where the real leverage was: deleting three of the grandfathered pricing schemes
would have removed more complexity than the entire rewrite, because it removes essential complexity
rather than accidental.

## Limits

The distinction is less clean than it sounds. What counts as essential depends on the requirements,
and requirements are negotiable — a great deal of apparently essential complexity is a product
decision nobody has revisited.

Brooks's specific claim was about the following decade, and dismissing tooling improvements on his
authority is a misreading. Accidental complexity is still worth attacking; the argument is about
expected magnitude, not about value.

And the framing can excuse genuine mess. Calling a badly structured system's difficulty "essential"
is a way of avoiding the work, and the honest test is whether a competent rewrite of one module
would be much simpler.

## Source

Brooks published "No Silver Bullet" in 1986, arguing that no single development in the following
decade would produce an order-of-magnitude improvement in productivity, reliability or simplicity.

The essence/accident vocabulary is Aristotle's, and Brooks uses it precisely: accidents are
properties a thing has but need not have, essence is what makes it the thing it is. The paper
remains the standard reference for why productivity claims about tools should be discounted.
