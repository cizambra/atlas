---
type: razor
title: CQRS and event sourcing
sidebar_position: 21
family: Design and architecture
defines: [the CQRS razor]
sources:
  - "Greg Young, CQRS and event sourcing talks (2006–)"
  - "Martin Fowler, 'CQRS' (2011) and 'EventSourcing' (2005)"
  - "Udi Dahan, 'Clarified CQRS' (2009)"
---

## Statement

Separating reads from writes buys independent scaling and costs eventual consistency — and is wrong
for most systems.

## In plain terms

[[CQRS]] — command query responsibility segregation — uses different models for reading and
writing, and event sourcing stores the sequence of changes rather than current state. **The CQRS
razor** is that both are powerful in narrow circumstances and adopted far more often than they are
warranted.

## Decides

Whether a system's read and write models are different enough to justify separating them.

## Why it holds

The case is real in specific conditions. Where reads and writes have genuinely different shapes —
a write model enforcing complex invariants, a read model serving denormalised queries — one model
serving both is a compromise that fits neither.

Asymmetric scale is the other genuine driver. A system doing 10,000 reads per write can scale the
read side independently, with its own storage and its own replicas, once the models are separate.

Event sourcing adds a different set of properties: a complete audit trail by construction, the
ability to reconstruct state at any past moment, and the ability to build new read models
retroactively by replaying history. In domains where the *sequence* of changes is itself the
valuable data — finance, compliance, anything with a legal audit requirement — that is not
overhead, it is the requirement.

The costs are what make it wrong most of the time:

- read models update asynchronously, so a user can write and not see their own change — an
  eventual-consistency problem that propagates into the interface and into every test
- two models must be kept in step
- event schemas are permanent, because old events cannot be rewritten
- debugging spans a projection pipeline rather than a table

Fowler's own caution is the useful summary: CQRS should be used sparingly, in a bounded part of a
system, and the pattern's popularity has substantially exceeded its applicability.

## Example

A team adopts CQRS with event sourcing for an inventory system, attracted by the audit trail and
the scaling story.

The write side appends events — `StockReceived`, `StockReserved`, `StockAdjusted`. Projections
build read models for the stock list, the reorder report and the warehouse view.

The first problem is user-facing. A warehouse operator adjusts stock and the list still shows the
old number for 300ms, so they adjust it again. The fix is optimistic UI updates, which means the
consistency problem has moved into the front end.

The second is schema permanence. Six months in, `StockAdjusted` needs a reason code. Old events do
not have one, so every projection needs a branch for events before and after the change — and that
branch is permanent, because the history cannot be rewritten.

The third is debugging. "Why does this number look wrong" now requires reading the event stream,
finding the projection, checking whether it lagged, and replaying — where previously it was one
query.

The audit trail is genuinely valuable and the scaling was never needed: the system does 40 writes a
minute. A table with an audit log would have delivered the requirement at a fraction of the cost.

## Limits

The limit is the razor. Most systems do not have asymmetric read and write models, do not have
asymmetric scale, and do not need retroactive state reconstruction — and for those, a single model
with a transactional database is simpler in every dimension.

CQRS and event sourcing are also separable, and conflating them is common. You can separate read
and write models without sourcing from events, and you can event-source without CQRS, and the
lighter combinations are frequently what a team actually needs.

And it is not all-or-nothing. Applying it to one bounded context where the properties genuinely
apply — the audited part, the read-heavy part — is the version that works; applying it as an
architectural style across a whole system is the version that produces the costs above with none of
the benefits.

## Source

Greg Young developed and named CQRS in the mid-2000s, building on Bertrand Meyer's older
command-query separation, and has spent much of the time since arguing against its
over-application.

Fowler's articles are the standard reference and both carry explicit warnings. Udi Dahan's
"Clarified CQRS" is the most useful corrective, arguing that most of what people adopt CQRS for can
be had with far less machinery.
