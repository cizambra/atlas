---
type: razor
title: KISS
sidebar_position: 19
family: Decision and judgment
defines: [KISS, repairable under pressure]
sources:
  - "Kelly Johnson, Lockheed Skunk Works (1960)"
  - "Rich Hickey, 'Simple Made Easy' (2011) — the simple/easy distinction"
---

## Statement

Design so it can be repaired under pressure by someone who did not build it.

## In plain terms

**KISS** is usually quoted as "keep it simple, stupid" and read as an aesthetic preference. The
original had an operational meaning: Johnson's requirement was that a combat aircraft be
repairable in a field, by an average mechanic, with basic tools, under stress. That is a much more
specific and useful test than "simple".

## Decides

Between two designs that both work, when one is cleverer and one is more obvious.

## Why it holds

The condition that matters is not construction, it is repair. A system is built once, calmly, by
people who understand it completely — and it is debugged many times, under time pressure, by
people who do not.

**Repairable under pressure** is therefore the right optimisation target. It selects for
predictability, few moving parts, obvious failure modes and shallow abstraction depth, which are
frequently different from what a design optimised for elegance selects for.

The 3am test makes it concrete. Can someone who has never seen this code, at 3am, with an incident
running, work out what is happening and change it safely? A clever solution and an obvious one may
be equal in normal operation and are not equal there.

Hickey's distinction sharpens what "simple" should mean: simple is about how many things are
braided together, not about how familiar it feels. A familiar framework can be deeply complex, and
an unfamiliar approach can be simple — and it is the braiding that makes debugging hard.

## Example

Two designs for the same rate limiter. The first is a distributed token bucket with per-node
state, gossip-based reconciliation and an adaptive refill rate — precise, efficient, and
theoretically superior.

The second is a counter in Redis with a fixed window, reset every minute. It is less accurate at
the boundary and uses a shared dependency.

Both work. The difference appears at 3am on a Sunday when rate limiting starts rejecting valid
traffic. In the second design, an engineer who has never seen the code reads twenty lines,
inspects one Redis key, and understands the state completely in five minutes.

In the first, the state is distributed across eleven nodes, the reconciliation is eventually
consistent, and the adaptive refill means the current limit is a function of the last ten minutes
of traffic. Understanding what is happening requires understanding the algorithm, and nobody
available does.

The first design is better in every dimension except the one that decides the outcome of the
incident.

## Limits

It does not mean choosing the least capable option. Some problems genuinely require the
sophisticated solution, and "keep it simple" used to justify a design that cannot meet its
requirements is a failure wearing a principle.

Simplicity is also not the same as fewer lines. A hundred lines of obvious code is simpler than
twenty lines of dense cleverness, and the aphorism gets misused to justify terseness that is
harder to read.

And what counts as simple depends on the audience. A design that is obvious to a team fluent in
one paradigm is opaque to a team that is not — so the test is repairable *by the people who will
have to repair it*, not in the abstract.

## Source

Kelly Johnson coined the phrase around 1960 at Lockheed's Skunk Works, where he led the design of
the U-2 and SR-71. The design constraint behind it was literal: the aircraft had to be repairable
in field conditions by an average mechanic with a standard toolkit, which shaped the engineering
rather than merely commenting on it.

The "stupid" in the phrase is widely misread as addressing the designer. Johnson's meaning was that
the design should be simple *and* stupid — obvious enough to survive contact with someone who has
neither the context nor the time.
