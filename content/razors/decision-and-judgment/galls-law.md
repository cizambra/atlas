---
type: razor
title: Gall's Law
sidebar_position: 18
family: Decision and judgment
defines: [Gall's Law]
sources:
  - "John Gall, Systemantics: How Systems Work and Especially How They Fail (1975)"
---

## Statement

A complex system that works evolved from a simple system that worked; one designed complex from
scratch does not.

## In plain terms

**Gall's Law** is an observation about how working complexity comes into existence. Every complex
system that functions got there by growing from something simpler that also functioned. Systems
designed to be complex from the beginning tend not to work, and cannot usually be patched into
working — they have to be restarted from something simple.

## Decides

Whether to build the full system or a working subset first, on anything genuinely large.

## Why it holds

A complex design is a large set of untested assumptions, all of which have to hold simultaneously.
Building it all before running any of it means every assumption is validated at the same moment,
which is the moment they cannot all be debugged.

A simple system that works is different in kind: it is a set of assumptions that have been
checked. Extending it adds a small number of new ones against a base that is known to hold, so
each failure has a small search space.

There is also a knowledge argument. Most of what you need to know about a system is learned by
running it — the traffic shape, the failure modes, the thing users actually do — and a design
produced before any of that is a design made without the information that matters most.

The corollary is the useful part in practice: when a complex system is not working, adding to it
rarely helps. The productive move is finding the simple version that does work and growing from
there, which frequently means deleting.

## Example

A team replaces a batch pipeline with an event-driven architecture: seven services, a message bus,
a schema registry, per-service stores and an orchestration layer, designed over three months and
built over nine.

At integration it does not work, and the failures are not localised. Events arrive out of order in
ways the design assumed away, two services disagree about a schema version, the orchestration
layer has a deadlock under retry, and the store-per-service model makes one required report
impossible.

Each fix produces another failure elsewhere, because every assumption is being tested for the
first time simultaneously.

The Gall-shaped version starts with one service consuming one event type and writing to one store
— two weeks, in production, working. The ordering problem surfaces in week three on a system small
enough to understand, and the schema-registry decision is made against real messages rather than
imagined ones. The end state may be the same seven services; the path is what determines whether
they work.

## Limits

It is not an argument against design. Growing from something simple still requires knowing roughly
where you are going, and evolutionary systems built with no direction accumulate their own kind of
unworkable complexity.

Some things genuinely cannot be built incrementally. A protocol with external implementers, a
safety-critical control system, a piece of hardware — where the cost of changing a released
interface is prohibitive, the design has to be right before it ships.

And it does not say small systems are better. The claim is about the path, not the destination:
complex systems that work exist in large numbers, and every one of them got there by growing.

## Source

Gall published *Systemantics* in 1975 as a satirical treatment of systems theory, and the law is
one of a set of deliberately wry generalisations. The satire has aged into something closer to
engineering doctrine — the formulation is quoted in the same breath as incremental delivery,
minimum viable products and evolutionary architecture, all of which are versions of it.
