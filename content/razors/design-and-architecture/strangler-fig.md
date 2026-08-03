---
type: razor
title: Strangler fig
sidebar_position: 14
family: Design and architecture
defines: [strangler fig pattern, interception point]
sources:
  - "Martin Fowler, 'StranglerFigApplication' (2004, renamed 2019)"
  - "Michael Feathers, Working Effectively with Legacy Code (2004)"
---

## Statement

Replace a legacy system by routing traffic away from it piece by piece, never by a rewrite-and-switch.

## In plain terms

The **strangler fig pattern** grows the replacement around the original rather than beside it. An
**interception point** sits in front of the old system; traffic for a migrated slice goes to the new
implementation and everything else passes through unchanged. The old system is removed when nothing
routes to it any more.

## Decides

How to replace a system that cannot be turned off.

## Why it holds

The alternative — build the replacement completely, then switch — concentrates all the risk into
one moment. Every assumption made over the build is tested simultaneously, at the point where
rollback is a full reversal, and the old system has usually kept changing throughout.

Incremental routing spreads that risk across many small steps, each with its own rollback. A slice
that fails affects one slice, and reverting is a routing change rather than a project.

It also delivers value continuously. Each migrated piece is in production and being used, which
means the replacement is validated against real traffic from week three rather than at the end.

And it accommodates the fact that the old system does not stand still. A big-bang rewrite has to
chase a moving target for its entire duration; a strangler only has to handle the slices it has
taken, and the rest keeps working as it always did.

The design decision that matters most is the interception point. A router, a gateway, a facade in
code or a feature flag — whatever it is, it must be able to route per-caller or per-request,
because that granularity is what makes both the increments and the rollbacks possible.

## Example

A fifteen-year-old order system runs the business. A rewrite is proposed and estimated at
eighteen months.

The big-bang version is the familiar failure. At month fourteen the new system handles the common
paths; the remaining work is the undocumented integrations and the reporting nobody understands.
The old system has gained four features in the meantime. The cutover slips twice and eventually
happens over a weekend, with a rollback plan nobody has tested.

The strangler version puts a routing layer in front on day one, passing everything through
unchanged. Week three, order lookup — a read-only path — routes to the new service for 1% of
traffic, then 100%. Nothing else changed, and the rollback is a config flag.

Then order creation, then refunds, then reporting. Each slice is live within weeks, each is
validated against real traffic, and each can be reverted independently.

The eighteen months may still be eighteen months. What differs is that value arrives from week
three, no single moment carries the whole risk, and the parts nobody understands are discovered one
at a time rather than all at once in month fourteen.

## Limits

Running both systems has a real cost — dual maintenance, dual deployment, and a period where
behaviour must be kept consistent across two implementations, which is its own source of bugs.

Some replacements genuinely cannot be incremental. A change to a data model that both systems must
share, or a system too small to have meaningful slices, may make the cutover the cheaper option —
and the strangler's overhead is not free.

The failure mode specific to this pattern is stopping partway. A migration that reaches 80% and
stalls leaves two systems, both maintained, plus the routing machinery — which is more total
complexity than either option. The [[migration ratchet]] and a named owner for the tail are what
prevent it.

## Source

Fowler named the pattern in 2004 after the strangler fig, which germinates in a host tree's
branches, grows roots downward around the trunk, and eventually stands on its own when the host
dies. He renamed the article in 2019 to include "fig", the original title having been read as more
violent than intended.

Feathers' contemporaneous work on legacy code supplies the enabling technique: finding a seam where
behaviour can be intercepted without modifying the code around it.
