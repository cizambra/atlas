---
type: razor
title: Appetite over estimate
sidebar_position: 22
family: Delivery and operations
defines: [appetite, fixed time and variable scope, circuit breaker on projects]
sources:
  - "Ryan Singer, Shape Up (2019), Basecamp"
  - "Tom DeMarco and Timothy Lister, Peopleware (1987) — on estimates as commitments"
---

## Statement

Fix the time and vary the scope: ask how much this is worth, not how long it will take.

## In plain terms

An estimate asks how long something will take and gets an answer that is wrong. An **appetite**
asks how much time this is worth spending — six weeks, two weeks — and treats that as a constraint
the solution must fit. **Fixed time and variable scope**: the date does not move, the shape of
the solution does.

## Decides

How to bound a piece of work when the estimate will be wrong.

## Why it holds

Estimates are systematically optimistic and the bias survives knowing about it, which is
[[Hofstadter's Law]]. So a plan built on an estimate is built on a number that is wrong in a known
direction.

An appetite inverts the dependency. Rather than deriving the schedule from the solution, it derives
the solution from the schedule — and since almost every problem has solutions at many levels of
ambition, the constraint is what forces the useful design conversation.

That conversation is the actual value. "What can we build for six weeks?" produces a different and
usually better answer than "how long will the thing we imagined take?", because it forces the
question of which parts are essential.

[[Parkinson's Law]] supplies the other half. Work expands to fill available time, so an open-ended
schedule guarantees elaboration; a fixed one converts elaboration into scoping.

The **circuit breaker on projects** is what makes it honest. If the work does not fit the appetite,
it does not get an extension — it stops, and can be reshaped and re-pitched later. Without that,
the appetite is a soft estimate and the discipline evaporates.

## Example

A team is asked to build reporting exports. The estimate process produces "about ten weeks" and
work begins.

At week ten it is 70% done — the format handling was harder than expected, and scheduling was added
in week four because it seemed natural. At week fourteen it ships, and the team's estimates are
trusted slightly less than before.

The appetite version starts differently: this is worth six weeks. Not "will it take six weeks" —
it is worth six, and the question is what fits.

That question reshapes the solution immediately. Scheduled exports drop out — they are the expensive
half and were never asked for. Three formats become one, because CSV covers most of the requests.
Custom column selection becomes two fixed layouts.

The reduced version ships in five weeks and covers most of what people wanted. What was cut was
mostly scope that had been assumed rather than requested, and the cutting happened in the design
conversation rather than in week twelve under pressure.

If it had not fit, the circuit breaker applies: stop, reshape, and pitch it again — rather than
letting a six-week appetite become a fourteen-week project by increments.

## Limits

It requires the scope to be genuinely variable. Regulatory work, protocol compliance and contractual
commitments have a fixed minimum, and telling a team to fit them into an appetite produces either a
missed obligation or a quiet extension.

Shape Up's whole system also assumes a specific context — small autonomous teams, six-week cycles,
no external dependencies — and the appetite mechanism is weaker when a team's work depends on three
other teams' schedules.

And the circuit breaker is the part that fails first. An organisation that extends every project
that does not fit has kept the vocabulary and lost the mechanism, and an appetite that can be
extended is just an estimate with a nicer name.

## Source

Singer developed the approach at Basecamp and documented it in *Shape Up*, where appetite is one of
several linked practices — shaping work at the right level of abstraction, betting on it for a
fixed cycle, and giving the team full autonomy within that cycle.

The underlying observation is older. DeMarco and Lister's *Peopleware* makes the related argument
that estimates become commitments the moment they are stated, which is why they stop being
predictions and start being negotiations.
