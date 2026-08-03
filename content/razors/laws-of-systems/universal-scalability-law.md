---
type: razor
title: The Universal Scalability Law
sidebar_position: 11
family: Laws of systems
defines: [Universal Scalability Law, contention, coherency, retrograde scaling]
sources:
  - "Neil Gunther, Guerrilla Capacity Planning (2007)"
  - "Neil Gunther, 'A Simple Capacity Model of Massively Parallel Transaction Systems' (1993)"
  - "Gene Amdahl (1967) — the special case with no coherency term"
---

## Statement

Contention flattens your scaling curve and coherency bends it downward — past some node count,
adding capacity loses throughput.

## In plain terms

The **Universal Scalability Law** adds the term [[Amdahl's Law]] leaves out. Amdahl says
serialisation caps your speedup at a ceiling. Gunther's model says there is a second cost — keeping
the nodes consistent with each other — and unlike contention, it gets *worse* faster than linearly,
so the curve does not flatten. It turns over.

## Decides

Whether adding capacity will help, plateau or actively hurt.

## Why it holds

The model has two penalty terms and they behave differently:

$$
C(N) = \frac{N}{1 + \alpha(N-1) + \beta N(N-1)}
$$

**Contention** — the α term — is queueing for a shared resource: a lock, a database, a single
writer. It grows linearly with N and produces Amdahl's ceiling, a curve that flattens.

**Coherency** — the β term — is the cost of nodes agreeing with each other, and it grows with N²
because every node may have to communicate with every other. That quadratic term eventually
dominates any linear gain, which is what bends the curve down.

**Retrograde scaling** is the consequence and the reason the law matters: past some node count,
adding a machine reduces total throughput. That is not a plateau, it is a loss, and it is
invisible to any model that only has a serial fraction.

The practical value is that fitting real measurements to the curve gives you a predicted peak —
so you can know the node count at which capacity stops helping before you buy it.

## Example

A service is scaled out to handle load. From 2 to 8 nodes, throughput roughly triples — sublinear,
as expected, and everyone is satisfied.

From 8 to 16 nodes throughput improves about 20%. From 16 to 24 it is flat. At 32 nodes it is
measurably *worse* than at 16, and the team's first assumption is a bug.

There is no bug. Every node maintains a shared cache invalidation channel, so each write is
broadcast to all peers — a coherency cost that grows with N². At 16 nodes the invalidation traffic
is manageable; at 32 it is consuming more capacity than the additional nodes provide.

Fitting the earlier measurements to the model would have predicted the peak at around 18 nodes,
from data collected between 2 and 8. The fix is architectural rather than operational: removing the
all-to-all invalidation removes the β term, and the curve reverts to Amdahl-shaped.

## Limits

It is a model fitted to measurements, not a derivation from first principles, so it describes
systems well and does not explain them. Knowing β is high tells you coherency is the problem; it
does not tell you which coherency.

Getting a useful fit needs several data points across a real range, and the temptation is to
extrapolate from two. Two points fit anything.

And it is sometimes read as an argument against scaling out. It is the opposite: it says where the
limit is and which term is producing it, which is what lets you remove that term rather than
discovering the ceiling in production.

## Source

Gunther developed the model in the early 1990s and presents it most accessibly in *Guerrilla
Capacity Planning*. The formulation generalises Amdahl's Law, which is the special case where
β = 0 — no coherency cost, so the curve flattens rather than turning over.

The name reflects the claim that the same two-term shape fits hardware, software and human
organisations alike, which is why the law is quoted about team size as often as about node count.
