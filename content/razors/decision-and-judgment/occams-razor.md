---
type: razor
title: Occam's razor
sidebar_position: 5
family: Decision and judgment
defines: [Occam's razor]
sources:
  - "William of Ockham (c. 1287–1347), as later summarised"
  - "Theodore Woodward, the 'zebras' teaching aphorism (1940s)"
---

## Statement

Prefer the explanation that needs the fewest assumptions — in debugging, the boring cause is
usually the cause.

## In plain terms

**Occam's razor** is about where to look first, not about what is true. When several stories
would explain what you are seeing, start with the one requiring the least to be simultaneously
wrong. Usually that is a recent deploy, a config value, or an expired credential — not a
compiler bug.

## Decides

Which hypothesis to test first when several would explain the same symptom.

## Why it holds

It is a statement about probability rather than about elegance. A complex explanation requires
several independent things to be true at once, and independent conditions multiply — so the story
with four required coincidences is far less likely than the one with one.

Debugging has a second reason. The set of boring causes is small and recurs constantly: something
changed, something ran out, something expired, something was misconfigured. The set of exotic
causes is enormous and each member is individually rare.

And the ordering is nearly free. Checking the boring cause takes minutes, so even when it is wrong
you have lost very little — whereas beginning with the exotic hypothesis can absorb a day before
producing any evidence either way.

## Example

Requests to a service start failing at 09:14 with intermittent timeouts. An engineer's first
hypothesis is a subtle connection-pool exhaustion bug interacting with a recent library upgrade —
plausible, interesting, and it fits the symptoms.

Three hours go into reproducing it. The pool metrics are inconclusive, the library changelog is
read closely, and a theory forms about a race in connection reuse.

The actual cause is a certificate that expired at 09:00, on a downstream service, with a
fifteen-minute cache. It was visible in the first thirty seconds of the downstream service's
logs, and nobody looked because the interesting hypothesis had already claimed the attention.

The lesson is not that pool exhaustion never happens. It is that "what changed in the last hour"
costs two minutes and eliminates most of the probability mass before any theory is worth
building.

## Limits

It is a heuristic about search order, not a truth criterion. The simplest explanation is
frequently wrong, and treating the razor as evidence is how people stop investigating too early.

It also depends on what counts as simple, which is not neutral. "Simple" usually means familiar,
so an engineer's razor systematically favours the causes they have seen before — which is useful
and is a bias.

And some domains invert it. In security, the exotic explanation is sometimes correct because
there is an adversary deliberately producing unlikely conditions, and assuming the boring cause is
exactly what the attack relies on.

## Source

The principle is attributed to William of Ockham, a fourteenth-century friar, though the phrasing
usually quoted is a later summary and the idea predates him.

The medical teaching version — "when you hear hoofbeats, think horses, not zebras" — comes from
Theodore Woodward at Maryland in the 1940s, and is the form that transfers most cleanly to
debugging.
