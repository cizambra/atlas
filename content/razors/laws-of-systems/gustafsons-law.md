---
type: razor
title: Gustafson's Law
sidebar_position: 10
family: Laws of systems
defines: [Gustafson's Law, scaled speedup]
sources:
  - "John Gustafson, 'Reevaluating Amdahl's Law' (1988)"
  - "Gene Amdahl (1967) — the law it responds to"
---

## Statement

Amdahl's ceiling lifts when the problem grows with the machine — scale the work, not just the
workers.

## In plain terms

**Gustafson's Law** is the answer to [[Amdahl's Law]]'s pessimism, and it turns on a change of
question. Amdahl asks how much faster a *fixed* problem runs on more machines, which has a hard
ceiling. Gustafson asks how much *more* problem you can handle in the same time — and that answer
grows roughly linearly.

## Decides

Whether more capacity will help, which depends on whether your workload is fixed or elastic.

## Why it holds

The serial fraction is usually a fixed *amount* rather than a fixed *proportion*. Setup, loading
and coordination take about the same time regardless of how much work follows, so as the workload
grows the serial part becomes a smaller share of the total — and the ceiling it imposes rises.

That inverts the practical conclusion. Amdahl's arithmetic says a 10% serial fraction caps you at
10×; Gustafson's observation is that the 10% was measured on a small problem, and on a problem ten
times larger the same absolute serial time is 1% — so the ceiling is now 100×.

The **scaled speedup** formulation makes it explicit: with a serial fraction *s* and *N*
processors, speedup is `N − s(N − 1)`, which is close to linear in *N* when *s* is small.

Which is right depends entirely on the workload, and that is the useful part. Fixed-size problems
are Amdahl's world and hit the wall. Problems that grow — more users, more data, higher fidelity —
are Gustafson's, and capacity keeps buying.

## Example

Two systems add capacity and get opposite results.

The first runs a nightly batch over a fixed dataset: 40 minutes, of which 8 are serial setup and
loading. Doubling the machines takes it to 24 minutes, quadrupling to 16, and past that the
improvement collapses toward the 8-minute floor. This is Amdahl's world, and the ceiling is 5×
whatever is spent.

The second serves search over a corpus that grows with the business. Adding machines does not make
any single query faster — but it holds query latency flat while the corpus goes from 10 million to
100 million documents, because the serial coordination per query stayed roughly constant while the
parallel work grew tenfold.

The second system's operators would describe capacity as scaling well and the first system's would
describe it as scaling badly. Neither is a property of the hardware; both are properties of whether
the problem grows.

## Limits

The problem has to actually grow, and growth has to be the thing you want. Scaling a batch job to
process ten times the data is only useful if ten times the data is worth processing.

It also assumes the parallel portion genuinely parallelises without new coordination. In practice
contention and coherency costs rise with node count, which is what
[[Universal Scalability Law|the Universal Scalability Law]] models — and past some size, real systems get slower rather than
merely stopping getting faster.

And the two laws are frequently presented as opposed, which misreads both. They answer different
questions about the same system, and the useful move is knowing which question your situation is
asking.

## Source

Gustafson published the argument in 1988 while at Sandia National Laboratories, based on measured
speedups above 1,000× on a 1,024-processor machine — results Amdahl's Law appeared to forbid.

The resolution was that the problems had been scaled with the machine rather than held fixed, and
the paper's contribution is the observation that this is what people actually do with more capacity.
