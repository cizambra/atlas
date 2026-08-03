---
type: razor
title: Trunk-based development
sidebar_position: 5
family: Delivery and operations
defines: [trunk-based development, merge debt]
sources:
  - "Paul Hammant, trunkbaseddevelopment.com (2017–)"
  - "Nicole Forsgren, Jez Humble and Gene Kim, Accelerate (2018)"
---

## Statement

Long-lived branches defer integration pain rather than removing it; merge daily and hide incomplete
work behind flags.

## In plain terms

**Trunk-based development** means everyone integrates to one shared branch at least daily, with
incomplete work hidden behind feature flags rather than isolated on a branch. The argument is about
where the pain goes: branching does not avoid integration conflict, it accumulates it.

## Decides

How long a branch should live before merging.

## Why it holds

**Merge debt** compounds. A branch diverges from trunk continuously, and the conflict surface grows
with both the branch's changes and everyone else's — so the cost of merging grows faster than
linearly with branch age.

The conflicts also get harder to resolve, not merely more numerous. A conflict found the same day
is between two changes both authors remember; one found after three weeks is between changes
nobody has in their head, and resolving it means reconstructing two intentions from diffs.

Semantic conflicts are the worse category and version control cannot see them. Two branches that
merge cleanly can still be incompatible — one renames a concept the other now depends on, one
changes an invariant the other assumes — and the only detection is integration.

The daily merge makes each of those small by construction. Nothing accumulates, so there is nothing
to reconstruct, and semantic conflicts surface within a day of being created.

Feature flags are what make it possible without shipping unfinished work. The code is on trunk and
integrated continuously; the *behaviour* is off until it is ready, which separates integration from
release entirely.

## Example

A team uses feature branches, one per story, merged when the story is complete. It works well until
a redesign requires a three-week branch.

Week one merges cleanly. Week two, trunk has moved: a shared utility was refactored, and the branch
uses the old signature in fourteen places. Week three, another team has restructured the module the
branch is rewriting.

The merge takes four days. Two of the conflicts are semantic — the code compiles and the tests pass
while a validation rule the branch depends on has been moved and now runs after the point the
branch assumed. That is found in production.

The trunk-based version does the same work in the same three weeks. The difference is that each
day's work merges to trunk behind a flag that is off, so the utility refactor is picked up within a
day and costs twenty minutes, and the validation-rule change is caught by trunk's test suite the
day it lands.

Same total work, same three weeks, and the four-day merge and the production incident are both
absent — because integration happened continuously instead of once.

## Limits

It requires feature flags, and flags are their own complexity. Every flag is a branch in the code,
combinations multiply, and a flag left in for two years is worse than the branch would have been —
so flag removal has to be part of the practice.

It also requires a fast, trustworthy test suite on trunk. Merging daily into a branch that is
frequently broken makes everyone's day worse, and the discipline depends on trunk being green.

Open-source and multi-team contribution models are a genuine exception. Pull requests from
untrusted contributors need review before landing, and the branch is doing a different job there —
isolation for review rather than isolation for work.

And short-lived branches are fully compatible with it. Trunk-based does not mean committing
directly to main; it means the branch lives hours or a day, not weeks.

## Source

Hammant has documented the practice and its variants at trunkbaseddevelopment.com, drawing on
long-standing practice at Google and other large monorepo organisations.

*Accelerate* provides the empirical support: teams with fewer than three active branches, branch
lifetimes under a day, and no code freezes are measurably higher performers on the delivery
metrics — one of the more robust findings in the dataset.
