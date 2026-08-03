---
type: razor
title: Circuit breaker and bulkhead
sidebar_position: 17
family: Design and architecture
defines: [circuit breaker, bulkhead, half-open]
sources:
  - "Michael Nygard, Release It! (2007)"
  - "Netflix Hystrix and the resilience4j lineage (2012–)"
---

## Statement

Stop calling a failing dependency, and partition resources so one saturated pool cannot take the
process with it.

## In plain terms

A **circuit breaker** watches a dependency's failure rate and, past a threshold, stops calling it —
failing fast instead of waiting. A **bulkhead** gives each dependency its own resource pool, so one
that is slow cannot consume every thread in the process. Both exist to stop a single failing
component from taking everything with it.

## Decides

What to put around a call to a dependency that can be slow or unavailable.

## Why it holds

The failure being prevented is cascading, and it works through resource exhaustion rather than
through errors. A dependency that returns errors quickly is survivable; one that is *slow* is what
kills you, because every waiting request holds a thread, and the threads run out.

The circuit breaker's value is in failing fast. Once a dependency is known to be down, waiting for
a timeout on every request is pure cost — the request will fail anyway, and the waiting is what
exhausts the pool. Opening the circuit converts a slow failure into an immediate one.

The **half-open** state is what makes it recover automatically. After a cooldown, one request is
allowed through: success closes the circuit, failure reopens it. Without it, a breaker is a manual
switch someone has to remember to reset.

The bulkhead is the containment half and is independently valuable. Separate connection pools or
thread pools per dependency mean a saturated one bounds its own damage — the ship metaphor is
exact, since the point of a bulkhead is that a breach floods one compartment.

Together they change the failure mode from total to partial, which is the whole objective of
[[design for failure]].

## Example

A checkout service calls a fraud-scoring provider on every order. The provider has a 500ms typical
latency and a 5-second timeout.

The provider degrades: not down, just slow, responding in 4.8 seconds. Every checkout request now
holds a thread for nearly five seconds. At 200 requests per second, the 200-thread pool is
exhausted in a second, and checkout stops serving anything at all — including requests that do not
touch fraud scoring.

With a bulkhead, the fraud calls have their own pool of 40. Saturation is confined to it: 40
requests wait, the rest of checkout is unaffected, and the failure is visible rather than total.

With a circuit breaker, it gets shorter still. After the failure rate crosses the threshold, the
breaker opens and subsequent calls fail immediately without waiting — and the pre-agreed fallback
applies, which here is to accept low-value orders unscored and queue high-value ones for review.

Sixty seconds later, half-open lets one request through. The provider is still slow, so it reopens.
Three minutes later the provider recovers, the probe succeeds, and normal operation resumes with no
human involved.

## Limits

Both add machinery and both have parameters that are easy to get wrong. A breaker with too low a
threshold opens on normal variance; one with too high a threshold never opens. The parameters need
real traffic data, and defaults copied from a blog post are usually wrong.

The fallback is the harder problem and the one the pattern does not solve. Deciding what to do when
the circuit is open — degrade, queue, reject, serve stale — is a product decision, and a breaker
whose fallback is an unhandled exception has changed the timing of the failure and nothing else.

Bulkheads also reduce peak utilisation by design. Partitioned pools mean idle capacity in one
cannot serve pressure in another, which is the cost of the containment.

## Source

Nygard introduced both patterns in *Release It!*, drawing on production incident experience, and
the book's framing is that these are stability patterns — things that keep a system alive under
conditions it was not designed for.

Netflix's Hystrix made the combination standard practice in the 2010s by shipping breakers,
bulkheads and fallbacks as one library. Hystrix is now in maintenance mode, with resilience4j and
service-mesh implementations carrying the same patterns.
