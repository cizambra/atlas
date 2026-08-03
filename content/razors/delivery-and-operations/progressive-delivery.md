---
type: razor
title: Progressive delivery
sidebar_position: 7
family: Delivery and operations
defines: [progressive delivery, blast radius, automatic rollback]
sources:
  - "James Governor, RedMonk, 'Progressive Delivery' (2018)"
  - "Google SRE Book, chapter on release engineering (2016)"
---

## Statement

Expose a change to a growing slice of traffic, so the blast radius is a dial rather than a coin
flip.

## In plain terms

**Progressive delivery** turns a release from an event into a process. Rather than a change being
off or on for everyone, it reaches 1% of traffic, then 5%, then 25%, then all — with automatic
rollback at each step. The **blast radius** of a bad change becomes something you set in advance.

## Decides

How to roll out a change whose failure mode you cannot fully predict.

## Why it holds

Some failures only appear at production scale, on production data, with production traffic
patterns. No amount of testing finds them, which means the first real test is always the rollout —
and the only variable you control is how many users are in it.

Gradual exposure changes the arithmetic of that test. A bad change at 1% affects one user in a
hundred for a few minutes; the same change at 100% affects everyone until someone notices. Same
defect, two orders of magnitude difference in cost.

**Automatic rollback** is what makes it work rather than merely staged. A rollout that requires a
human to notice a metric and decide is one that runs all weekend, and the value of the small first
step is entirely in how fast it is reverted.

The thresholds have to be pre-agreed, which is the discipline part. Error rate above X, p99 above
Y, guardrail metric outside Z — defined before launch, enforced by the deploy system, so nobody is
making a judgment call under pressure.

And it composes with rather than replaces experimentation. Canary answers "is this safe"; an
[[A/B test]] answers "is this better" — different questions, different traffic requirements, and
running the first does not settle the second.

## Example

A change to the recommendation ranking passes every test and goes out to all traffic on a Friday
afternoon.

Ninety minutes later engagement is down 8%, and the cause is a scoring bug that only manifests for
users with more than about 200 items of history — a population absent from every test fixture. Every
such user has now had a bad session.

The progressive version routes 1% for thirty minutes. The affected cohort is present in that 1%,
engagement in the canary group drops, the guardrail threshold trips, and the rollout reverts
automatically at minute twelve.

Roughly a thousand users saw a worse ranking for twelve minutes, nobody was paged, and the bug
report is a dashboard with a clean comparison — the canary group against everyone else — which is
better diagnostic information than the full rollout produced.

The change was equally broken in both worlds. What differed was that one of them had a dial.

## Limits

It needs traffic. A service handling a hundred requests an hour cannot detect a 5% regression in a
1% slice within any useful window, and progressive rollout there is ceremony.

It also needs the failure to be visible in metrics. A change that corrupts data slowly, or degrades
a quality dimension nobody measures, passes every automated threshold — so the guardrails are only
as good as the instrumentation.

Version skew is the cost people underestimate. During a rollout two versions run simultaneously,
which means the two must be compatible: schema changes, cache formats and message payloads all need
to work in both directions, and that constraint is permanent rather than per-release.

And it is not a substitute for testing. Catching a bug at 1% of production is much better than at
100% and much worse than catching it in CI.

## Source

Governor coined "progressive delivery" in 2018 as an umbrella for practices — canary releases,
feature flags, ring deployments, blue-green — that had grown up separately around the same idea of
controlled exposure.

The underlying practices are older, and Google's release engineering chapter is the most detailed
public account of running them at scale, including the automatic-rollback discipline that
distinguishes a canary from a slow rollout.
