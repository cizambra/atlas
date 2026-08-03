---
type: razor
title: The test pyramid, and the trophy
sidebar_position: 17
family: Delivery and operations
defines: [test pyramid, testing trophy, ice cream cone]
sources:
  - "Mike Cohn, Succeeding with Agile (2009)"
  - "Martin Fowler, 'TestPyramid' (2012)"
  - "Kent C. Dodds, 'The Testing Trophy' (2018)"
---

## Statement

Many fast unit tests under fewer slow end-to-end ones — though Dodds argues integration tests
deserve the widest band.

## In plain terms

The **test pyramid** says have many fast, cheap unit tests, fewer service-level tests, and very few
slow end-to-end tests. The **testing trophy** is the modern revision: integration tests give the
best return, because they exercise real collaboration without the cost and flakiness of full
end-to-end runs.

## Decides

Where to spend testing effort across the levels.

## Why it holds

Cost and confidence trade against each other, and the shape is the argument. Unit tests are
milliseconds, deterministic, and precise about what broke — and they can all pass while the system
does not work, because they test units in isolation.

End-to-end tests give the highest confidence and the worst economics: minutes to run, flaky by
nature, expensive to maintain, and when one fails it tells you *something* is broken without
localising it.

The **ice cream cone** is the inverted anti-pattern and it is what teams drift into: mostly
end-to-end and manual tests, few unit tests. It produces a suite that takes an hour, fails
intermittently, and gets ignored — which is worse than having fewer tests.

Dodds' revision is that the pyramid's shape was drawn when integration testing was genuinely
expensive, and modern tooling has changed the economics. An integration test that exercises several
real modules together catches the class of bug unit tests structurally cannot — wrong assumptions
at boundaries — while still running in a second.

The underlying principle both agree on is what matters: the more your tests resemble how the
software is used, the more confidence they give, balanced against how much they cost to run and
maintain.

## Example

A team has 4,000 unit tests, 95% coverage, and a suite that runs in 40 seconds. It also has a bug
in production every second week.

The bugs share a shape. The order service's unit tests mock the pricing client and assert against
the mock. The pricing service's unit tests verify its own output. Both pass, and the mock returns
`{amount, currency}` while the real service returns `{total, ccy}` — which nobody's tests can see,
because no test exercises both.

Adding a handful of integration tests that call the real pricing service catches that class
immediately. Twelve tests, four seconds, and the boundary assumptions are now checked rather than
mocked.

The end-to-end suite stays deliberately small — six tests covering the critical paths, browser and
all. They take four minutes, they are the flakiest thing in CI, and they earn their place by
catching the failures nothing else can: routing, authentication, the deployed configuration.

Same total effort, redistributed. The coverage number did not move and the production bug rate
fell, because coverage was never measuring the thing that was broken.

## Limits

The shapes are heuristics, not targets. Optimising for a pyramid — or a trophy — rather than for
finding bugs produces tests written to fit a diagram, which is [[Goodhart's Law]] applied to a test
suite.

The right distribution also depends on the system. A library with complex pure logic is genuinely
pyramid-shaped; a thin service that mostly wires together dependencies has little unit-testable
logic and legitimately leans on integration tests.

Terminology is a real problem here. "Integration test" means anything from two classes together to
a full staging environment, and most arguments about the shape are arguments about definitions.

And no shape rescues a slow, flaky suite. A test that fails intermittently is worse than no test,
because it trains the team to re-run rather than to investigate.

## Source

Cohn introduced the pyramid in *Succeeding with Agile*, and Fowler's 2012 write-up is the version
most people encountered.

Dodds proposed the trophy in 2018, and his summary line has become the more useful principle: write
tests, not too many, mostly integration — with the emphasis on resembling actual use.
