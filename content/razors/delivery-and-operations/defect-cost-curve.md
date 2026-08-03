---
type: razor
title: The defect cost curve
sidebar_position: 18
family: Delivery and operations
defines: [defect cost curve, shift left]
sources:
  - "Barry Boehm, Software Engineering Economics (1981)"
  - "Laurent Bossavit, The Leprechauns of Software Engineering (2015) — the evidence critique"
---

## Statement

A bug costs more the later it is found — directionally true, though the famous 100x figure is not
well supported.

## In plain terms

The **defect cost curve** is the claim that fixing a bug in requirements is far cheaper than fixing
it in production, and the usual illustration is a 100:1 ratio. The direction is right and the
number is folklore — the original data is thin, small, and from a very different era of software
development.

## Decides

How much to invest in catching problems early, and how much to trust the numbers used to justify it.

## Why it holds

The mechanism is real regardless of the multiplier:

- found while writing, a bug costs a change to code still in your head
- found in code review, a round trip
- found in CI, a context switch
- found in production, an incident, a rollback, possibly customer impact and remediation — and then
  the fix

Each step adds work that is not the fix: reproducing, diagnosing, coordinating, communicating and
verifying — and those grow much faster than the fix itself.

The costs beyond engineering are what make the tail expensive. A production defect can involve
support volume, customer trust, data corruption requiring backfill, and in some domains regulatory
consequence — none of which appears when the same defect is caught in a test.

**Shift left** is the practice that follows: move detection earlier through types, linters, tests,
review and design. Each is cheap relative to the incident it prevents, which is the useful form of
the argument.

The honest version stops there. "Earlier is cheaper, so invest in early detection" is well
supported by mechanism; "a production bug costs 100 times a requirements bug" is a specific
empirical claim, and the evidence for it does not hold up.

## Example

The same defect — a currency rounding error in a discount calculation — caught at four points.

At design, someone asks how partial-cent discounts round. Five minutes, and the answer goes in the
spec.

In code review, a reviewer notices the rounding and asks. Half an hour: a comment, a fix, a
re-review, and a test.

In CI a week later, a property test fails on a generated case. Two hours: reproduce, understand
which change caused it, fix, verify.

In production, six weeks later, discovered by finance during reconciliation. Now it is an incident:
diagnosis, a data audit to find affected orders, a backfill to correct 4,000 charges, customer
communications for the ones that were undercharged, a fix, and a postmortem. Several days across
several people, plus the trust cost.

The ratio here is roughly 200:1 and it is one anecdote. The transferable part is the shape — each
stage adds coordination and remediation that the fix itself does not — rather than the number.

## Limits

The famous multiplier does not survive scrutiny. Bossavit traced the citation chain and found the
data is from a small number of 1970s projects, frequently misquoted, sometimes citing sources that
do not contain the claim — and it is repeated as established fact far beyond what it supports.

The curve is also flatter than it used to be, in the direction that matters. Continuous delivery,
fast rollback, feature flags and good observability substantially reduce the cost of a production
defect, which is the whole argument for those practices.

And shift-left has a cost curve of its own. Catching everything before implementation means
extensive up-front specification, which is the waterfall failure mode — so "earlier is cheaper" has
a limit well before "specify everything first".

## Source

Boehm published the curve in *Software Engineering Economics* in 1981, based on data from a small
number of large projects at TRW, IBM and GTE in the 1970s.

Bossavit's *Leprechauns of Software Engineering* is the standard critique, tracing how the figure
propagated through citation without anyone returning to the source — and it is worth reading as a
general caution about numbers in software engineering, most of which have similar histories.
