---
type: razor
title: The four golden signals
sidebar_position: 8
family: Delivery and operations
defines: [golden signals, saturation]
sources:
  - "Google SRE Book, 'Monitoring Distributed Systems' (2016)"
---

## Statement

Latency, traffic, errors, saturation — if you can only have four dashboards, have these.

## In plain terms

The **golden signals** are the minimum set that tells you whether a user-facing service is healthy.
Latency is how long requests take, traffic is how many there are, errors is how many fail, and
**saturation** is how full the system's most constrained resource is. Everything else is
diagnostic detail underneath these four.

## Decides

What to monitor first on a service that currently has either nothing or three hundred metrics.

## Why it holds

They cover the ways a service fails from a user's point of view, which is the correct frame:
requests are slow, requests fail, or the system is about to stop being able to serve them.

Latency has to be split, which is the detail people miss. Failed requests are often *fast* — a
connection refused returns in a millisecond — so mixing them into the latency distribution makes
things look better as they get worse. Successful and failed latency are two different signals.

Traffic is context rather than health. A doubling of errors means one thing at constant traffic and
something quite different at five times traffic, and without the denominator neither of the other
two signals can be interpreted.

Saturation is the leading indicator and the one usually missing. Latency and errors tell you
something is wrong now; saturation — the resource closest to its limit — tells you something will
be wrong in twenty minutes, which is the only one of the four that buys time.

The reason to prefer four over a hundred is attention. A dashboard with sixty panels is not read
during an incident; four are, which is why the constraint is part of the advice rather than a
concession.

## Example

A service has 140 metrics on eight dashboards. During an incident nobody knows which to look at, so
the on-call engineer checks the ones they remember and misses the relevant one.

Reduced to the four, the same incident reads clearly:

- traffic: normal
- errors: 4%, up from 0.1%
- latency of successful requests: unchanged
- latency of failed requests: 2 milliseconds

That combination is diagnostic on its own. Fast failures at normal traffic with unchanged success
latency means something is rejecting requests immediately rather than struggling under load — a
connection refusal, an auth failure, an exhausted pool.

Saturation confirms it: the database connection pool is at 100%, and has been climbing for forty
minutes. It crossed 80% half an hour before any user-visible error, which is when the alert should
have fired.

The 140 metrics contained all of this. What the four provided was an order to look in, and the
saturation signal — the one nobody had a dashboard for — was the one that would have prevented the
incident rather than explaining it.

## Limits

They are for request-driven services. Batch systems, stream processors and storage systems need
different signals, and forcing them into this shape produces dashboards that miss the actual
failure modes.

Saturation is also the hardest to define and the most often skipped. It requires knowing which
resource constrains this service — connections, memory, threads, IOPS, quota — and that answer
changes as the system changes.

And four signals are a starting point rather than a monitoring strategy. They tell you something is
wrong; finding out what requires the detailed metrics underneath, so the razor is about hierarchy
rather than about deletion.

The complementary framings are worth knowing: [[RED method|RED]] for services and
[[USE method|USE]] for resources cover the same ground with different emphases.

## Source

The four come from Google's SRE book, in the chapter on monitoring distributed systems, presented
as the advice to give when a team can measure only four things about a user-facing system.

The book's related argument is about alerting: pages should be tied to symptoms that users
experience — these four — rather than to causes, because cause-based alerts multiply endlessly and
still miss the failure nobody predicted.
