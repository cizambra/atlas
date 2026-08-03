---
type: razor
title: Kernighan's Law
sidebar_position: 14
family: Laws of systems
defines: [Kernighan's Law]
sources:
  - "Brian Kernighan and P. J. Plauger, The Elements of Programming Style (2nd edition, 1978)"
---

## Statement

Debugging is twice as hard as writing the code — so code at your limit and you cannot debug it.

## In plain terms

**Kernighan's Law** observes an asymmetry: understanding code well enough to find a subtle fault in
it is harder than producing it. So writing at the edge of your ability guarantees that the code is,
by construction, beyond your ability to debug — and it will need debugging.

## Decides

How clever to be, given that someone will have to understand this later under worse conditions.

## Why it holds

Writing and debugging are different activities. Writing works forwards from intent, with the whole
design in your head; debugging works backwards from a symptom, with no guarantee the design in your
head matches the code. The second is harder even on your own code.

The conditions are also worse. Debugging happens later, when the design has faded, frequently under
time pressure, and often by someone who did not write it. Every one of those subtracts from the
available capability.

Which makes the arithmetic in the law close to literal. If writing consumed all of your capability,
debugging needs roughly twice that — and you do not have it.

The corollary is that the reserve is the design target. Code written at half your ability leaves
enough margin to debug it under pressure, which is the [[KISS|repairable-under-pressure]] criterion
arrived at from a different direction.

## Example

An engineer writes a caching layer using a lock-free algorithm with atomic compare-and-swap, a
generation counter and careful memory ordering. It is correct, it is fast, and it took two weeks of
concentration.

Four months later it produces stale reads about once a day under high concurrency. The engineer who
wrote it is on another team; the one debugging it has never worked with lock-free structures.

The debugging takes three weeks. It is not reproducible locally, the failure depends on thread
interleaving, and understanding whether the memory ordering is correct requires learning the model
from scratch. The eventual fix is replacing it with a mutex.

The mutex version is measurably slower and it was never the bottleneck. Two weeks of writing and
three weeks of debugging bought a performance improvement nobody needed, in exchange for a
component that only one person could ever maintain.

## Limits

Some problems genuinely require difficult code. A compiler, a cryptographic primitive, a real-time
scheduler — the essential complexity is high and no amount of restraint removes it. The law argues
for reserve, not for avoiding hard problems.

It also depends on whose limit. Code at the limit of a junior engineer is comfortable for a senior
one, so the practical question is the ability of whoever will maintain it — which is usually not the
author.

And clever is not the same as complex. A well-chosen algorithm can be both sophisticated and
obvious; the law targets code where the difficulty is in following the mechanism rather than in the
idea.

## Source

The line comes from Kernighan and Plauger's *The Elements of Programming Style*, and the original
phrasing makes the arithmetic explicit: "Everyone knows that debugging is twice as hard as writing
a program in the first place. So if you're as clever as you can be when you write it, how will you
ever debug it?"

The book is a 1970s style guide built almost entirely from examples of bad published code, and the
law is one of its closing observations rather than its subject.
