---
type: razor
title: Amdahl's Law
sidebar_position: 9
family: Laws of systems
defines: [Amdahl's Law, serial fraction]
sources:
  - "Gene Amdahl, 'Validity of the single processor approach to achieving large scale computing capabilities' (1967)"
---

## Statement

Speedup is capped by the fraction you did not parallelise — optimise the bottleneck or do not
bother.

## In plain terms

**Amdahl's Law** puts a hard ceiling on optimisation. If 20% of a task cannot be sped up, then
making the other 80% infinitely fast still leaves you at five times faster, forever. The **serial
fraction** decides the maximum, and no amount of effort on the rest can exceed it.

## Decides

Whether an optimisation is worth doing, before doing it.

## Why it holds

The arithmetic is direct. If a fraction *p* of the work can be sped up by a factor *s*, the overall
speedup is:

$$
S = \frac{1}{(1 - p) + \frac{p}{s}}
$$

As *s* grows without bound, the second term vanishes and the whole expression converges to
`1/(1−p)`. Twenty percent serial gives a ceiling of 5×; ten percent gives 10×; one percent gives
100×.

The consequence people miss is how quickly the ceiling bites. Halving the parallel portion of a
task that is 30% serial gets you from 1× to 1.5×, not to 2× — and doubling the effort after that
returns almost nothing.

It generalises far beyond parallelism. Any optimisation of a component is bounded by that
component's share of the total, which is why profiling before optimising is not a nicety: work on
something that is 3% of the runtime and the best possible outcome is 3%.

## Example

A report takes 40 seconds: 30 seconds of database query and 10 seconds of rendering. A team spends
three weeks optimising the rendering, and gets it from 10 seconds to 1.

Total time is now 31 seconds. A 90% improvement in the rendering produced a 22% improvement
overall, and any further rendering work is bounded by the one second that remains.

The ceiling was knowable in advance. Rendering was 25% of the runtime, so even reducing it to zero
caps the improvement at 1.33× — three weeks of work with a mathematically guaranteed maximum of
ten seconds saved.

The database query is where the available improvement lives, and an index that takes an afternoon
brings 30 seconds to 4. Total: 5 seconds, an 8× improvement, from one day of work aimed at the
right component.

## Limits

It assumes the workload is fixed, which is often false. [[Gustafson's Law]] is the complement: when
the problem grows with the available capacity, the serial fraction shrinks as a proportion and the
ceiling lifts.

It also assumes the serial fraction is genuinely irreducible. Frequently the useful move is not
speeding up the serial part but removing it — caching it, doing it once instead of per request, or
restructuring so it is not on the critical path.

And in real systems the parallel portion does not scale linearly either. Coordination and
contention mean actual throughput falls short of the law's optimistic ceiling, which is what
[[Universal Scalability Law|the Universal Scalability Law]] models.

## Source

Amdahl presented the argument at a 1967 conference, and it was polemical rather than theoretical:
he was arguing against the then-popular claim that massively parallel machines would displace
single-processor designs, and the law is the arithmetic behind the objection.

The framing has outlived the argument it was made in. It is now applied to any optimisation
decision, and the general form — improvement is bounded by the share of the whole — is the version
worth carrying.
