---
type: razor
title: WIP limits
sidebar_position: 20
family: Delivery and operations
defines: [WIP limit]
sources:
  - "David Anderson, Kanban (2010)"
  - "Donald Reinertsen, The Principles of Product Development Flow (2009)"
  - "Little's Law (1961)"
---

## Statement

Starting less finishes more — by Little's Law, cutting work in progress cuts cycle time directly.

## In plain terms

A **WIP limit** caps how many things can be in flight at once. It feels like it would slow a team
down and does the opposite: [[work in progress]] and cycle time are proportional, so halving the
number of things being worked on halves the time each takes to finish.

## Decides

Whether to start something new, or finish something already started.

## Why it holds

[[Little's Law]] is the whole argument, applied to a team. Cycle time equals work in progress
divided by throughput — so with throughput roughly fixed, cycle time is directly proportional to
WIP. Ten items in flight take twice as long each as five.

The mechanism underneath is context switching and queueing. Every item in progress carries state
someone has to hold, and every switch costs the reload — so more parallel work means less effective
throughput, which makes the arithmetic worse than linear.

Partially finished work is also worth nothing. Five features at 80% deliver no value; four at 100%
and one at 0% deliver four. The WIP limit forces the second distribution.

The limit works by making blockage visible and painful. When you cannot start something new, the
only available action is to help finish something in progress — which is exactly the behaviour that
was previously optional and never chosen.

Reinertsen's addition is about queue costs: large queues in product development are invisible,
carry no accounting entry, and are where most of the delay lives. The WIP limit is a queue bound
imposed deliberately.

## Example

A team of six has twelve items in progress. Everyone is busy, utilisation is high, and average
cycle time is nineteen days.

The pattern is familiar. Someone is blocked waiting on review, so they start something new rather
than idle. That new item then blocks on something else, so they start a third. Everyone is working
and nothing is finishing.

Setting a WIP limit of six — one per person, or fewer — changes the available actions. When
everything is at the limit and an item blocks, the engineer cannot start something new, so they
review someone else's pull request, or pair on the blocked item, or fix the thing causing the block.

Cycle time falls to about nine days within two sprints. Throughput is unchanged — the same amount of
work per month — but each item finishes in half the time, which is precisely what Little's Law
predicts from halving WIP.

The visible cost is that engineers are sometimes not working on their own item, which reads as
inefficiency on any per-person measure. The system-level result is that work reaches users twice as
fast.

## Limits

The limit has to be set from observation, not principle. Too low and people genuinely idle with
nothing useful to do; too high and it never binds. Starting slightly below current WIP and reducing
is the usual approach.

It also assumes work is roughly comparable in size. A limit counting items treats a two-hour fix
and a three-week project identically, which is why some teams limit by size or by stage instead.

And it needs a response to blockage. A WIP limit without the norm of swarming on blocked work
produces idle engineers and resentment — the limit is what makes helping the only option, and
someone has to say that out loud.

## Source

The practice comes from Kanban, where WIP limits per column are the central mechanism, and
Anderson's book is the standard software treatment.

Reinertsen supplies the economic argument — that queues are the dominant and least-measured cost in
product development — and Little's Law provides the arithmetic that makes the prediction quantitative
rather than merely plausible.
