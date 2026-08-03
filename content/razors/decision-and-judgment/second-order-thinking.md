---
type: razor
title: Second-order thinking
sidebar_position: 8
family: Decision and judgment
defines: [second-order thinking, and then what]
sources:
  - "Howard Marks, The Most Important Thing (2011)"
  - "Garrett Hardin, 'The Tragedy of the Commons' (1968) — the 'and then what?' formulation"
---

## Statement

Ask "and then what?" — the first consequence is rarely the one that decides whether it was a good
idea.

## In plain terms

**Second-order thinking** is carrying the consequences one step further than feels necessary. Most
decisions are evaluated on their immediate effect, which is the part you can see. The effect that
usually decides whether it was right is what people do *in response* to that effect, and it often
runs the other way.

## Decides

Whether a change that clearly produces the intended first effect is actually a good idea.

## Why it holds

Systems contain people, and people adapt. Any change alters the incentives of everyone inside it,
and their response is a second effect that the first-order analysis never modelled — which is why
interventions in human systems so often produce the opposite of their intent.

The first effect is also the easy one to predict, so it dominates the discussion. It is direct,
it is what the change was designed to do, and it arrives soon. The second effect is indirect,
delayed, and has to be reasoned about rather than observed.

Marks' framing from investing is that the first-order view is available to everyone, so it is
already priced in — the advantage is entirely in the second order. The engineering version is that
anyone can predict what a change does; the useful skill is predicting what people do about it.

## Example

A team is drowning in production incidents, so a rule is introduced: every deploy needs sign-off
from a second senior engineer.

The first-order effect is exactly as designed. Riskier changes get a second pair of eyes, several
genuine problems are caught in the first month, and the incident count falls.

The second-order effect arrives by month three. Sign-off takes a day, so engineers batch changes
to make one deploy worth the friction. Batched deploys are larger, larger deploys are harder to
review and harder to roll back, and when one fails it is much worse.

By month six the incident count is back where it started and each incident takes longer to
resolve, because the change that caused it is now bundled with nine others. Every step was locally
reasonable, and the rule produced the outcome it was created to prevent.

## Limits

It can be run indefinitely, and beyond two or three steps the predictions become fiction. The
useful discipline is one or two orders, and treating anything past that as speculation rather than
analysis.

It is also an argument people use to block anything. "But have you considered the second-order
effects?" is unfalsifiable when the effects are unnamed, and it becomes a way of preferring
inaction — which has its own second-order effects that nobody enumerates.

And where the change is cheap and reversible, running the experiment beats reasoning about it. The
razor earns its keep on decisions that are expensive to undo, which is where the delay in the
second effect matters most.

## Source

Howard Marks develops the idea in *The Most Important Thing* as the distinction between
first-level and second-level thinking, and his point is competitive: the obvious analysis is
already reflected in the price, so any edge lives in what follows it.

Hardin's 1968 essay supplies the sharpest single formulation of the habit — "and then what?" — in
the context of interventions in shared systems, which is closer to the engineering case than the
investing one.
