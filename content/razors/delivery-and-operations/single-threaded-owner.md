---
type: razor
title: Single-threaded owner
sidebar_position: 24
family: Delivery and operations
defines: [single-threaded owner, divided ownership]
sources:
  - "Amazon leadership practice; described in Colin Bryar and Bill Carr, Working Backwards (2021)"
---

## Statement

One person whose only job is this initiative — shared ownership of a hard thing means nobody owns
it.

## In plain terms

A **single-threaded owner** is one named person whose primary responsibility is one initiative. Not
a committee, not a person doing it alongside three other things. The claim is that hard cross-team
work fails from **divided ownership** more reliably than from any technical cause.

## Decides

How to staff an initiative that spans teams and will take months.

## Why it holds

Divided ownership fails in a specific way: everyone assumes someone else is holding the parts
between the parts. The gaps that nobody owns are exactly where cross-team work goes wrong, and each
individual contributor is behaving reasonably.

Attention is the other half. A person who owns an initiative alongside their normal job gives it
whatever is left after the urgent things, and cross-team coordination work is never urgent until it
is late.

Single-threaded means the initiative wins every prioritisation conflict for that person, by
construction. There is no competing work to lose to, which removes the failure mode where a project
stalls because its owner was pulled onto an incident for three weeks.

It also gives everyone else one place to go. A named owner is who you ask, who decides, and who
knows the current state — and the absence of that person is why status on shared initiatives is
usually reconstructed from four partial views.

Bryar and Carr's account ties it to the separable-teams argument: Amazon's model is a single owner
with a team whose dependencies have been deliberately minimised, because an owner with full
accountability and no authority is worse than no owner.

## Example

A migration spans four teams and is expected to take two quarters. It is staffed as a shared
responsibility: each team owns its part, and a weekly sync coordinates.

Four months in it is 60% done and stalled. The parts each team owned are complete. What is not done
is everything between them: the shared schema decision nobody could make alone, the callers that
belong to no team, the sequencing question that needs someone to arbitrate, and the two orphaned
services.

The weekly sync surfaced all of these and could not resolve any, because a meeting can identify an
unowned problem and cannot assign it.

Restaffed with a single-threaded owner, the pattern changes within weeks. The schema decision gets
made — by someone with the authority to make it and the context to make it well. The orphaned
callers get migrated by the owner directly, because waiting for a nonexistent owner was the block.
The sequencing is decided rather than negotiated.

The four teams do the same work as before. What was added was someone whose only job was the space
between them.

## Limits

It requires authority proportionate to the accountability. An owner who is responsible for the
outcome and cannot make decisions, reprioritise, or escalate has been given the blame without the
mechanism — which is worse than shared ownership because it is now one person's failure.

It is also expensive. Dedicating a senior person entirely to one initiative is a real cost, and for
work that genuinely partitions cleanly across teams it is unnecessary overhead.

And it can become a bottleneck. An owner who makes every decision personally does not scale past a
certain size, and the good version delegates decisions explicitly while retaining accountability —
which is the [[the handover|handover]] discipline rather than the ownership one.

## Source

The practice is Amazon's, where "single-threaded leader" is standard vocabulary and is paired with
the two-pizza team model — a small team with minimal dependencies and one person whose sole focus is
its mission.

Bryar and Carr's *Working Backwards* is the most detailed public account, and their framing is that
the single-threaded owner emerged from repeatedly observing that the binding constraint on large
initiatives was undivided attention rather than headcount.
