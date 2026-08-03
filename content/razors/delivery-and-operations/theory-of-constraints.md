---
type: razor
title: Theory of constraints
sidebar_position: 19
family: Delivery and operations
defines: [theory of constraints, the constraint, subordination]
sources:
  - "Eliyahu Goldratt, The Goal (1984)"
  - "Gene Kim, Kevin Behr and George Spafford, The Phoenix Project (2013)"
---

## Statement

Any improvement not at the bottleneck is an illusion; find the constraint, exploit it, then
subordinate everything else.

## In plain terms

**The constraint** is the single step that limits the whole system's throughput, and improving
anything else changes nothing — it produces more work waiting at the constraint. The **theory of
constraints** is the process that follows: identify it, get the most from it, make everything else
serve it, then raise its capacity, then find the new one.

## Decides

Where to spend improvement effort in any system with a flow of work through stages.

## Why it holds

Throughput is set by the slowest stage, so capacity added anywhere else does not appear in the
output. It appears as inventory in front of the constraint, which looks like productivity and is
not.

That makes local optimisation actively misleading. A stage running at 100% utilisation upstream of
the constraint is producing work that will wait, and the utilisation number rewards it — which is
why measuring stages independently drives the wrong behaviour.

The five steps in order are the method:

1. **Identify** the constraint — the stage where work queues up.
2. **Exploit** it — get maximum output from it without spending money. Stop it idling, stop it doing
   work that could be done elsewhere.
3. **Subordinate** everything else to it — the rest of the system runs at the constraint's pace
   rather than its own.
4. **Elevate** it — now add capacity, hire, automate, buy.
5. **Repeat**, because the constraint will have moved.

**Subordination** is the counterintuitive step and the one that gets skipped. It means deliberately
under-utilising non-constraint stages, which every local metric will punish — and is the only way
the constraint stops being starved or flooded.

## Example

An engineering organisation wants to ship faster. The obvious answer is more engineers, and three
are hired.

Throughput does not change. Measuring where work waits finds the constraint: a single QA
environment, shared by six teams, booked in half-day slots. Everything queues there for an average
of four days.

Exploiting it first, before spending anything: the environment sits idle overnight and at weekends
— roughly 60% of its hours — because bookings are manual and only during working hours. Automating
the booking and allowing overnight runs nearly doubles its effective capacity for a week of work.

Subordinating is the uncomfortable part. Teams stop starting new work when the queue exceeds a
threshold, which means engineers are sometimes idle — and every team-level metric reads that as
waste, while total throughput rises because the constraint stops being flooded with stale branches.

Elevating comes last: a second environment, now that the first is actually being used well. And the
constraint moves — to code review, where two people are approving everything — which is where the
next cycle starts.

The three new engineers were not the answer. They were capacity added upstream of a bottleneck, and
their work went into the queue.

## Limits

It assumes a single dominant constraint, and knowledge work frequently has several of comparable
size — in which case the sequencing advice is weaker and the method degrades to ordinary
prioritisation.

Finding the constraint in software is also harder than on a factory floor. Work in progress is not
physically visible, stages are not clearly delineated, and the constraint is sometimes a person's
attention rather than a step.

And subordination is politically expensive. Deliberately idling a team, or telling a group to stop
starting work, requires authority and an explanation that contradicts every local efficiency
measure — which is why the step is usually skipped and the method usually fails.

## Source

Goldratt presented the theory in *The Goal*, a business novel about a manufacturing plant, and the
five focusing steps are its practical core.

*The Phoenix Project* is the software translation, deliberately structured as a homage, and it is
where most engineering audiences encountered the ideas — along with the related argument that
unplanned work is what destroys a constrained system's throughput.
