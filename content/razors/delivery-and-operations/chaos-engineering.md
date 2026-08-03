---
type: razor
title: Chaos engineering
sidebar_position: 16
family: Delivery and operations
defines: [chaos engineering, game day, steady-state hypothesis]
sources:
  - "Netflix, Principles of Chaos Engineering (2015)"
  - "Casey Rosenthal and Nora Jones, Chaos Engineering (2020)"
  - "Netflix Chaos Monkey (2011)"
---

## Statement

Inject the failure deliberately in daylight, because the alternative is discovering it at 3am.

## In plain terms

**Chaos engineering** is running experiments on a production system to build confidence in how it
behaves under failure. Not breaking things randomly — a hypothesis about steady state, a specific
injected failure, a bounded blast radius, and a measured result.

## Decides

Whether your failure handling actually works, as opposed to whether it exists.

## Why it holds

Untested failure paths do not work. Timeouts with wrong values, circuit breakers that never open,
fallbacks that throw, retries without idempotency — all of them look correct in code review and
none of them has ever run.

The reason they stay untested is that failure is rare and unscheduled. So the first execution of
the recovery path is during a real incident, at the worst hour, with the least available attention
— which is precisely the wrong time to discover a bug in it.

Deliberate injection moves that first execution to Tuesday at 11am, with everyone available and a
kill switch ready. The failure is the same; the conditions are as favourable as they will ever be.

The discipline is what separates it from breaking things. A **steady-state hypothesis** states what
normal looks like in measurable terms; the experiment injects one failure; the result either
confirms the hypothesis or does not. Without the hypothesis it is not an experiment.

A **game day** is the human version — a scheduled exercise where a failure is injected and the team
responds as though it were real — and it tests the runbooks, the alerts and the escalation path
rather than only the code.

## Example

A service has a circuit breaker around its payment provider, configured two years ago and never
triggered.

The game day states the hypothesis first: with the provider unavailable, checkout continues at
above 95% success by falling back to the queue-for-review path, and no alert fires beyond the
expected provider-down alert.

The experiment is a firewall rule blocking the provider for ten minutes, in production, during
working hours, with a rollback ready.

Four things fail:

- the breaker does not open, because its threshold is on error rate and the provider is timing out
  rather than erroring
- the fallback path throws, because it was written against an older order model
- the alert does not fire, because it is tied to a metric renamed last year
- the runbook's first step references a dashboard that no longer exists

Ten minutes, a controlled outage, and four defects found. Every one of them would have been found
anyway — during a real provider outage, at whatever hour it happened, with all four compounding.

## Limits

It requires a mature baseline. A system without good observability cannot detect the effect of an
experiment, and injecting failure into a system you cannot measure is just breaking it.

Blast radius control is not optional. Experiments need a small scope, a kill switch, and ideally a
canary population — chaos in production without those is an outage you scheduled.

Some systems should not be experimented on in production, and the honest cases are real: safety
systems, anything with irreversible financial or physical effects, and regulated environments where
deliberate disruption has legal consequences.

And it does not replace design. Finding that a fallback is broken is valuable; not having thought
about the fallback at all is a design gap that chaos engineering will report and cannot fix.

## Source

Netflix built Chaos Monkey in 2011 to terminate production instances at random during working
hours, on the argument that a system unable to survive a scheduled instance loss would not survive
an unscheduled one.

The Principles of Chaos Engineering formalised it into an experimental method — steady-state
hypothesis, real-world events, run in production, minimised blast radius — which is what
distinguishes the discipline from its reputation.
