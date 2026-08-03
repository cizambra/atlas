---
type: razor
title: Backpressure
sidebar_position: 19
family: Design and architecture
defines: [unbounded queue]
sources:
  - "Reactive Streams specification (2015)"
  - "Little's Law, applied to queueing under sustained overload"
  - "Jeff Dean and Luiz Barroso, 'The Tail at Scale' (2013) — queue-induced latency"
---

## Statement

A queue that absorbs overload converts a throughput problem into a latency problem and hides it
until it is worse.

## In plain terms

[[Backpressure]] is a consumer telling a producer to slow down. Without it, the usual response to
overload is a queue — which does not add capacity, it adds waiting. An **unbounded queue** in front
of a saturated consumer does not solve anything; it converts an immediate, visible failure into a
delayed, invisible one.

## Decides

What to do when work arrives faster than it can be processed.

## Why it holds

[[Little's Law]] settles it. Queue length equals arrival rate times time in system, so if arrivals
exceed service rate for any sustained period, the queue grows without bound and so does latency.
There is no queue size that fixes an arrival rate problem.

What the queue changes is when you find out. A bounded system rejects work immediately and visibly;
an unbounded one accepts everything and delivers it late, so the symptom is latency climbing over
hours rather than errors appearing at once.

That delay is what makes it worse. By the time the queue is visibly deep, it contains work that is
minutes or hours stale — much of it for requests whose clients have already timed out — so the
system spends its capacity producing results nobody is waiting for.

Memory is the other failure. An unbounded in-memory queue under sustained overload ends in an
out-of-memory kill, which loses the entire queue rather than the excess.

The alternatives are all forms of saying no earlier: bound the queue and reject when full, block
the producer, drop the oldest, or shed load by priority. Each is a deliberate choice about which
work to lose, and having one is the point.

## Example

An image-processing service handles 100 requests per second. A campaign pushes arrivals to 300.

The queue absorbs it, and for the first ten minutes everything looks fine: no errors, all requests
accepted. The dashboard shows healthy.

At thirty minutes the queue holds 360,000 items and latency is over an hour. Clients timed out
after 30 seconds and retried, so a large share of the queue is duplicate work for requests nobody
is waiting for — which raises the effective arrival rate and makes it worse.

At fifty minutes the process is killed for memory, losing the whole queue including the work that
would have completed.

The backpressured version bounds the queue at 1,000 — about ten seconds of work — and returns 429
with a retry hint when it is full. Two-thirds of requests fail immediately, visibly, at the moment
they arrive.

That is the same amount of work not done, reported honestly. Clients back off, the alert fires at
minute one instead of minute fifty, the successful third are served in normal time, and nothing is
lost to an out-of-memory kill.

## Limits

Backpressure has to propagate to be useful. A service that pushes back on its caller which has an
unbounded queue of its own has moved the problem upstream, and the whole chain has to participate.

It is also not right for genuinely bursty, asynchronous work. A queue absorbing a five-minute spike
with hours of idle time afterwards is doing exactly its job — the razor is about *sustained*
overload, and distinguishing the two requires knowing the arrival distribution.

And rejection has a cost that falls on someone. Shedding load means a user gets an error, which is
a product decision about who to disappoint rather than a purely technical one.

## Source

The Reactive Streams specification made backpressure a first-class protocol concern, defining
demand signalling between publisher and subscriber, and its implementations popularised the
vocabulary in mainstream application development.

The underlying queueing result is much older, and the practical argument is a direct application of
Little's Law: the only sustainable responses to arrivals exceeding service rate are to increase
service rate or to reduce arrivals, and a queue does neither.
