---
type: razor
title: Parkinson's Law
sidebar_position: 20
family: Decision and judgment
defines: [Parkinson's Law, timeboxing]
sources:
  - "C. Northcote Parkinson, 'Parkinson's Law', The Economist (1955)"
  - "Parkinson's law of triviality — the bikeshed, from the same 1957 book"
---

## Statement

Work expands to fill the time available, which is why deadlines shape scope more than estimates
do.

## In plain terms

**Parkinson's Law** says that a task given three weeks takes three weeks, and the same task given
three days frequently also gets done. The extra time does not go into a better result — it goes
into elaboration, polish nobody asked for, and the gaps that fill any unconstrained schedule.

## Decides

How long to allow for a piece of work, and whether to set a deadline at all.

## Why it holds

Almost no engineering task has a natural completion point. There is always more testing, more
refactoring, another edge case, better documentation — so the work does not stop when it is done,
it stops when the time runs out.

Elaboration also fills the space by default. Given room, people generalise the solution, handle
cases nobody has, and build the abstraction the [[YAGNI]] razor warns about — each step
individually defensible and collectively unbudgeted.

The corollary is what makes it useful: **timeboxing** converts an open task into a scoping
exercise. "Two days" forces the question of what the essential version is, and that question is
usually more valuable than the extra time would have been.

Parkinson's second law — the law of triviality — is the same mechanism applied to attention. A
committee spends minutes on a nuclear reactor and an hour on a bike shed, because everyone can
form an opinion about the bike shed. Available capacity fills with whatever is easiest to fill it
with.

## Example

A team is asked to build an internal admin tool and given six weeks, which is what the estimate
said.

The tool ships in six weeks. It has role-based permissions nobody requested, a configurable
dashboard, an audit log, and a plugin architecture for future extensions. The core function — three
support workflows — took about four days.

The same team, asked to produce something usable in one week, ships the three workflows with a
hard-coded permission check. Support uses it happily for two years, and two of the six speculative
features are never requested by anyone.

The six-week version was not padded and nobody was idle. The work genuinely filled the time,
because nothing in the task said where to stop and elaboration is what engineers do with
unallocated capacity.

## Limits

It is not a licence to compress arbitrarily. Some work has an irreducible duration, and a deadline
below it does not produce a faster result — it produces a worse one, or the same one late plus a
damaged team.

It also cuts the wrong things when applied bluntly. Under time pressure the first casualties are
tests, documentation and error handling, which is precisely the [[technical debt]] the razor is
not asking you to take.

And it does not apply to genuine exploration. Research and debugging do not have a scope that
compresses; a timebox there is a decision about when to stop trying, which is a different and
legitimate use of the same tool.

## Source

Parkinson introduced the law in a 1955 *Economist* essay, illustrated with the British Colonial
Office: its staff grew steadily while the empire it administered shrank, reaching its largest size
around the point it had almost nothing left to administer.

His subject was bureaucratic growth rather than engineering estimates, and the underlying claim —
that work volume is largely independent of the resources allocated to it — transfers directly.
