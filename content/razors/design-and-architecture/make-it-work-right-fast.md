---
type: razor
title: Make it work, make it right, make it fast
sidebar_position: 10
family: Design and architecture
defines: [work then right then fast, the crude version]
sources:
  - "Kent Beck, Extreme Programming Explained (1999)"
  - "Butler Lampson, 'Hints for Computer System Design' (1983) — 'get it right' and 'make it fast' as separate hints"
---

## Statement

In that order — each stage is cheaper when the one before it is done.

## In plain terms

**Work then right then fast** is an ordering claim. Get something working end to end, however crudely —
**the crude version** is the point, not a compromise. Then make it correct and well structured, now
that you know what it has to do; then fast, once you can measure what is slow. Any other order
means doing one of them twice.

## Decides

What to do first when starting a piece of work, and what to resist doing early.

## Why it holds

Each stage produces information the next one needs.

**Work first** because a working end-to-end path is the only thing that tells you what the problem
actually is. Requirements are wrong in ways nobody can predict, and the crude version surfaces them
in days rather than after the elegant version is built on the wrong assumption.

**Right second** because structure should be derived from real requirements rather than imagined
ones. Refactoring code that works is safe — you have a behavioural baseline and can verify you did
not change it — where designing before it works is guessing.

**Fast last** because optimisation needs measurement, and measurement needs something to measure.
[[Premature optimisation|Optimising before profiling]] means optimising code that is probably not
the bottleneck, and doing it before the structure is right means optimising code that is about to
change.

The ordering also fails safe. A project stopped after stage one has something that works; stopped
after a design-first approach it has something that does not.

## Example

Two teams build an import pipeline for a new file format.

The first designs it properly first: a parser abstraction, a validation layer, a streaming
architecture for large files, and a batching strategy for the writes. Six weeks before anything
processes a real file.

The real files then arrive and break the design. About 8% have a malformed header that the format
spec says cannot happen, the largest is 40MB rather than the assumed multi-gigabyte, and half the
fields are always empty. The streaming architecture was unnecessary and the validation layer is in
the wrong place.

The second team writes 120 lines that read a file into memory and insert rows, working in two days.
It is ugly, it has no abstraction, and it processes real files — which is how they learn about the
malformed headers in week one and the 40MB ceiling immediately.

Then they make it right, with the actual requirements in hand, and the design that emerges is
smaller than the first team's because it does not include the streaming machinery. Then they
profile, find that 80% of the time is in the per-row insert, batch it, and stop.

## Limits

Some decisions cannot be deferred to stage two. Anything that shapes persisted data, a public
interface or a security boundary is expensive to change afterwards, and "make it work" is not a
reason to defer a [[Type 1 decision|one-way door]].

The failure mode is also real and common: stage one ships, and stages two and three never happen,
because working code under deadline pressure does not get revisited. The ordering assumes all three
stages occur.

And "make it work" is not permission to write it badly. It means the simplest thing that works,
not the most careless — the version that gets refactored in stage two has to be one someone can
understand well enough to refactor.

## Source

Beck states it in the Extreme Programming literature, and it encodes the practice underneath test-
driven development's red-green-refactor cycle: make it pass, then clean it up, and only then worry
about speed.

Lampson's 1983 hints paper gives the older version, listing "get it right" and "make it fast" as
separate concerns with the explicit warning not to let the second compromise the first — which is
the same ordering argued from system-design experience rather than from process.
