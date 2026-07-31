---
type: razor
title: The tail at scale
sidebar_position: 4
family: Laws of systems
defines: [the tail at scale, tail latency, hedged request, tail-tolerant]
sources:
  - "Jeffrey Dean & Luiz André Barroso, 'The Tail at Scale', CACM 56(2) (2013)"
---

## Statement

Fan out to enough services and the slowest one becomes your median: the 99th percentile
of a component is the 50th percentile of a request.

## In plain terms

One request usually needs answers from many services, and it is not finished until the slowest
of them replies. So a delay that hits one call in a hundred stops being rare: fan out to a
hundred services and it touches nearly every request. Rare per part becomes normal per request.

## Decides

Whether to optimise the average or the tail, whether a fan-out design is affordable at
all, and whether to spend capacity on hedging.

## Why it holds

It is a probability, not an observation. If a request touches $N$ services and each
independently has probability $p$ of being slow, the chance that at least one is slow is

$$
P(\text{slow request}) = 1 - (1 - p)^N
$$

Put Dean and Barroso's numbers in. One service in a hundred is slow, $p = 0.01$. Touch
one service and 1% of requests are slow. Touch a hundred and
$1 - 0.99^{100} = 63\%$ of requests are slow.

Nothing about any individual service changed. The same component that looks excellent in
isolation makes a fan-out system unusable, which is why average latency is close to
worthless as a metric in a distributed system and why teams that only watch the mean are
surprised by their own users.

## Example

A search page queries 100 shards in parallel and waits for all of them. Each shard
answers in 10 ms at p50 and 1 second at p99.

The naive expectation is a 10 ms page. The actual expectation is that roughly 63% of
page loads wait on at least one shard's slow path, so most users see something close to
a second.

The fix Dean and Barroso describe is **hedged requests**: send to one replica, and if it
has not answered by the 95th-percentile mark, send the same request to a second replica
and take whichever returns first. Because only 5% of requests ever hedge, this costs a
few percent extra capacity and removes most of the tail.

## Limits

The arithmetic assumes independence, and real slowness is correlated. A garbage
collection pause, a noisy neighbour, or a shared switch makes several calls slow at the
same moment, which is worse than the formula predicts rather than better.

Hedging buys latency with throughput. You are deliberately doing duplicate work, so it
only pays where you have spare capacity and where duplicate execution is safe — a hedged
non-idempotent write is a bug, not an optimisation.

And it does not apply to sequential fan-out at all. If you call ten services in a chain
the latencies simply add; the tail problem here is specifically about waiting on the
slowest of many parallel calls.

## Source

Jeffrey Dean and Luiz André Barroso, 'The Tail at Scale', *Communications of the ACM*
56(2), 2013 — written from Google's experience, and the origin of the phrase
**tail-tolerant** for systems designed to produce a predictable whole out of
unpredictable parts.
