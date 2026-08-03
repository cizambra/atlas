---
type: razor
title: Fallacies of distributed computing
sidebar_position: 12
family: Laws of systems
defines: [the eight fallacies]
sources:
  - "Peter Deutsch, Sun Microsystems (1994); James Gosling added the eighth (1997)"
  - "Arnon Rotem-Gal-Oz, 'Fallacies of Distributed Computing Explained' (2006)"
---

## Statement

The network is not reliable, latency is not zero, bandwidth is not infinite, and topology always
changes.

## In plain terms

**The eight fallacies** are assumptions that are true enough on one machine and false across a
network — and they are false in ways that only appear under load, at scale, or during an incident.
Code written as though a remote call were a local one works perfectly in development and fails in
production for reasons the code has no concept of.

## Decides

What to design for when a call crosses a network boundary.

## Why it holds

Each fallacy is a property of local calls that people carry across the boundary unexamined:

- **The network is reliable.** It is not. Calls fail, partially succeed, and succeed after the
  caller gave up — which is why retries need idempotency.
- **Latency is zero.** A local call is nanoseconds; a network call is milliseconds, and a chatty
  interface that made sense in-process is unusable remotely.
- **Bandwidth is infinite.** Payload size stops being free, and the convenient
  fetch-everything-then-filter becomes the bottleneck.
- **The network is secure.** Anything crossing it is on someone else's wire.
- **Topology doesn't change.** Instances move, scale and disappear; hard-coded addresses rot.
- **There is one administrator.** The other end is operated by people with their own schedule, and
  they will upgrade during your launch.
- **Transport cost is zero.** Serialisation, encryption and egress all cost real money and real
  CPU.
- **The network is homogeneous.** Different stacks, versions, encodings and timeouts, all
  disagreeing quietly.

The shared mechanism is that all eight are approximately true in development — one machine, no
load, a fast local link — so nothing in normal work surfaces them.

## Example

A service extraction moves an in-process call to a remote one. The code is unchanged apart from
the transport, and the tests pass.

In production it fails in four distinct ways, one per fallacy. The call site loops over 200 items
making one request each, which was free in-process and is now 200 round trips at 4 ms. The
response body carries the full object graph, because filtering was cheap when it was a pointer.
There is no timeout, because a local call could not hang — so a slow downstream turns into
exhausted threads upstream.

And a retry was added after the first incident, without idempotency, so a request that timed out
after the server had processed it produces a duplicate charge.

Each fix is small and none was needed a week earlier. The extraction did not change the logic; it
changed which assumptions hold.

## Limits

The fallacies say design for failure, not distrust everything equally. A call within a datacentre
and a call to a third-party API over the public internet are both remote and have very different
probabilities, and treating them identically is over-engineering.

They also do not argue against distributed systems. The cost of the list is the price of
distribution, and the correct response is to distribute deliberately rather than accidentally —
which is a strong argument for not splitting a service without a reason.

And the mitigations have their own costs. Timeouts, retries, circuit breakers and idempotency keys
are all machinery, and adding all of them to every call produces a system where the resilience
logic outweighs the business logic.

## Source

Peter Deutsch formulated seven of them at Sun in 1994, drawing on the experience of building
distributed systems where remote calls had been made deliberately transparent — an idea the
fallacies are largely a critique of. James Gosling added the eighth in 1997.

Rotem-Gal-Oz's 2006 essay is the standard expansion, and it is where most of the practical
mitigations attached to each fallacy come from.
